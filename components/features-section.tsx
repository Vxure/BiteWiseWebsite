"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Camera, Sparkles, PieChart, MessageCircle } from "lucide-react"

const features = [
  {
    icon: Camera,
    title: "Scan Your Fridge",
    description: "Take a photo of your ingredients. Our AI identifies everything instantly.",
    color: "bg-accent",
  },
  {
    icon: Sparkles,
    title: "Personalized Recipes",
    description: "Get recipe suggestions tailored to your dietary preferences, allergies, and nutrition goals.",
    color: "bg-secondary",
  },
  {
    icon: PieChart,
    title: "Track Your Macros",
    description: "Monitor protein, carbs, and fats. Hit your daily targets effortlessly.",
    color: "bg-accent-gold",
  },
  {
    icon: MessageCircle,
    title: "AI Recipe Assistant",
    description: "Ask questions, get substitutions, adjust servings - your personal cooking companion.",
    color: "bg-primary",
  },
]

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="bg-gradient-to-b from-background-warm to-background-cream px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold text-deep-teal md:text-4xl lg:text-5xl">
            Everything you need to cook{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">smarter</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.15 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl md:p-8"
            >
              <div className={`mb-4 inline-flex rounded-xl ${feature.color} p-3`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-deep-teal">{feature.title}</h3>
              <p className="text-deep-teal/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
