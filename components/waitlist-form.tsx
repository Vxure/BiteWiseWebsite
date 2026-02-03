"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"

interface WaitlistFormProps {
  // Dynamic waitlist count - can be fetched from Supabase
  waitlistCount?: number
  // Toggle social proof visibility
  showSocialProof?: boolean
}

export function WaitlistForm({
  waitlistCount = 100,
  showSocialProof = true
}: WaitlistFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setStatus("success")
        setEmail("")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 min-w-0 rounded-xl border-2 border-border bg-background px-5 py-4 text-foreground shadow-sm transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <motion.button
          type="submit"
          disabled={status === "loading"}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="whitespace-nowrap rounded-xl bg-gradient-to-r from-accent to-accent-secondary px-6 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:shadow-accent/25 disabled:opacity-70"
        >
          {status === "loading" ? "Joining..." : "Join the Waitlist"}
        </motion.button>
      </div>

      {status === "success" && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm font-medium text-primary"
        >
          🎉 {"You're on the list! We'll be in touch soon."}
        </motion.p>
      )}

      {status === "error" && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm font-medium text-destructive"
        >
          Something went wrong. Please try again.
        </motion.p>
      )}

      {status === "idle" && (
        <div className="mt-3 space-y-1">
          {showSocialProof && (
            <p className="text-sm text-muted-foreground/70">
              Join {waitlistCount}+ people already on the waitlist
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            {/* We'll email you when it's your turn to try Taberoux. */}
          </p>
        </div>
      )}
    </form>
  )
}
