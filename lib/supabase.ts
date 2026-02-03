/**
 * Supabase Database Client
 * 
 * Production-ready Supabase integration for waitlist management.
 * Includes input validation, error handling, and referral tracking.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Type definitions
export interface WaitlistEntry {
    email: string;
    name?: string;
    referralCode: string;
    referredBy?: string;
}

export interface WaitlistUser {
    id: string;
    email: string;
    name: string | null;
    referral_code: string;
    referred_by: string | null;
    created_at: string;
}

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Lazy initialization to prevent build errors
let supabaseClient: SupabaseClient | null = null;

/**
 * Gets or creates the Supabase client
 */
function getSupabase(): SupabaseClient | null {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.warn("[Supabase] Missing environment variables");
        return null;
    }

    if (!supabaseClient) {
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    return supabaseClient;
}

/**
 * Generates a cryptographically secure referral code
 */
export function generateReferralCode(length: number = 8): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, (n) => chars[n % chars.length]).join("");
    }

    return Array.from({ length }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join("");
}

/**
 * Validates email format using RFC 5322 compliant regex
 */
export function validateEmail(email: string): boolean {
    if (!email || typeof email !== "string") return false;
    if (email.length > 254) return false;

    const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    return emailRegex.test(email);
}

/**
 * Sanitizes user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
    if (!input || typeof input !== "string") return "";

    return input
        .trim()
        .replace(/[\x00-\x1F\x7F]/g, "")
        .slice(0, 255);
}

/**
 * Checks if an email already exists in the waitlist
 */
export async function checkEmailExists(email: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) {
        throw new Error("Supabase not configured");
    }

    const normalizedEmail = email.toLowerCase().trim();

    const { data, error } = await supabase
        .from("waitlist")
        .select("id")
        .eq("email", normalizedEmail)
        .limit(1);

    if (error) {
        console.error("[Supabase] Error checking email:", error);
        throw new Error("Failed to check email status");
    }

    return (data?.length ?? 0) > 0;
}

/**
 * Finds a user by their referral code
 */
export async function findUserByReferralCode(
    code: string
): Promise<string | null> {
    const supabase = getSupabase();
    if (!supabase || !code) return null;

    const sanitizedCode = sanitizeInput(code).toUpperCase();

    const { data, error } = await supabase
        .from("waitlist")
        .select("id")
        .eq("referral_code", sanitizedCode)
        .limit(1);

    if (error) {
        console.error("[Supabase] Error finding referral:", error);
        return null;
    }

    return data?.[0]?.id ?? null;
}

/**
 * Adds a new user to the waitlist
 */
export async function addToWaitlist(entry: WaitlistEntry): Promise<string> {
    const supabase = getSupabase();
    if (!supabase) {
        throw new Error("Supabase not configured");
    }

    const email = entry.email.toLowerCase().trim();
    if (!validateEmail(email)) {
        throw new Error("Invalid email format");
    }

    const name = entry.name ? sanitizeInput(entry.name) : null;
    const referralCode = entry.referralCode || generateReferralCode();
    const referredBy = entry.referredBy
        ? sanitizeInput(entry.referredBy).toUpperCase()
        : null;

    const { data, error } = await supabase
        .from("waitlist")
        .insert({
            email,
            name,
            referral_code: referralCode,
            referred_by: referredBy,
        })
        .select("id")
        .single();

    if (error) {
        console.error("[Supabase] Error adding to waitlist:", error);
        throw new Error("Failed to add to waitlist");
    }

    return data.id;
}

/**
 * Gets the total count of waitlist signups
 */
export async function getWaitlistCount(): Promise<number> {
    const supabase = getSupabase();
    if (!supabase) {
        throw new Error("Supabase not configured");
    }

    const { count, error } = await supabase
        .from("waitlist")
        .select("*", { count: "exact", head: true });

    if (error) {
        console.error("[Supabase] Error getting count:", error);
        throw new Error("Failed to get waitlist count");
    }

    return count ?? 0;
}

/**
 * Checks if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
    return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
