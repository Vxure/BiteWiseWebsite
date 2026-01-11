"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"

export function WaitlistForm() {
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
          className="flex-1 rounded-xl border-2 border-transparent bg-white/80 px-5 py-4 text-deep-teal shadow-lg backdrop-blur-sm transition-all duration-200 placeholder:text-deep-teal/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
        <motion.button
          type="submit"
          disabled={status === "loading"}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-xl bg-gradient-to-r from-accent to-accent-secondary px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-70"
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
          className="mt-3 text-sm font-medium text-accent"
        >
          Something went wrong. Please try again.
        </motion.p>
      )}

      {status === "idle" && (
        <p className="mt-3 text-sm text-deep-teal/60">Be the first to know when we launch. No spam, ever.</p>
      )}
    </form>
  )
}
