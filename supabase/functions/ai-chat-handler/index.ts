// index.ts

// If running in Deno, ensure you use the Deno CLI to execute this file.
// If you want to run in Node.js, replace the following line with:
// import { createServer } from "http";
// and adjust the rest of the code accordingly.
// If using Deno, uncomment the following line:
// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// If using Node.js, use the following imports:
import { createServer } from "http";
import { corsHeaders } from "../_shared/cors.ts";

// --- SAFETY LAYER (UNCHANGED) ---
// This critical safety layer remains in the Edge Function to provide an
// immediate response for high-risk input without calling the backend.

const riskKeywords: { [key: string]: number } = {
  "want to die": 10,
  "kill myself": 10,
  "end my life": 10,
  "suicide": 8,
  "have a plan": 8,
  "pills": 5,
  "gun": 5,
  "rope": 5,
  "hurt myself": 7,
  "cutting": 7,
  "don't want to live": 6,
  "no reason to live": 6,
  "better off dead": 6,
};

const RISK_THRESHOLD = 9;

const calculateRiskScore = (message: string): number => {
  let score = 0;
  const lowerCaseMessage = message.toLowerCase();
  for (const keyword in riskKeywords) {
    if (lowerCaseMessage.includes(keyword)) {
      score += riskKeywords[keyword];
    }
  }
  return score;
};
createServer(async (req, res) => {
  console.log("ai-chat-handler function invoked.");

  // Standard CORS preflight request handling
  if (req.method === "OPTIONS") {
    res.writeHead(200, corsHeaders);
    res.end("ok");
    return;
  }

  try {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', async () => {
      const { userMessage } = JSON.parse(body);

      // 1. Calculate risk score based on the user's message
      const riskScore = calculateRiskScore(userMessage);
      console.log(`Calculated risk score: ${riskScore}`);

      // 2. If risk is high, escalate immediately and DO NOT call the backend.
      if (riskScore > RISK_THRESHOLD) {
        console.warn(`High-risk message detected. Score: ${riskScore}. Escalating.`);
        res.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" });
        res.end(JSON.stringify({
          content: "I am concerned by what you've shared. It sounds like you are in immediate distress, and it's important to reach out for help right now. Please call a crisis hotline like 1075 immediately. You are not alone and help is available.",
          escalate: true,
        }));
        return;
      }

      // 3. --- MODIFIED SECTION ---
      // If risk is not critical, call your Python backend API.
      
      // Define the URL of your deployed Python API
      const pythonBackendUrl = 'https://s4ik-mental-health-hub.hf.space/chat';

      // Prepare the payload for your Python API
      const payload = {
        user_message: userMessage,
        // You can add phq_score and gad_score here if you collect them in your frontend
        // phq_score: 0, 
        // gad_score: 0,
      };

      console.log("Forwarding request to Python backend API.");

      // Call your Python backend using fetch
      const fetch = (await import('node-fetch')).default;
      const backendResponse = await fetch(pythonBackendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!backendResponse.ok) {
        throw new Error(`Python Backend API Error: ${backendResponse.statusText}`);
      }

      const data = await backendResponse.json() as { reply?: string };
      // Your Python API returns a JSON object with a "reply" key
      const aiContent = data.reply; 

      // Handle cases where the backend might not return content
      if (!aiContent) {
        console.warn("No content returned from Python backend.");
        res.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" });
        res.end(JSON.stringify({ content: "I'm sorry, I'm unable to respond to that topic right now. Let's talk about something else." }));
        return;
      }

      // 4. Return the response from your backend to the client
      res.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" });
      res.end(JSON.stringify({ content: aiContent, escalate: false }));
    });

  } catch (error) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      console.error('Error in AI Chat Edge Function:', error.message);
      errorMessage = error.message;
    } else {
      console.error('Error in AI Chat Edge Function:', error);
    }
    res.writeHead(500, { ...corsHeaders, "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: errorMessage }));
  }
}).listen(8000);