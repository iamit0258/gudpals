
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const now = new Date();
    const currentTime = now.toISOString();

    console.log(`Checking for event reminders at ${currentTime}`);

    // Get all events that need reminders
    const { data: events, error: eventsError } = await supabaseClient
      .from('activities')
      .select(`
        id,
        title,
        start_time,
        registrations!inner (
          user_id,
          registered_at
        )
      `)
      .gte('start_time', currentTime)
      .lte('start_time', new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString()); // Next 25 hours

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      throw eventsError;
    }

    console.log(`Found ${events?.length || 0} events with registrations`);

    let notificationsSent = 0;

    for (const event of events || []) {
      const eventTime = new Date(event.start_time);
      const timeDiff = eventTime.getTime() - now.getTime();
      const hoursUntil = timeDiff / (1000 * 60 * 60);
      const minutesUntil = timeDiff / (1000 * 60);

      let shouldSendReminder = false;
      let reminderMessage = '';

      // Check if we should send reminders
      if (hoursUntil <= 24 && hoursUntil >= 23.5) {
        shouldSendReminder = true;
        reminderMessage = `Don't forget: ${event.title} starts tomorrow at ${eventTime.toLocaleTimeString()}`;
      } else if (hoursUntil <= 1 && hoursUntil >= 0.75) {
        shouldSendReminder = true;
        reminderMessage = `Starting soon: ${event.title} begins in 1 hour`;
      } else if (minutesUntil <= 15 && minutesUntil >= 10) {
        shouldSendReminder = true;
        reminderMessage = `Starting now: ${event.title} begins in 15 minutes`;
      }

      if (shouldSendReminder) {
        // Send notifications to all registered users
        for (const registration of event.registrations) {
          try {
            const { error: notificationError } = await supabaseClient
              .from('notifications')
              .insert({
                user_id: registration.user_id,
                title: 'Event Reminder',
                message: reminderMessage,
                type: 'reminder',
                action_url: '/events'
              });

            if (notificationError) {
              console.error('Error sending notification:', notificationError);
            } else {
              notificationsSent++;
              console.log(`Sent reminder to user ${registration.user_id} for event ${event.title}`);
            }
          } catch (error) {
            console.error('Error in notification loop:', error);
          }
        }
      }
    }

    console.log(`Sent ${notificationsSent} reminders`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        notificationsSent,
        eventsChecked: events?.length || 0
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );

  } catch (error) {
    console.error('Error in event-reminders function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
});
