"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const steps = [
  {
    number: 1,
    title: "Snap",
    description: "Take a photo of your fridge or pantry",
  },
  {
    number: 2,
    title: "Discover",
    description: "Browse AI-generated recipes matched to your ingredients",
  },
  {
    number: 3,
    title: "Cook",
    description: "Follow step-by-step instructions with macro tracking",
  },
]

export function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="bg-gradient-to-b from-background-peach to-background-warm px-4 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold text-deep-teal md:text-4xl lg:text-5xl">
            How it{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">works</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connecting Line - Desktop */}
          <div className="absolute left-0 right-0 top-8 hidden h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent md:block" />

          <div className="grid gap-8 md:grid-cols-3 md:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                {/* Number Circle */}
                <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-secondary text-2xl font-bold text-white shadow-lg">
                  {step.number}
                </div>

                <h3 className="mb-2 text-xl font-bold text-deep-teal">{step.title}</h3>
                <p className="max-w-xs text-deep-teal/70">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
