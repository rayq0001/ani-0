"use client"

import { cn } from "@/components/ui/core/styling"
import { motion, HTMLMotionProps } from "framer-motion"
import React from "react"

interface NeonBadgeProps extends Omit<HTMLMotionProps<"span">, "children"> {
    children?: React.ReactNode
    color?: "purple" | "pink" | "gold" | "blue" | "green" | "red"
    variant?: "solid" | "outline" | "glow"
    size?: "sm" | "md" | "lg"
    className?: string
}

const colors = {
    purple: {
        solid: "bg-violet-600 text-white",
        outline: "border-violet-500 text-violet-400 bg-transparent",
        glow: "bg-violet-600/20 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.5)]",
    },
    pink: {
        solid: "bg-pink-600 text-white",
        outline: "border-pink-500 text-pink-400 bg-transparent",
        glow: "bg-pink-600/20 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.5)]",
    },
    gold: {
        solid: "bg-amber-600 text-white",
        outline: "border-amber-500 text-amber-400 bg-transparent",
        glow: "bg-amber-600/20 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]",
    },
    blue: {
        solid: "bg-blue-600 text-white",
        outline: "border-blue-500 text-blue-400 bg-transparent",
        glow: "bg-blue-600/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]",
    },
    green: {
        solid: "bg-emerald-600 text-white",
        outline: "border-emerald-500 text-emerald-400 bg-transparent",
        glow: "bg-emerald-600/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]",
    },
    red: {
        solid: "bg-red-600 text-white",
        outline: "border-red-500 text-red-400 bg-transparent",
        glow: "bg-red-600/20 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.5)]",
    },
}

const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
}

export function NeonBadge({
    children,
    color = "purple",
    variant = "glow",
    size = "md",
    className,
    ...props
}: NeonBadgeProps): React.ReactElement {
    const colorStyles = colors[color][variant]
    const sizeStyles = sizes[size]

    return (
        <motion.span
            className={cn(
                "inline-flex items-center justify-center font-semibold rounded-full",
                sizeStyles,
                colorStyles,
                variant === "outline" && "border",
                className
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 500, damping: 30 }}
            whileHover={{ scale: 1.1 }}
            {...props}
        >
            {children}
        </motion.span>
    )
}

export default NeonBadge

