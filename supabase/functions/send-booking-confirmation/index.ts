import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// This function sends a booking confirmation email.
// In a real-world app, you'd use a service like Resend, SendGrid, or Postmark.
// Here, we simulate the API call.

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { bookingDetails } = await req.json();
    const apiKey = Deno.env.get("RESEND_API_KEY"); // You would get this from your email provider

    if (!apiKey) {
      // In production, you'd want to fail gracefully or log this seriously.
      console.warn("Email API key is not set. Skipping email notification.");
      return new Response(JSON.stringify({ message: "Email API key not configured, but booking was successful." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Example payload for Resend API
    const emailPayload = {
      from: "OpenWell <noreply@yourdomain.com>",
      to: [bookingDetails.email],
      subject: `Booking Confirmed: Your session with ${bookingDetails.counsellorName}`,
      html: `
        <h1>Booking Confirmed!</h1>
        <p>Hi ${bookingDetails.userName || 'there'},</p>
        <p>Your session with <strong>${bookingDetails.counsellorName}</strong> is confirmed for:</p>
        <p><strong>Date:</strong> ${bookingDetails.date}</p>
        <p><strong>Time:</strong> ${bookingDetails.time}</p>
        <p>We're glad you've taken this step for your mental well-being.</p>
      `,
    };

    // Simulate the API call to an email service
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(emailPayload),
    });

    // NOTE: Since we are using a placeholder API key, this fetch will fail.
    // In a real project, this would send the email.
    if (!emailResponse.ok && apiKey !== "YOUR_RESEND_API_KEY_PLACEHOLDER") {
       // Only throw error if a real key is likely being used
      throw new Error(`Failed to send email: ${await emailResponse.text()}`);
    }

    return new Response(JSON.stringify({ message: "Confirmation email process initiated." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
