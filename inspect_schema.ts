
import { supabase } from './src/integrations/supabase/client';

async function inspectSchema() {
    console.log("Inspecting 'profiles' table...");

    // Try to select one row to see if table exists and what columns return
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error accessing 'profiles':", error);
    } else {
        console.log("Table 'profiles' exists.");
        if (data && data.length > 0) {
            console.log("Sample row:", data[0]);
        } else {
            console.log("Table is empty, but exists.");
        }
    }
}

inspectSchema();
