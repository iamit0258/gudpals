
import { createClient } from '@supabase/supabase-js';

// Hardcoded credentials from src/integrations/supabase/client.ts
const SUPABASE_URL = "https://smcyqefafcehvlkkyivl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtY3lxZWZhZmNlaHZsa2t5aXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MjIxODAsImV4cCI6MjA1ODk5ODE4MH0.-_r9f0bz14MyMQ7IMQ-N1MsA2q6i70N1t2ao7ilSYt8";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testConnection() {
    console.log("Testing Supabase connection...");
    try {
        // Try to fetch the current session (doesn't require auth, just checks connection)
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error("Connection failed:", error.message);
        } else {
            console.log("Connection successful!");
            console.log("Session data:", data);
        }

        // Try a simple query to a public table if possible, or just list tables?
        // Since we don't know the schema, auth check is the safest "connection" test.

    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

testConnection();
