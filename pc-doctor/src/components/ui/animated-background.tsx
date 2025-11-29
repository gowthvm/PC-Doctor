"use client"

import React from "react"

export function AnimatedBackground() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden bg-gradient-to-br from-[#020307] via-[#020307] to-[#020307]">
            {/* Radial gold glow overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,211,107,0.14),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(191,144,70,0.18),_transparent_65%)]" />

            {/* Animated blobs */}
            <div className="absolute -top-32 -left-16 w-[28rem] h-[28rem] rounded-full bg-[rgba(245,211,107,0.16)] mix-blend-screen blur-3xl opacity-70 animate-blob" />
            <div className="absolute -top-40 -right-20 w-[26rem] h-[26rem] rounded-full bg-[rgba(191,144,70,0.2)] mix-blend-screen blur-3xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-24 left-1/3 w-[30rem] h-[30rem] rounded-full bg-[rgba(255,184,108,0.18)] mix-blend-screen blur-3xl opacity-70 animate-blob animation-delay-4000" />

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>
    )
}
