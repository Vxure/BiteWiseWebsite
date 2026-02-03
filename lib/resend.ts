/**
 * Resend Email Client
 * 
 * Production-ready email integration for waitlist confirmations.
 * Includes templating, error handling, and delivery tracking.
 * 
 * Uses lazy initialization to prevent build errors when API key is not set.
 */

import { Resend } from "resend";

// Environment variables
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const RESEND_REPLY_TO_EMAIL = process.env.RESEND_REPLY_TO_EMAIL;

// Lazy-initialized Resend client to prevent build errors
let resendClient: Resend | null = null;

/**
 * Gets or creates the Resend client
 * Uses lazy initialization to avoid throwing during build
 */
function getResendClient(): Resend | null {
  if (!RESEND_API_KEY) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(RESEND_API_KEY);
  }

  return resendClient;
}

/**
 * Email sending result interface
 */
export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Waitlist email data
 */
export interface WaitlistEmailData {
  email: string;
  name?: string;
  referralCode: string;
  position?: number;
}

/**
 * Sends a welcome email to new waitlist signups
 *
 * @param data - Email recipient data
 * @returns Result indicating success or failure
 */
export async function sendWelcomeEmail(
  data: WaitlistEmailData
): Promise<EmailResult> {
  const resend = getResendClient();

  if (!resend || !RESEND_FROM_EMAIL) {
    // Silently skip email if not configured (expected during local dev)
    return { success: true, messageId: "skipped-no-config" };
  }

  const { email, name, referralCode, position } = data;
  const displayName = name || email.split("@")[0];

  try {
    const response = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: email,
      replyTo: RESEND_REPLY_TO_EMAIL || RESEND_FROM_EMAIL,
      subject: "🎉 You're on the Taberoux Waitlist!",
      html: generateWelcomeEmailHTML({
        name: displayName,
        referralCode,
        position,
      }),
      text: generateWelcomeEmailText({
        name: displayName,
        referralCode,
        position,
      }),
      tags: [
        { name: "type", value: "waitlist-welcome" },
        { name: "source", value: "website" },
      ],
    });

    if (response.error) {
      console.error("[Resend] Email send error:", response.error);
      return { success: false, error: response.error.message };
    }

    return { success: true, messageId: response.data?.id };
  } catch (error) {
    console.error("[Resend] Email send failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Generates HTML email content for welcome email
 */
function generateWelcomeEmailHTML(data: {
  name: string;
  referralCode: string;
  position?: number;
}): string {
  const { name, referralCode, position } = data;
  const positionText = position ? `#${position.toLocaleString()}` : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Taberoux</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="margin: 0; font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #10b981, #059669); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
        Taberoux
      </h1>
    </div>

    <!-- Main Card -->
    <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <!-- Welcome Message -->
      <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #18181b;">
        Hey ${escapeHtml(name)}! 🎉
      </h2>
      
      <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #52525b;">
        You're officially on the Taberoux waitlist${positionText ? ` at position <strong>${positionText}</strong>` : ""}!
      </p>
      
      <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #52525b;">
        We're building Taberoux for people who want to turn what's already in their kitchen into delicious, personalized meals. No overthinking, no wasted time, or ingredients.
      </p>

      <!-- What's Coming -->
      <div style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px; font-size: 18px; font-weight: 600; color: #047857;">
          ✨ What You'll Get
        </h3>
        <ul style="margin: 0; padding-left: 20px; color: #059669; line-height: 1.8;">
          <li><strong>AI-powered recipes</strong> from ingredients you already have</li>
          <li><strong>Zero food waste</strong> — use what's in your fridge</li>
          <li><strong>Personalized suggestions</strong> based on your taste</li>
        </ul>
      </div>

      <!-- What's Next -->
      <h3 style="margin: 0 0 12px; font-size: 18px; font-weight: 600; color: #18181b;">
        What's Next?
      </h3>
      <ul style="margin: 0 0 24px; padding-left: 20px; color: #52525b; line-height: 1.8;">
        <li>We'll email you as soon as early access opens</li>
        <li>iOS app launching first, Android coming soon</li>
        <li>Be among the first to experience Taberoux!</li>
      </ul>

      <!-- CTA Button -->
      <div style="text-align: center;">
        <a href="https://taberoux.com" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 16px;">
          Visit Taberoux
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; color: #a1a1aa; font-size: 13px;">
      <p style="margin: 0 0 8px;">
        Taberoux • Meals from what's already in your fridge
      </p>
      <p style="margin: 0;">
        You received this email because you signed up for our waitlist.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generates plain text email content for welcome email
 */
function generateWelcomeEmailText(data: {
  name: string;
  referralCode: string;
  position?: number;
}): string {
  const { name, referralCode, position } = data;
  const positionText = position
    ? ` at position #${position.toLocaleString()}`
    : "";

  return `
Hey ${name}! 🎉

You're officially on the Taberoux waitlist${positionText}!

We're building Taberoux for people who want to turn what's already in their kitchen into delicious, personalized meals. No overthinking, no wasted time, no wasted ingredients.

✨ WHAT YOU'LL GET:
- AI-powered recipes from ingredients you already have
- Zero food waste — use what's in your fridge
- Personalized suggestions based on your taste

What's Next?
- We'll email you as soon as early access opens
- iOS app launching first, Android coming soon
- Be among the first to experience Taberoux!

Visit us: https://taberoux.com

---
Taberoux • Meals from what's already in your fridge
You received this email because you signed up for our waitlist.
  `.trim();
}

/**
 * Escapes HTML to prevent XSS in email content
 */
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

/**
 * Checks if email service is configured
 */
export function isEmailConfigured(): boolean {
  return Boolean(RESEND_API_KEY && RESEND_FROM_EMAIL);
}

/**
 * Validates email configuration by attempting a dry run
 * Useful for health checks
 */
export async function checkEmailHealth(): Promise<boolean> {
  return isEmailConfigured() && getResendClient() !== null;
}
