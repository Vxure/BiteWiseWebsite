
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testSupabase() {
    console.log("Testing Supabase connection...");
    console.log("URL:", SUPABASE_URL);
    console.log("Key length:", SUPABASE_ANON_KEY?.length);

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error("Missing Supabase credentials");
        return;
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    try {
        console.log("Attempting to query 'waitlist' table...");
        const { data, error, count } = await supabase
            .from("waitlist")
            .select("*", { count: "exact", head: true });

        if (error) {
            console.error("Supabase Error:", error);
        } else {
            console.log("Success! Count:", count);
        }
    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

testSupabase();
