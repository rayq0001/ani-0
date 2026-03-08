"use client"

import { cn } from "@/components/ui/core/styling"
import { motion, HTMLMotionProps } from "framer-motion"
import React from "react"

interface HolographicButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    children?: React.ReactNode
    variant?: "primary" | "secondary" | "ghost"
    size?: "sm" | "md" | "lg"
    glow?: boolean
    glowColor?: "purple" | "pink" | "gold" | "blue"
    className?: string
    active?: boolean
}

const variants = {
    primary: {
        background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
        textColor: "white",
    },
    secondary: {
        background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
        textColor: "white",
    },
    ghost: {
        background: "rgba(255, 255, 255, 0.05)",
        textColor: "rgba(255, 255, 255, 0.9)",
    },
}

const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
}

const glowColors = {
    purple: "rgba(139, 92, 246, 0.5)",
    pink: "rgba(236, 72, 153, 0.5)",
    gold: "rgba(245, 158, 11, 0.5)",
    blue: "rgba(59, 130, 246, 0.5)",
}

export function HolographicButton({
    children,
    variant = "primary",
    size = "md",
    glow = true,
    glowColor = "purple",
    className,
    ...props
}: HolographicButtonProps): React.ReactElement {
    const variantStyles = variants[variant]
    const glowColorValue = glowColors[glowColor]

    return (
        <motion.button
            className={cn(
                "relative inline-flex items-center justify-center font-semibold rounded-xl overflow-hidden",
                sizes[size],
                className
            )}
            style={{
                background: variantStyles.background,
                color: variantStyles.textColor,
                boxShadow: glow ? `0 0 20px ${glowColorValue}` : undefined,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ 
                scale: 1.05,
                boxShadow: glow ? `0 0 40px ${glowColorValue}, 0 10px 30px rgba(0, 0, 0, 0.3)` : undefined,
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            {...props}
        >
            {/* Holographic shimmer */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                    transform: "translateX(-100%)",
                    animation: "shimmer 2s ease-in-out infinite",
                }}
            />
            
            {/* Glow background */}
            {glow && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at center, ${glowColorValue} 0%, transparent 70%)`,
                        opacity: 0.5,
                    }}
                />
            )}
            
            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
        </motion.button>
    )
}

export default HolographicButton

