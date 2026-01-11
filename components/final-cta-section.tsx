"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { WaitlistForm } from "./waitlist-form"

export function FinalCtaSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="bg-gradient-to-b from-background-warm to-background-cream px-4 py-20 md:py-28">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="text-3xl font-bold text-deep-teal md:text-4xl lg:text-5xl">
          Ready to transform your{" "}
          <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
            cooking?
          </span>
        </h2>

        <p className="mt-4 text-lg text-deep-teal/70">
          Join <span className="font-semibold text-accent">500+</span> people on the waitlist
        </p>

        <div className="mt-8">
          <WaitlistForm />
        </div>
      </motion.div>
    </section>
  )
}
