"use client"

import { cn } from "@/components/ui/core/styling"
import { motion, HTMLMotionProps } from "framer-motion"
import React from "react"

interface HolographicButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    children?: React.ReactNode
    size?: "sm" | "md" | "lg"
    className?: string
    active?: boolean
}

const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm font-arabic",
    lg: "px-8 py-3.5 text-base font-arabic",
}

export function HolographicButton({
    children,
    size = "md",
    className,
    active,
    ...props
}: HolographicButtonProps): React.ReactElement {
    return (
        <motion.button
            className={cn(
                "relative inline-flex items-center justify-center font-semibold rounded-2xl overflow-hidden backdrop-blur-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] group",
                sizes[size],
                className
            )}
            style={{
                background: "rgba(10, 4, 18, 0.8)",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(139,92,246,0.5), 0 5px 20px rgba(0, 0, 0, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            {...props}
        >
            {/* The slow rotating gradient for the luxurious purple dark edge */}
            <motion.div
                className="absolute opacity-70 pointer-events-none mix-blend-screen"
                style={{
                    width: "300%",
                    height: "300%",
                    top: "-100%",
                    left: "-100%",
                    background: "conic-gradient(from 0deg, transparent 0 200deg, #8b5cf6 320deg, transparent 360deg)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            {/* Inner dynamic breathing glow orb */}
            <motion.div
                className="absolute inset-0 pointer-events-none mix-blend-screen"
                style={{
                    background: "radial-gradient(circle at center, rgba(139,92,246,0.6) 0%, transparent 60%)"
                }}
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Inner dark glass (translucent to show the inner light) */}
            <div className={cn(
                "absolute inset-[1.5px] rounded-[14px] shadow-[inset_0_0_25px_rgba(139,92,246,0.4)] pointer-events-none transition-colors backdrop-blur-md",
                active ? "bg-[#0a0412]/40" : "bg-[#0a0412]/60 group-hover:bg-[#0a0412]/40 group-hover:shadow-[inset_0_0_35px_rgba(139,92,246,0.5)]"
            )} />
            
            {/* Content */}
            <span className="relative z-10 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(216,180,254,0.6)] text-purple-100">
                {children}
            </span>
        </motion.button>
    )
}

export default HolographicButton
