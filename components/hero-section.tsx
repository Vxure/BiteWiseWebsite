"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { WaitlistForm } from "./waitlist-form"

const screenshots = [
  "/image/screenshot/introScreen.png",
  "/image/screenshot/detectedIngredients.png",
  "/image/screenshot/generatedRecipes.png",
  "/image/screenshot/recipePage.png",
  "/image/screenshot/recipeAssistant.png"
]

// Stable image component that stays mounted - prevents remounting during transitions
function CarouselImage({
  src,
  index,
  isActive
}: {
  src: string
  index: number
  isActive: boolean
}) {
  return (
    <motion.div
      initial={false}
      animate={{
        opacity: isActive ? 1 : 0,
      }}
      transition={{
        duration: 0.8,
        ease: "easeInOut"
      }}
      className="absolute inset-0"
      style={{
        // GPU acceleration - promote to compositor layer
        willChange: 'opacity',
        transform: 'translateZ(0)',
        // Prevent pointer events on hidden slides
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      <Image
        src={src}
        alt={`App Screenshot ${index + 1}`}
        width={816}
        height={1770}
        quality={100}
        // Priority load ALL images upfront to prevent decode during animation
        priority
        unoptimized
        sizes="408px"
        className="w-full h-auto"
        // Ensure image is decoded before paint
        loading="eager"
        // Fixed dimensions prevent layout shift
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
    </motion.div>
  )
}

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Rotate through images every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screenshots.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-screen overflow-x-clip bg-background px-4 pt-28 pb-12 md:pt-24 md:pb-20 xl:flex xl:items-center xl:pt-16 xl:pb-16">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 gradient-mesh" />

      {/* Ambient glow - symmetrical placement for consistency */}
      <div className="absolute top-10 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px] animate-pulse-glow-delayed" />

      <div className="relative mx-auto w-full" style={{ maxWidth: 'min(100%, 64rem)' }}>
        {/* Centered container with gap - whitespace flows to edges, gap shrinks with viewport */}
        <div className="grid items-center justify-center xl:grid-cols-[1fr_auto] min-w-0 overflow-visible" style={{ gap: 'clamp(2rem, 12vw, 432px)' }}>
          {/* Left Content */}
          <div className="flex flex-col items-center text-center xl:items-start xl:text-left">
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
              className="font-sans text-5xl font-bold tracking-tight whitespace-nowrap md:text-6xl lg:text-7xl"
            >
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Meet Taberoux
              </span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-2xl font-semibold text-foreground/90 md:text-3xl"
            >
              <span className="md:whitespace-nowrap">Your personal cooking assistant that knows </span>
              <br className="hidden md:inline" />
              <span className="md:whitespace-nowrap">what's in your kitchen.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-4 -mb-1 max-w-lg text-base text-muted-foreground leading-relaxed"
            >
              {/* <span className="md:whitespace-nowrap">Turn what's already in your kitchen into meals. Snap a photo or add ingredients manually</span> */}
              <span className="md:whitespace-nowrap">Snap a photo or add ingredients manually to get recipes tailored to your </span>

              <br className="hidden md:inline" />
              <span className="md:whitespace-nowrap">taste, diet, and time.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 w-full max-w-xl"
            >
              <WaitlistForm />

              {/* Subtle explore link */}
              <Link
                href="/features"
                className="mt-6 inline-flex items-center gap-1.5 text-base text-muted-foreground hover:text-primary transition-colors"
              >
                Want to see how it works? <span className="font-medium">Explore Taberoux</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>

          {/* Right Content - Phone Mockup with tilt, pushed down */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 3 }}
            animate={{ opacity: 1, x: 0, rotate: 3 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex justify-center mt-8 xl:mt-12 min-w-0 shrink-0"
          >
            <div className="relative flex-shrink-0 w-[408px] max-w-[90vw]">
              {/* Smooth diffused shadow beneath phone - larger blur for soft edges */}
              <div className="absolute -inset-8 rounded-[4rem] bg-black/10 blur-3xl" />
              <div className="absolute -inset-12 rounded-[5rem] bg-black/5 blur-[60px]" />

              {/* Floating animation wrapper - GPU optimized for crisp rendering */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="relative z-10"
                style={{ willChange: 'transform', transform: 'translateZ(0)' }}
              >
                {/* Subtle floating glow - larger blur for smoother edges */}
                <div className="absolute -inset-8 rounded-[4rem] bg-gradient-to-tr from-primary/15 via-secondary/10 to-accent/15 blur-3xl opacity-40" />

                {/* Carousel of phone screenshots - GPU accelerated, all images stay mounted */}
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    aspectRatio: '816/1770',
                    // Contain stacking context and enable hardware acceleration
                    isolation: 'isolate',
                    transform: 'translateZ(0)',
                  }}
                >
                  {/* Render all images - they stay mounted, only opacity changes */}
                  {screenshots.map((src, index) => (
                    <CarouselImage
                      key={src}
                      src={src}
                      index={index}
                      isActive={index === currentIndex}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
