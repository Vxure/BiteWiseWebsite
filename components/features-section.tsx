"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Camera, Sparkles, PieChart, MessageCircle } from "lucide-react"

const features = [
  {
    icon: Camera,
    title: "Scan Your Fridge",
    description: "Take a photo of your ingredients. Our AI identifies everything instantly.",
    gradient: "from-primary to-secondary",
  },
  {
    icon: Sparkles,
    title: "Personalized Recipes",
    description: "Get recipe suggestions tailored to your dietary preferences, allergies, and nutrition goals.",
    gradient: "from-secondary to-primary",
  },
  {
    icon: PieChart,
    title: "Track Your Macros",
    description: "Monitor protein, carbs, and fats. Hit your daily targets effortlessly.",
    gradient: "from-accent to-accent-secondary",
  },
  {
    icon: MessageCircle,
    title: "AI Recipe Assistant",
    description: "Ask questions, get substitutions, adjust servings - your personal cooking companion.",
    gradient: "from-accent-secondary to-accent",
  },
]

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="relative bg-background-subtle px-4 py-20 md:py-28 overflow-hidden">
      {/* Subtle background elements - consistent green */}
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse-glow-delayed" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl tracking-tight">
            Everything you need to cook{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">smarter</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Powered by advanced AI to transform your kitchen experience
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="group relative rounded-2xl glass p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-[transform,box-shadow] duration-300 md:p-8"
            >
              {/* Gradient border on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              <div className={`relative mb-4 inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3 shadow-lg`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="relative mb-2 text-xl font-bold text-foreground">{feature.title}</h3>
              <p className="relative text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
