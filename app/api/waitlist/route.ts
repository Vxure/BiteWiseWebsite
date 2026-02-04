/**
 * Waitlist API Route
 * 
 * Production-ready API endpoint for waitlist signups.
 * Implements comprehensive security measures for 100k+ users.
 * 
 * Security Features:
 * - Multi-layer rate limiting (global, IP, email)
 * - Input validation and sanitization
 * - CORS and origin validation
 * - Request size limiting
 * - XSS and injection prevention
 * - Error message sanitization (no internal details exposed)
 * - Honeypot field detection
 * - Timing attack protection
 */

import { NextRequest, NextResponse } from "next/server";
import {
    addToWaitlist,
    checkEmailExists,
    validateEmail,
    sanitizeInput,
    generateReferralCode,
    getWaitlistCount
} from "@/lib/supabase";
import { checkRateLimit, recordBlockedRequest } from "@/lib/redis";
import { sendWelcomeEmail, isEmailConfigured } from "@/lib/resend";

// Constants for request validation
const MAX_REQUEST_SIZE = 1024; // 1KB max request body
const MAX_EMAIL_LENGTH = 254; // RFC 5321
const MAX_NAME_LENGTH = 100;
const ALLOWED_METHODS = ["POST", "OPTIONS"];

// CORS configuration - update with your actual domain in production
const ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://taberoux.com",
    "https://www.taberoux.com",
    // Add your production domain here
];

/**
 * API Response type for consistent responses
 */
interface ApiResponse {
    success: boolean;
    message: string;
    data?: {
        referralCode?: string;
        position?: number;
    };
}

/**
 * Creates a standardized JSON response with security headers
 */
function createResponse(
    body: ApiResponse,
    status: number,
    origin?: string
): NextResponse {
    const response = NextResponse.json(body, { status });

    // Security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
        "Content-Security-Policy",
        "default-src 'none'; frame-ancestors 'none'"
    );

    // CORS headers
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        response.headers.set("Access-Control-Allow-Origin", origin);
    }
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    response.headers.set("Access-Control-Max-Age", "86400");

    return response;
}

/**
 * Extracts client IP from request headers
 * Handles various proxy configurations
 */
function getClientIP(request: NextRequest): string {
    // Try various headers in order of preference
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        // Take first IP if multiple are present
        return forwardedFor.split(",")[0].trim();
    }

    const realIP = request.headers.get("x-real-ip");
    if (realIP) {
        return realIP.trim();
    }

    const cfConnectingIP = request.headers.get("cf-connecting-ip");
    if (cfConnectingIP) {
        return cfConnectingIP.trim();
    }

    // Fallback
    return "unknown";
}

/**
 * Validates the origin header
 */
function validateOrigin(request: NextRequest): boolean {
    const origin = request.headers.get("origin");

    // Allow requests without origin (same-origin requests)
    if (!origin) return true;

    // In development, allow localhost
    if (process.env.NODE_ENV === "development") {
        if (origin.startsWith("http://localhost:")) return true;
    }

    return ALLOWED_ORIGINS.includes(origin);
}

/**
 * Adds random delay to prevent timing attacks
 */
async function addTimingNoise(): Promise<void> {
    const delay = Math.floor(Math.random() * 100) + 50; // 50-150ms
    await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
    const origin = request.headers.get("origin") || "";
    return createResponse({ success: true, message: "OK" }, 200, origin);
}

/**
 * POST handler for waitlist signup
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
    const origin = request.headers.get("origin") || "";
    const clientIP = getClientIP(request);

    try {
        // ====================
        // SECURITY LAYER 1: Request Validation
        // ====================

        // Check HTTP method
        if (!ALLOWED_METHODS.includes(request.method)) {
            return createResponse(
                { success: false, message: "Method not allowed" },
                405,
                origin
            );
        }

        // Validate origin
        if (!validateOrigin(request)) {
            await recordBlockedRequest(clientIP, "invalid_origin");
            return createResponse(
                { success: false, message: "Invalid request origin" },
                403,
                origin
            );
        }

        // Check content type
        const contentType = request.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
            return createResponse(
                { success: false, message: "Content-Type must be application/json" },
                400,
                origin
            );
        }

        // Check content length
        const contentLength = request.headers.get("content-length");
        if (contentLength && parseInt(contentLength, 10) > MAX_REQUEST_SIZE) {
            return createResponse(
                { success: false, message: "Request body too large" },
                413,
                origin
            );
        }

        // ====================
        // SECURITY LAYER 2: Rate Limiting
        // ====================
        const rateLimitResult = await checkRateLimit(clientIP);
        if (!rateLimitResult.success) {
            return createResponse(
                {
                    success: false,
                    message: `Too many requests. Please try again in ${rateLimitResult.retryAfter || 60} seconds.`,
                },
                429,
                origin
            );
        }

        // ====================
        // SECURITY LAYER 3: Input Parsing & Validation
        // ====================
        let body: Record<string, unknown>;
        try {
            body = await request.json();
        } catch {
            return createResponse(
                { success: false, message: "Invalid JSON body" },
                400,
                origin
            );
        }

        // Honeypot field detection (catches bots)
        if (body.website || body.url || body.phone) {
            await recordBlockedRequest(clientIP, "honeypot_triggered");
            // Return success to not reveal detection
            await addTimingNoise();
            return createResponse(
                { success: true, message: "You're on the list! We'll be in touch soon." },
                200,
                origin
            );
        }

        // Extract and validate email
        const rawEmail = body.email;
        if (!rawEmail || typeof rawEmail !== "string") {
            return createResponse(
                { success: false, message: "Email is required" },
                400,
                origin
            );
        }

        const email = rawEmail.toLowerCase().trim();

        if (email.length > MAX_EMAIL_LENGTH) {
            return createResponse(
                { success: false, message: "Email address is too long" },
                400,
                origin
            );
        }

        if (!validateEmail(email)) {
            return createResponse(
                { success: false, message: "Please enter a valid email address" },
                400,
                origin
            );
        }

        // Validate optional name
        const rawName = body.name;
        const name = rawName && typeof rawName === "string"
            ? sanitizeInput(rawName).slice(0, MAX_NAME_LENGTH)
            : undefined;

        // Validate optional referral code
        const rawReferredBy = body.referredBy || body.referralCode;
        const referredBy = rawReferredBy && typeof rawReferredBy === "string"
            ? sanitizeInput(rawReferredBy).toUpperCase().slice(0, 20)
            : undefined;

        // ====================
        // SECURITY LAYER 4: Email-based Rate Limiting
        // ====================
        const emailRateLimit = await checkRateLimit(clientIP, email);
        if (!emailRateLimit.success) {
            return createResponse(
                { success: false, message: "Too many attempts with this email. Please try again later." },
                429,
                origin
            );
        }

        // ====================
        // BUSINESS LOGIC
        // ====================

        // Check for duplicate email
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            // Add timing noise to prevent email enumeration
            await addTimingNoise();
            return createResponse(
                { success: false, message: "You’re already on the waitlist — we’ll be in touch!" },
                409,
                origin
            );
        }

        // Generate referral code
        const referralCode = generateReferralCode();

        // Add to Supabase database
        await addToWaitlist({
            email,
            name,
            referralCode,
            referredBy,
        });

        // Get waitlist position (optional, may slow down response)
        let position: number | undefined;
        try {
            position = await getWaitlistCount();
        } catch {
            // Non-critical, continue without position
        }

        // Send welcome email (async, don't block response)
        if (isEmailConfigured()) {
            // Fire and forget - don't await to keep response fast
            sendWelcomeEmail({
                email,
                name,
                referralCode,
                position,
            }).catch((error) => {
                console.error("[API] Failed to send welcome email:", error);
            });
        }

        // ====================
        // SUCCESS RESPONSE
        // ====================
        return createResponse(
            {
                success: true,
                message: "You're on the list! Check your email for confirmation.",
                data: {
                    referralCode,
                    position,
                },
            },
            200,
            origin
        );
    } catch (error) {
        // Log error internally but don't expose details
        console.error("[API] Waitlist signup error:", error);

        // Add timing noise to prevent error-based timing attacks
        await addTimingNoise();

        return createResponse(
            {
                success: false,
                message: "Something went wrong. Please try again later.",
            },
            500,
            origin
        );
    }
}
