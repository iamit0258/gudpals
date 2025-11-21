
import { supabase } from './src/integrations/supabase/client';

async function reproduceSync() {
    console.log("Attempting to sync dummy user...");

    const dummyUser = {
        id: "test_user_123",
        display_name: "Test User",
        email: "test@example.com",
        phone_number: null,
        photo_url: null,
        last_login_at: new Date().toISOString(),
    };

    const { error } = await supabase
        .from('profiles')
        .upsert(dummyUser, { onConflict: 'id' });

    if (error) {
        console.error("Sync Error Details:", JSON.stringify(error, null, 2));
    } else {
        console.log("Sync successful!");
    }
}

reproduceSync();
