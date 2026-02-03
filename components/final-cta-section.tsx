"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { WaitlistForm } from "./waitlist-form"

export function FinalCtaSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="relative bg-background-subtle px-4 py-20 md:py-28 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 gradient-mesh opacity-40" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-2xl text-center"
      >
        <h2 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl tracking-tight">
          Ready to transform your{" "}
          <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
            cooking?
          </span>
        </h2>

        <p className="mt-4 text-lg text-muted-foreground">
          Join <span className="font-semibold text-primary">100+</span> people on the waitlist
        </p>

        <div className="mt-8">
          <WaitlistForm />
        </div>
      </motion.div>
    </section>
  )
}
