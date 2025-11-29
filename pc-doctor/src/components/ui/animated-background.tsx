"use client"

import React, { useEffect, useState } from "react"

export function AnimatedBackground() {
    const [isDark, setIsDark] = useState(true)

    useEffect(() => {
        // Check if dark mode is active
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains("dark"))
        }

        checkDarkMode()

        // Listen for theme changes
        const observer = new MutationObserver(checkDarkMode)
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

        return () => observer.disconnect()
    }, [])

    return (
        <div
            className={`fixed inset-0 z-0 overflow-hidden ${
                isDark
                    ? "bg-gradient-to-br from-[#020307] via-[#020307] to-[#020307]"
                    : "bg-gradient-to-br from-[#f6f1e8] via-[#faf7f0] to-[#f6f1e8]"
            }`}
        >
            {/* Radial gold glow overlay */}
            <div
                className={`absolute inset-0 ${
                    isDark
                        ? "bg-[radial-gradient(circle_at_top,_rgba(245,211,107,0.14),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(191,144,70,0.18),_transparent_65%)]"
                        : "bg-[radial-gradient(circle_at_top,_rgba(245,211,107,0.12),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(221,181,120,0.16),_transparent_65%)]"
                }`}
            />

            {/* Animated blobs */}
            <div
                className={`absolute -top-32 -left-16 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-70 animate-blob ${
                    isDark
                        ? "bg-[rgba(245,211,107,0.16)] mix-blend-screen"
                        : "bg-[rgba(245,211,107,0.18)] mix-blend-soft-light"
                }`}
            />
            <div
                className={`absolute -top-40 -right-20 w-[26rem] h-[26rem] rounded-full blur-3xl opacity-70 animate-blob animation-delay-2000 ${
                    isDark
                        ? "bg-[rgba(191,144,70,0.2)] mix-blend-screen"
                        : "bg-[rgba(221,181,120,0.22)] mix-blend-soft-light"
                }`}
            />
            <div
                className={`absolute -bottom-24 left-1/3 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-70 animate-blob animation-delay-4000 ${
                    isDark
                        ? "bg-[rgba(255,184,108,0.18)] mix-blend-screen"
                        : "bg-[rgba(245,211,107,0.20)] mix-blend-soft-light"
                }`}
            />

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>
    )
}
