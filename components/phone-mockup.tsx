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
      {/* Phone Frame */}
      <div className="relative h-[580px] w-[280px] rounded-[3rem] border-[12px] border-deep-teal bg-deep-teal p-2 shadow-2xl md:h-[640px] md:w-[320px]">
        {/* Notch */}
        <div className="absolute left-1/2 top-4 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-deep-teal" />

        {/* Screen */}
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2.2rem] bg-background-cream">
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
            <div className="flex h-[90%] w-[90%] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-secondary/40 bg-white/50">
              <svg className="mb-3 h-12 w-12 text-secondary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-center text-sm font-medium text-secondary/60">{label}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
