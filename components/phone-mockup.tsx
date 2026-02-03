"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface PhoneMockupProps {
  label?: string
  className?: string
  imageSrc?: string
  imageSrcs?: string[]  // Multiple images for carousel
  interval?: number     // Rotation interval in ms (default: 3000)
}

export function PhoneMockup({
  label = "App Screenshot",
  className = "",
  imageSrc,
  imageSrcs,
  interval = 3000
}: PhoneMockupProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Get the list of images - either a single image or multiple
  const images = imageSrcs || (imageSrc ? [imageSrc] : [])
  const hasMultipleImages = images.length > 1

  // Rotate through images
  useEffect(() => {
    if (!hasMultipleImages) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [hasMultipleImages, images.length, interval])

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      className={`relative ${className}`}
    >
      {/* Subtle floating glow */}
      <div className="absolute -inset-4 rounded-[2.75rem] bg-gradient-to-tr from-primary/20 via-secondary/15 to-accent/20 blur-2xl opacity-50" />

      {/* Phone Frame - iPhone 15/16/17 Pro Max style
           Ultra-thin bezels, titanium finish, refined Dynamic Island
           Screen area maintains iPhone Pro Max aspect ratio (~19.5:9) */}
      <div className="relative h-[580px] w-[268px] rounded-[2.75rem] bg-gradient-to-b from-[#2a2a2e] via-[#1c1c1e] to-[#1c1c1e] p-[6px] shadow-2xl md:h-[667px] md:w-[308px]">
        {/* Titanium edge highlight */}
        <div className="absolute inset-0 rounded-[2.75rem] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

        {/* Dynamic Island - refined Pro Max style with camera cutout */}
        <div className="absolute left-1/2 top-3 z-20 -translate-x-1/2 flex items-center gap-2 h-[26px] w-[100px] rounded-full bg-black md:w-[110px]">
          {/* Camera lens */}
          <div className="absolute left-3 h-[10px] w-[10px] rounded-full bg-[#1a1a1a] ring-1 ring-[#2a2a2e]">
            <div className="absolute inset-[2px] rounded-full bg-[#0d0d0d]" />
            <div className="absolute top-[2px] left-[2px] h-1 w-1 rounded-full bg-[#4a4a4a]/40" />
          </div>
        </div>

        {/* Screen - ultra-thin bezel creates edge-to-edge look */}
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2.5rem] bg-white">
          {images.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={images[currentIndex]}
                  alt={`${label} ${currentIndex + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                  priority={className.includes("z-10") || !className.includes("scale-75")}
                />
              </motion.div>
            </AnimatePresence>
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

        {/* Home Bar indicator - subtle iOS style */}
        <div className="absolute bottom-[10px] left-1/2 z-20 h-[5px] w-[120px] -translate-x-1/2 rounded-full bg-black/80 md:w-[134px]" />
      </div>
    </motion.div>
  )
}
