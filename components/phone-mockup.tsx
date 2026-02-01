"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface PhoneMockupProps {
  label?: string
  className?: string
  imageSrc?: string
}

export function PhoneMockup({ label = "App Screenshot", className = "", imageSrc }: PhoneMockupProps) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      className={`relative ${className}`}
    >
      {/* Subtle floating glow */}
      <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-primary/20 via-secondary/15 to-accent/20 blur-2xl opacity-50" />

      {/* Phone Frame - concentric radii: 3rem (48px) outer, p-3 (12px) bezel, 2.25rem (36px) inner */}
      <div className="relative h-[580px] w-[280px] max-w-[340px] rounded-[3rem] bg-black p-3 shadow-2xl md:h-[640px] md:w-[320px]">
        {/* Dynamic Island */}
        <div className="absolute left-1/2 top-4 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

        {/* Screen - inner radius: outer (48px) - padding (12px) = 36px = 2.25rem */}
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2.25rem] bg-white">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={label}
              fill
              unoptimized
              className="object-cover"
              priority={className.includes("z-10") || !className.includes("scale-75")}
            />
          ) : (
            /* Placeholder */
            <div className="flex h-[90%] w-[90%] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-background/50">
              <svg className="mb-3 h-12 w-12 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-center text-sm font-medium text-primary/60">{label}</p>
            </div>
          )}
        </div>

        {/* Home Bar indicator */}
        <div className="absolute bottom-2 left-1/2 z-20 h-1 w-32 -translate-x-1/2 rounded-full bg-black/20" />
      </div>
    </motion.div>
  )
}
