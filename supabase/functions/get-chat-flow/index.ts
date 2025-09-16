import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    // Get the current user
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error("User not found");
    }

    // Define "recent" as the last 14 days
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

    // Query for recent assessments for the current user
    const { data: recentAssessments, error } = await supabaseClient
      .from('assessments')
      .select('type, score, created_at')
      .eq('user_id', user.id)
      .gte('created_at', fourteenDaysAgo)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const latestPhq9 = recentAssessments.find(a => a.type === 'phq9');
    const latestGad7 = recentAssessments.find(a => a.type === 'gad7');
    
    let responseBody;

    if (latestPhq9 && latestGad7) {
      // If recent scores are found, instruct the frontend to navigate to chat
      responseBody = {
        action: "navigate_to_chat",
        scores: {
          phq9Score: latestPhq9.score,
          gad7Score: latestGad7.score,
        }
      };
    } else {
      // If scores are not found, instruct the frontend to start the assessment
      responseBody = {
        action: "navigate_to_assessment"
      };
    }

    return new Response(JSON.stringify(responseBody), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      console.error('Error in get-chat-flow function:', error.message);
      errorMessage = error.message;
    }
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});