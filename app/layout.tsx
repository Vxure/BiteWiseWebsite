import type React from "react"
import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Taberoux - Smart Recipes from Your Fridge",
  description:
    "Snap a photo of your fridge. Get personalized recipes in seconds. Taberoux uses AI to transform your ingredients into delicious meals. Join the waitlist today.",
  keywords: ["recipe app", "AI recipes", "meal planning", "fridge scanner", "nutrition tracking", "cooking app", "ingredient recognition"],
  openGraph: {
    title: "Taberoux - Smart Recipes from Your Fridge",
    description: "Snap a photo of your fridge. Get personalized recipes in seconds. Powered by AI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taberoux - Smart Recipes from Your Fridge",
    description: "Snap a photo of your fridge. Get personalized recipes in seconds. Powered by AI.",
  },
}

export const viewport: Viewport = {
  themeColor: "#2d6a4f",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
