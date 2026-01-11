"use client"

import { motion } from "framer-motion"
import { WaitlistForm } from "./waitlist-form"
import { PhoneMockup } from "./phone-mockup"

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background-cream via-background-peach to-background-warm px-4 py-12 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Left Content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              className="font-sans text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl"
            >
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">BiteWise</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-xl font-medium text-secondary md:text-2xl"
            >
              Smart recipes for your ingredients
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 max-w-lg text-lg text-deep-teal/80"
            >
              Snap a photo of your fridge. Get personalized recipes in seconds. Powered by AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 w-full max-w-md"
            >
              <WaitlistForm />
            </motion.div>
          </div>

          {/* Right Content - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 3 }}
            animate={{ opacity: 1, x: 0, rotate: 3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center lg:justify-end"
          >
            <PhoneMockup label="App Screenshot" imageSrc="/image/introScreen.png" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
