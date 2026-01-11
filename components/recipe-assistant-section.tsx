"use client"

import { motion } from "framer-motion"
import { ChefHat, ArrowLeftRight, Users, Globe } from "lucide-react"
import { PhoneMockup } from "./phone-mockup"

const assistantFeatures = [
  {
    icon: ChefHat,
    title: "Modify Recipes",
    description: "Adapt any recipe for dietary restrictions or specific diets like high protein or keto.",
    color: "bg-primary",
  },
  {
    icon: ArrowLeftRight,
    title: "Smart Substitutions",
    description: "Missing an ingredient? Get instant suggestions for the best swaps based on what's in your pantry.",
    color: "bg-accent",
  },
  {
    icon: Users,
    title: "Adjust Servings",
    description: "Effortlessly scale recipes up for a dinner party or down for a solo meal.",
    color: "bg-secondary",
  },
  {
    icon: Globe,
    title: "Explore Cuisines",
    description: "Discover world flavors tailored to your personal taste preferences and spice tolerance.",
    color: "bg-accent-gold",
  },
]

export function RecipeAssistantSection() {
  return (
    <section className="bg-gradient-to-b from-background-cream to-background-peach px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-3xl font-bold text-deep-teal md:text-4xl lg:text-5xl">
              Your Personal{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Recipe Assistant
              </span>
            </h2>
            <p className="mb-8 text-lg text-deep-teal/80">
              Go beyond simple cooking. Our AI assistant helps you customize every meal to fit your lifestyle,
              preferences, and current kitchen inventory.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              {assistantFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group rounded-xl border border-border/50 bg-white/50 p-5 backdrop-blur-sm transition-all hover:bg-white/80"
                >
                  <div className={`mb-3 inline-flex rounded-lg ${feature.color} p-2.5`}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mb-1 text-lg font-bold text-deep-teal">{feature.title}</h3>
                  <p className="text-sm text-deep-teal/70">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-primary/20 to-accent/20 blur-2xl" />
              <PhoneMockup
                label="AI Assistant"
                imageSrc="/image/recipeAssistant.png"
                className="relative z-10 scale-90 md:scale-100"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

