"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "./theme-provider"

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const { theme, toggleTheme, mounted } = useTheme()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }

        // Check initial scroll position
        handleScroll()

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
        bg-background/70 backdrop-blur-md
        ${isScrolled ? 'border-b border-border shadow-lg backdrop-blur-xl' : 'border-b border-transparent'}
      `}
        >
            <div className="mx-auto max-w-7xl px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="text-xl font-bold text-primary">
                        Taberoux
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/features"
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            Explore Taberoux
                        </Link>

                        {/* Theme Toggle - Desktop */}
                        {mounted && (
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                            >
                                {theme === "light" ? (
                                    <Moon className="h-5 w-5" />
                                ) : (
                                    <Sun className="h-5 w-5" />
                                )}
                            </button>
                        )}
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex items-center gap-2 md:hidden">
                        {/* Theme Toggle - Mobile */}
                        {mounted && (
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                            >
                                {theme === "light" ? (
                                    <Moon className="h-5 w-5" />
                                ) : (
                                    <Sun className="h-5 w-5" />
                                )}
                            </button>
                        )}

                        {/* Hamburger */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Toggle menu"
                        >
                            <div className="relative w-6 h-6">
                                <Menu
                                    className={`h-6 w-6 absolute inset-0 transition-all duration-200 ease-out ${isOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
                                        }`}
                                />
                                <X
                                    className={`h-6 w-6 absolute inset-0 transition-all duration-200 ease-out ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
                                        }`}
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - CSS transitions for GPU acceleration */}
            <div
                className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border overflow-hidden transition-all duration-300 ease-out ${isOpen
                    ? 'max-h-20 opacity-100'
                    : 'max-h-0 opacity-0 border-transparent'
                    }`}
            >
                <div className="px-4 py-4">
                    <Link
                        href="/features"
                        onClick={() => setIsOpen(false)}
                        className="block text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        Explore Taberoux
                    </Link>
                </div>
            </div>
        </nav>
    )
}
