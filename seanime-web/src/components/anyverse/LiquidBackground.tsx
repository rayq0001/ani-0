"use client"

import { cn } from "@/components/ui/core/styling"
import { motion } from "framer-motion"
import React from "react"

interface LiquidBackgroundProps {
    children?: React.ReactNode
    variant?: "cosmic" | "holographic" | "aurora" | "mesh"
    className?: string
}

const variants = {
    cosmic: {
        background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)",
        orbs: [
            { color: "rgba(139, 92, 246, 0.3)", size: 600, x: "10%", y: "20%" },
            { color: "rgba(236, 72, 153, 0.2)", size: 500, x: "80%", y: "60%" },
            { color: "rgba(245, 158, 11, 0.15)", size: 400, x: "50%", y: "80%" },
        ],
    },
    holographic: {
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a0f2e 50%, #0f1a1a 100%)",
        orbs: [
            { color: "rgba(139, 92, 246, 0.4)", size: 500, x: "20%", y: "30%" },
            { color: "rgba(236, 72, 153, 0.3)", size: 450, x: "70%", y: "20%" },
            { color: "rgba(59, 130, 246, 0.25)", size: 400, x: "40%", y: "70%" },
        ],
    },
    aurora: {
        background: "linear-gradient(180deg, #0a0a0f 0%, #1a1020 50%, #0a0a0f 100%)",
        orbs: [
            { color: "rgba(16, 185, 129, 0.2)", size: 550, x: "15%", y: "25%" },
            { color: "rgba(139, 92, 246, 0.25)", size: 480, x: "75%", y: "35%" },
            { color: "rgba(236, 72, 153, 0.15)", size: 420, x: "50%", y: "75%" },
        ],
    },
    mesh: {
        background: "#0a0a0f",
        orbs: [
            { color: "rgba(139, 92, 246, 0.2)", size: 400, x: "30%", y: "20%" },
            { color: "rgba(236, 72, 153, 0.15)", size: 350, x: "80%", y: "10%" },
            { color: "rgba(245, 158, 11, 0.1)", size: 300, x: "10%", y: "60%" },
        ],
    },
}

interface OrbProps {
    color: string
    size: number
    x: string
    y: string
}

function Orb({ color, size, x, y }: OrbProps): React.ReactElement {
    return (
        <motion.div
            className="absolute rounded-full blur-3xl"
            style={{
                width: size,
                height: size,
                left: x,
                top: y,
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            }}
            animate={{
                x: [0, 30, 0],
                y: [0, 20, 0],
                scale: [1, 1.1, 1],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    )
}

function GridPattern(): React.ReactElement {
    return (
        <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
                backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)`,
                backgroundSize: "50px 50px",
            }}
        />
    )
}

function NoiseOverlay(): React.ReactElement {
    return (
        <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
        />
    )
}

export function LiquidBackground({
    children,
    variant = "cosmic",
    className,
}: LiquidBackgroundProps): React.ReactElement {
    const variantStyles = variants[variant]

    return (
        <div
            className={cn("relative overflow-hidden", className)}
            style={{
                background: variantStyles.background,
            }}
        >
            {/* Animated Orbs */}
            {variantStyles.orbs.map((orb, index) => (
                <Orb key={index} {...orb} />
            ))}

            {/* Grid Pattern */}
            <GridPattern />

            {/* Noise Overlay */}
            <NoiseOverlay />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}

export default LiquidBackground

