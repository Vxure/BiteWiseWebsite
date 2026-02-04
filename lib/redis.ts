/**
 * Upstash Redis Rate Limiter
 * 
 * Production-ready rate limiting for waitlist signups.
 * Prevents abuse and ensures fair access at scale (100k+ users).
 * 
 * Rate Limiting Strategy:
 * - Sliding window algorithm for smooth rate limiting
 * - Per-IP limiting to prevent single-source spam
 * - Per-email limiting to prevent enumeration attacks
 * - Global daily limit to control costs
 */

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";


// Validate environment variables
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Lazy initialization to prevent top-level errors
let redisInstance: Redis | null = null;
let signupRatelimitInstance: Ratelimit | null = null;
let strictRatelimitInstance: Ratelimit | null = null;
let globalRatelimitInstance: Ratelimit | null = null;

/**
 * Gets or creates the Redis client
 */
export function getRedis(): Redis | null {
    if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
        return null;
    }

    if (!redisInstance) {
        redisInstance = new Redis({
            url: UPSTASH_REDIS_REST_URL,
            token: UPSTASH_REDIS_REST_TOKEN,
        });
    }

    return redisInstance;
}

/**
 * Gets or creates the signup rate limiter
 */
function getSignupRatelimit(): Ratelimit | null {
    const redis = getRedis();
    if (!redis) return null;

    if (!signupRatelimitInstance) {
        signupRatelimitInstance = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(20, "1 h"),
            analytics: true,
            prefix: "waitlist:signup:",
        });
    }

    return signupRatelimitInstance;
}

/**
 * Gets or creates the strict rate limiter
 */
function getStrictRatelimit(): Ratelimit | null {
    const redis = getRedis();
    if (!redis) return null;

    if (!strictRatelimitInstance) {
        strictRatelimitInstance = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(2, "1 h"),
            prefix: "waitlist:strict:",
        });
    }

    return strictRatelimitInstance;
}

/**
 * Gets or creates the global rate limiter
 */
function getGlobalRatelimit(): Ratelimit | null {
    const redis = getRedis();
    if (!redis) return null;

    if (!globalRatelimitInstance) {
        globalRatelimitInstance = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(1000, "1 h"),
            prefix: "waitlist:global:",
        });
    }

    return globalRatelimitInstance;
}


/**
 * Rate limit result interface
 */
export interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
    retryAfter?: number;
}

/**
 * Performs multi-layer rate limiting check
 * 
 * Layers:
 * 1. Global limit - Prevents system overload
 * 2. IP-based limit - Prevents single-source spam
 * 3. Email-based limit - Prevents enumeration
 * 
 * @param ip - Client IP address
 * @param email - Email being registered (optional, for email-specific limiting)
 * @returns Rate limit result with details
 */
export async function checkRateLimit(
    ip: string,
    email?: string
): Promise<RateLimitResult> {
    try {
        // Layer 1: Global rate limit
        const globalRatelimit = getGlobalRatelimit();
        if (!globalRatelimit) {
            // If Redis is not configured, fall through
            return { success: true, limit: 999, remaining: 999, reset: Date.now() + 3600000 };
        }

        const globalResult = await globalRatelimit.limit("global");
        if (!globalResult.success) {
            return {
                success: false,
                limit: globalResult.limit,
                remaining: globalResult.remaining,
                reset: globalResult.reset,
                retryAfter: Math.ceil((globalResult.reset - Date.now()) / 1000),
            };
        }

        // Layer 2: IP-based rate limit
        const signupRatelimit = getSignupRatelimit();
        if (!signupRatelimit) {
            return { success: true, limit: 999, remaining: 999, reset: Date.now() + 3600000 };
        }

        const ipResult = await signupRatelimit.limit(ip);
        if (!ipResult.success) {
            return {
                success: false,
                limit: ipResult.limit,
                remaining: ipResult.remaining,
                reset: ipResult.reset,
                retryAfter: Math.ceil((ipResult.reset - Date.now()) / 1000),
            };
        }

        // Layer 3: Email-based rate limit (if provided)
        if (email) {
            const emailHash = await hashEmail(email);
            const emailResult = await signupRatelimit.limit(emailHash);
            if (!emailResult.success) {
                return {
                    success: false,
                    limit: emailResult.limit,
                    remaining: emailResult.remaining,
                    reset: emailResult.reset,
                    retryAfter: Math.ceil((emailResult.reset - Date.now()) / 1000),
                };
            }
        }

        return {
            success: true,
            limit: ipResult.limit,
            remaining: ipResult.remaining,
            reset: ipResult.reset,
        };
    } catch (error) {
        console.error("[Redis] Rate limit check failed:", error);
        // Fail open in development, fail closed in production
        if (process.env.NODE_ENV === "production") {
            return {
                success: false,
                limit: 0,
                remaining: 0,
                reset: Date.now() + 60000,
                retryAfter: 60,
            };
        }
        // In development, allow the request through if Redis is unavailable
        return {
            success: true,
            limit: 999,
            remaining: 999,
            reset: Date.now() + 3600000,
        };
    }
}

/**
 * Apply strict rate limiting after suspicious activity
 * 
 * @param ip - IP address to apply strict limiting to
 */
export async function applyStrictLimit(ip: string): Promise<RateLimitResult> {
    const strictRatelimit = getStrictRatelimit();
    if (!strictRatelimit) {
        return { success: true, limit: 999, remaining: 999, reset: Date.now() };
    }
    const result = await strictRatelimit.limit(ip);
    return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
    };
}

/**
 * Records a blocked request for security monitoring
 * 
 * @param ip - IP address that was blocked
 * @param reason - Reason for blocking
 */
export async function recordBlockedRequest(
    ip: string,
    reason: string
): Promise<void> {
    try {
        const redis = getRedis();
        if (!redis) return;

        const key = `waitlist:blocked:${ip}`;
        await redis.lpush(key, JSON.stringify({ reason, timestamp: Date.now() }));
        await redis.expire(key, 86400); // Keep for 24 hours
        await redis.incr("waitlist:blocked:total");
    } catch (error) {
        console.error("[Redis] Failed to record blocked request:", error);
    }
}

/**
 * Hashes email for privacy-preserving rate limiting
 * Uses simple hashing since we don't need cryptographic security
 */
async function hashEmail(email: string): Promise<string> {
    const normalized = email.toLowerCase().trim();

    // Use Web Crypto API if available (Edge Runtime compatible)
    if (typeof crypto !== "undefined" && crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(normalized);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }

    // Simple fallback hash for environments without crypto
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
        const char = normalized.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return `email_${Math.abs(hash).toString(16)}`;
}

/**
 * Checks if Redis connection is healthy
 * Useful for health checks and debugging
 */
export async function checkRedisHealth(): Promise<boolean> {
    try {
        const redis = getRedis();
        if (!redis) return false;
        await redis.ping();
        return true;
    } catch {
        return false;
    }
}
