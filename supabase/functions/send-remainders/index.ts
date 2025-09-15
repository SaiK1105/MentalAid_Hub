import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { format, addDays } from "https://esm.sh/date-fns@2.30.0";

// This function is a cron job that runs on a schedule.
// It finds bookings for the next day and sends reminder emails.

serve(async () => {
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}` } } }
    );

    // Get tomorrow's date in YYYY-MM-DD format
    const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");

    // Fetch all bookings for tomorrow
    const { data: bookings, error } = await supabaseClient
      .from("bookings")
      .select(`
        user_email,
        user_name,
        session_date,
        session_time,
        counsellors ( name )
      `)
      .eq("session_date", tomorrow);

    if (error) throw error;

    if (!bookings || bookings.length === 0) {
      return new Response(JSON.stringify({ message: "No bookings for tomorrow." }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Here you would loop through bookings and send emails
    // For brevity, we'll just log the action
    console.log(`Found ${bookings.length} bookings for tomorrow. Simulating sending reminders...`);
    for (const booking of bookings) {
      console.log(`- Sending reminder to ${booking.user_email} for session with ${booking.counsellors.name}`);
      // TODO: Add your email sending logic here, similar to the confirmation function
    }

    return new Response(JSON.stringify({ message: `Processed ${bookings.length} reminders.` }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(String(error?.message ?? error), { status: 500 });
  }
});
