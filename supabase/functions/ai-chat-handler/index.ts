import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// This Edge Function includes a risk-scoring layer to detect high-risk user input
// and trigger an escalation flow when necessary.

// Define high-risk keywords with associated risk scores.
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

// Function to determine the general risk category for AI prompting
const assessRisk = (message: string): "low" | "medium" | "high" => {
    const lowerMessage = message.toLowerCase();
    const highRisk = ["suicide", "kill myself", "end it all", "hurt myself"];
    const mediumRisk = ["depressed", "anxious", "panic", "can't cope"];
    if (highRisk.some(kw => lowerMessage.includes(kw))) return "high";
    if (mediumRisk.some(kw => lowerMessage.includes(kw))) return "medium";
    return "low";
};

serve(async (req) => {
  console.log("ai-chat-handler function invoked.");

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userMessage } = await req.json();
    const riskScore = calculateRiskScore(userMessage);
    console.log(`Calculated risk score: ${riskScore}`);

    if (riskScore > RISK_THRESHOLD) {
      console.warn(`High-risk message detected. Score: ${riskScore}. Escalating.`);
      // If risk is high, immediately return the crisis message.
      return new Response(JSON.stringify({
        content: "I am concerned by what you've shared. It sounds like you are in immediate distress, and it's important to reach out for help right now. Please call a crisis hotline like 1075 immediately. You are not alone and help is available.",
        escalate: true,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set.");

    // Corrected system prompts object
    const systemPrompts = {
      high: "You are a crisis support assistant. The user is in significant distress. Your primary goal is to guide them to professional help immediately. Respond with empathy and provide clear, direct instructions to contact emergency services like the 1075 crisis line in India.",
      medium: "You are a supportive mental health companion. The user is feeling anxious or depressed. Provide gentle, evidence-based coping strategies, such as grounding techniques or simple breathing exercises, and offer emotional validation.",
      low: "You are a friendly and supportive chatbot. The user is dealing with general stress or worries. Offer a listening ear, validate their feelings, and ask open-ended questions to help them explore their thoughts."
    };

    // Determine the risk level to select the appropriate system prompt
    const risk = assessRisk(userMessage);

    const payload = {
      contents: [{
        parts: [{
          text: `${systemPrompts[risk]}\n\nUser message: ${userMessage}\n\nRespond with empathy and appropriate guidance.`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200,
      }
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!geminiResponse.ok) throw new Error(`Gemini API Error: ${geminiResponse.statusText}`);

    const data = await geminiResponse.json();
    const aiContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiContent) {
      console.warn("No content returned from Gemini API, possibly due to a safety block.");
      return new Response(JSON.stringify({ content: "I'm sorry, I'm unable to respond to that topic right now. Let's talk about something else." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ content: aiContent, escalate: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error in AI Chat Edge Function:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

