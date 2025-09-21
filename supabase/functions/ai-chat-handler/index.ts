
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Safety layer (as before)
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
      return new Response(
        JSON.stringify({
          content: "I am concerned by what you've shared. It sounds like you are in immediate distress, and it's important to reach out for help right now. Please call a crisis hotline like 1075 immediately. You are not alone and help is available.",
          escalate: true,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const pythonBackendUrl = 'https://s4ik-mental-health-hub.hf.space/chat';
    const payload = { user_message: userMessage };

    console.log("Forwarding request to Python backend API.");

    const backendResponse = await fetch(pythonBackendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!backendResponse.ok) {
      throw new Error(`Python Backend API Error: ${backendResponse.statusText}`);
    }

    const data = await backendResponse.json();
    const aiContent = data.reply;

    if (!aiContent) {
      console.warn("No content returned from Python backend.");
      return new Response(
        JSON.stringify({ content: "I'm sorry, I'm unable to respond to that topic right now. Let's talk about something else." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ content: aiContent, escalate: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error in AI Chat Edge Function:', error.message);
    return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
