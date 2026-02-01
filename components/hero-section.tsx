"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { WaitlistForm } from "./waitlist-form"
import { PhoneMockup } from "./phone-mockup"

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background px-4 pt-28 pb-12 md:pt-24 md:pb-20 lg:flex lg:items-center lg:pt-16 lg:pb-16">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 gradient-mesh" />

      {/* Ambient glow - symmetrical placement for consistency */}
      <div className="absolute top-10 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px] animate-pulse-glow-delayed" />

      <div className="relative mx-auto max-w-5xl">
        {/* Centered container with gap - whitespace flows to edges */}
        <div className="grid items-center justify-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-58">
          {/* Left Content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Early iOS Access Coming Soon
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-sans text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl"
            >
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Taberoux
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-xl font-medium text-foreground/80 md:text-2xl"
            >
              Meals from what's already in your fridge
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-4 max-w-lg text-lg text-muted-foreground"
            >
              Snap a photo of your ingredients and get recipes tailored to your taste, diet, and goals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 w-full max-w-xl"
            >
              <WaitlistForm />

              {/* Subtle explore link */}
              <Link
                href="/features"
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Want to see how it works? <span className="font-medium">Explore Taberoux</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          {/* Right Content - Phone Mockup with tilt, pushed down */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 3 }}
            animate={{ opacity: 1, x: 0, rotate: 3 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex justify-center mt-8 lg:mt-12"
          >
            <div className="relative">
              {/* Light shadow beneath phone */}
              <div className="absolute -inset-4 rounded-[3rem] bg-black/15 blur-2xl" />
              <PhoneMockup label="App Screenshot" imageSrc="/image/introScreen.png" className="relative z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
