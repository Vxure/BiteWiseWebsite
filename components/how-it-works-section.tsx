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
    <section className="relative bg-background px-4 py-20 md:py-28 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 gradient-mesh opacity-30" />

      <div className="relative mx-auto max-w-5xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl tracking-tight">
            How it{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">works</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            From fridge to feast in three simple steps
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting Line - Desktop */}
          <div className="absolute left-0 right-0 top-12 hidden h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent md:block rounded-full" />

          <div className="grid gap-8 md:grid-cols-3 md:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                {/* Number Circle */}
                <div className="relative z-10 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent-secondary rounded-full blur-lg opacity-40" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-secondary text-2xl font-bold text-white shadow-xl">
                    {step.number}
                  </div>
                </div>

                <h3 className="mb-2 text-2xl font-bold text-foreground">{step.title}</h3>
                <p className="max-w-xs text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
