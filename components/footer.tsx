import Link from "next/link"
import { Twitter, Instagram } from "lucide-react"

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="bg-foreground px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-8 text-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-background">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Taberoux
            </span>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="#" className="text-sm text-background/70 transition-colors hover:text-background">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-background/70 transition-colors hover:text-background">
              Terms of Service
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            <Link
              href="#"
              className="rounded-full bg-background/10 p-2.5 transition-all hover:bg-background/20 hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5 text-background" />
            </Link>
            <Link
              href="#"
              className="rounded-full bg-background/10 p-2.5 transition-all hover:bg-background/20 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5 text-background" />
            </Link>
            <Link
              href="#"
              className="rounded-full bg-background/10 p-2.5 transition-all hover:bg-background/20 hover:scale-110"
              aria-label="TikTok"
            >
              <TikTokIcon className="h-5 w-5 text-background" />
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-background/50">
            <p>© 2025 Taberoux. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
