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
      {/* Glow effect */}
      <div className="absolute -inset-2 rounded-[3.5rem] bg-gradient-to-tr from-primary/30 via-secondary/20 to-accent/30 blur-xl opacity-60" />

      {/* Phone Frame - always dark like real phones */}
      <div className="relative h-[580px] w-[280px] rounded-[3rem] border-[12px] border-slate-900 bg-slate-900 p-2 shadow-2xl md:h-[640px] md:w-[320px]">
        {/* Dynamic Island */}
        <div className="absolute left-1/2 top-4 z-20 h-7 w-28 -translate-x-1/2 rounded-full bg-black" />

        {/* Screen */}
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2.2rem] bg-white">
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
      </div>
    </motion.div>
  )
}
