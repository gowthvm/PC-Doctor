"use client"

import React, { useState, useEffect } from "react"

export function Particles() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Don't render on server to avoid hydration mismatch
    if (!mounted) return null

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -5 }}>
            {[...Array(25)].map((_, i) => {
                const duration = 5 + Math.random() * 10
                const delay = Math.random() * 5
                const tx = (Math.random() - 0.5) * 100
                const ty = (Math.random() - 0.5) * 100

                return (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDuration: `${duration}s`,
                            animationDelay: `${delay}s`,
                            // @ts-ignore
                            '--tx': `${tx}px`,
                            '--ty': `${ty}px`,
                        }}
                    />
                )
            })}
        </div>
    )
}
