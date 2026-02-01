"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { PhoneMockup } from "./phone-mockup"

export function AppPreviewSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [100, -100])
  const y3 = useTransform(scrollYProgress, [0, 1], [30, -30])

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-background px-4 py-20 md:py-28"
    >
      {/* Background gradient orbs */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl tracking-tight">
            See it in{" "}
            <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
              action
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A beautiful, intuitive interface designed for seamless cooking
          </p>
        </motion.div>

        <div className="relative flex min-h-[600px] items-center justify-center md:min-h-[700px]">
          {/* Left Phone */}
          <motion.div style={{ y: y1 }} className="absolute left-0 top-1/2 hidden -translate-y-1/2 -rotate-6 lg:block">
            <PhoneMockup label="Screenshot 1" imageSrc="/image/detectedIngredients.png" className="scale-75 opacity-70" />
          </motion.div>

          {/* Center Phone */}
          <motion.div style={{ y: y2 }} className="relative z-10">
            <PhoneMockup label="Screenshot 2" imageSrc="/image/generatedRecipes.png" />
          </motion.div>

          {/* Right Phone */}
          <motion.div style={{ y: y3 }} className="absolute right-0 top-1/2 hidden -translate-y-1/2 rotate-6 lg:block">
            <PhoneMockup label="Screenshot 3" imageSrc="/image/recipePage.png" className="scale-75 opacity-70" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
