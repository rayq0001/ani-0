"use client"

import { cn } from "@/components/ui/core/styling"
import { motion, HTMLMotionProps } from "framer-motion"
import React from "react"

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
    children?: React.ReactNode
    variant?: "light" | "medium" | "heavy" | "holographic"
    glow?: boolean
    glowColor?: "purple" | "pink" | "gold" | "blue" | "green"
    hover?: boolean
    className?: string
}

const glassVariants = {
    light: {
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    medium: {
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(20px)",
        borderColor: "rgba(255, 255, 255, 0.15)",
    },
    heavy: {
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(30px)",
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    holographic: {
        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15), rgba(245, 158, 11, 0.15))",
        backdropFilter: "blur(30px)",
        borderColor: "rgba(255, 255, 255, 0.25)",
    },
}

const glowColors = {
    purple: "rgba(139, 92, 246, 0.4)",
    pink: "rgba(236, 72, 153, 0.4)",
    gold: "rgba(245, 158, 11, 0.4)",
    blue: "rgba(59, 130, 246, 0.4)",
    green: "rgba(16, 185, 129, 0.4)",
}

export function GlassCard({
    children,
    variant = "medium",
    glow = false,
    glowColor = "purple",
    hover = false,
    className,
    ...props
}: GlassCardProps) {
    const variantStyles = glassVariants[variant]
    const glowColorValue = glowColors[glowColor]

    return (
        <motion.div
            className={cn(
                "relative rounded-2xl border overflow-hidden",
                className
            )}
            style={{
                background: variantStyles.background,
                backdropFilter: variantStyles.backdropFilter,
                borderColor: variantStyles.borderColor,
                boxShadow: glow ? `0 0 30px ${glowColorValue}, 0 8px 32px rgba(0, 0, 0, 0.3)` : undefined,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={hover ? {
                scale: 1.02,
                borderColor: "rgba(255, 255, 255, 0.3)",
                boxShadow: `0 0 40px ${glowColorValue}, 0 12px 40px rgba(0, 0, 0, 0.4)`,
            } : undefined}
            {...props}
        >
            {/* Holographic shimmer effect */}
            {variant === "holographic" && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "linear-gradient(135deg, transparent 40%, rgba(255, 255, 255, 0.1) 50%, transparent 60%)",
                        backgroundSize: "200% 200%",
                        animation: "shimmer 3s ease-in-out infinite",
                    }}
                />
            )}
            
            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    )
}

// Glass Card with gradient border
interface GlassCardGradientProps {
    children?: React.ReactNode
    gradientColors?: string[]
    className?: string
}

export function GlassCardGradient({
    children,
    gradientColors = ["#8b5cf6", "#ec4899", "#f59e0b"],
    className,
}: GlassCardGradientProps): React.ReactElement {
    return (
        <div className={cn("relative rounded-2xl", className)}>
            {/* Gradient border */}
            <div
                className="absolute inset-0 rounded-2xl"
                style={{
                    background: `linear-gradient(135deg, ${gradientColors.join(", ")})`,
                    padding: "1px",
                }}
            />
            {/* Inner content */}
            <div className="relative rounded-2xl bg-[#0a0a0f]">
                <GlassCard>
                    {children}
                </GlassCard>
            </div>
        </div>
    )
}

export default GlassCard

