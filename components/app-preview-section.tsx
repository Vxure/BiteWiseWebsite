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
      className="overflow-hidden bg-gradient-to-b from-background-cream to-background-peach px-4 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold text-deep-teal md:text-4xl lg:text-5xl">
            See it in{" "}
            <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
              action
            </span>
          </h2>
        </motion.div>

        <div className="relative flex min-h-[600px] items-center justify-center md:min-h-[700px]">
          {/* Left Phone */}
          <motion.div style={{ y: y1 }} className="absolute left-0 top-1/2 hidden -translate-y-1/2 -rotate-6 lg:block">
            <PhoneMockup label="Screenshot 1" imageSrc="/image/detectedIngredients.png" className="scale-75 opacity-80" />
          </motion.div>

          {/* Center Phone */}
          <motion.div style={{ y: y2 }} className="relative z-10">
            <PhoneMockup label="Screenshot 2" imageSrc="/image/generatedRecipes.png" />
          </motion.div>

          {/* Right Phone */}
          <motion.div style={{ y: y3 }} className="absolute right-0 top-1/2 hidden -translate-y-1/2 rotate-6 lg:block">
            <PhoneMockup label="Screenshot 3" imageSrc="/image/recipePage.png" className="scale-75 opacity-80" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
