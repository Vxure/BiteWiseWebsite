import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // TODO: Connect to Resend or your email service here
    // For now, just log and return success
    console.log("Waitlist signup:", email)

    return NextResponse.json({ success: true, message: "Successfully joined the waitlist" }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
