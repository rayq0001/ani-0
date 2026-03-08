"use client"

import { motion } from "framer-motion"
import { cn } from "@/components/ui/core/styling"
import { 
    breathingVariants, 
    floatingVariants, 
    pulseGlowVariants,
    rotateVariants 
} from "./ai-animations"
import { useEffect, useState } from "react"

interface AIBotAvatarProps {
    size?: "sm" | "md" | "lg" | "xl"
    animate?: boolean
    glow?: boolean
    className?: string
    status?: "idle" | "thinking" | "speaking" | "listening"
}

const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
    xl: "w-28 h-28",
}

const iconSizes = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-10 h-10",
    xl: "w-14 h-14",
}

// Particle component for floating particles around the avatar
function Particle({ delay, duration, distance }: { delay: number; duration: number; distance: number }) {
    return (
        <motion.div
            className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-violet-400 to-pink-400"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, Math.cos(delay) * distance],
                y: [0, Math.sin(delay) * distance],
            }}
            transition={{
                duration: duration,
                delay: delay,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            style={{
                left: "50%",
                top: "50%",
            }}
        />
    )
}

// Ring component for orbital rings
function OrbitalRing({ 
    size, 
    duration, 
    delay, 
    color 
}: { 
    size: number; 
    duration: number; 
    delay: number; 
    color: string 
}) {
    return (
        <motion.div
            className="absolute rounded-full border-2 border-dashed"
            style={{
                width: size,
                height: size,
                borderColor: color,
                left: "50%",
                top: "50%",
                marginLeft: -size / 2,
                marginTop: -size / 2,
            }}
            animate={{
                rotate: 360,
                scale: [1, 1.05, 1],
            }}
            transition={{
                rotate: {
                    duration: duration,
                    repeat: Infinity,
                    ease: "linear",
                },
                scale: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                },
            }}
            initial={{ rotate: delay }}
        />
    )
}

// Holographic scan line effect
function HolographicScan() {
    return (
        <motion.div
            className="absolute inset-0 overflow-hidden rounded-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
            }}
        >
            <motion.div
                className="w-full h-1 bg-gradient-to-r from-transparent via-violet-400 to-transparent"
                animate={{
                    y: ["0%", "100%"],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </motion.div>
    )
}

// Status indicator
function StatusIndicator({ status, size }: { status: string; size: "sm" | "md" | "lg" | "xl" }) {
    const statusColors = {
        idle: "bg-gray-500",
        thinking: "bg-amber-400",
        speaking: "bg-green-400",
        listening: "bg-violet-400",
    }

    const indicatorSizes = {
        sm: "w-2 h-2",
        md: "w-2.5 h-2.5",
        lg: "w-3 h-3",
        xl: "w-4 h-4",
    }

    return (
        <motion.div
            className={cn(
                "absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-gray-900",
                statusColors[status as keyof typeof statusColors],
                indicatorSizes[size]
            )}
            animate={{
                scale: status === "thinking" ? [1, 1.2, 1] : 1,
                opacity: status === "listening" ? [1, 0.5, 1] : 1,
            }}
            transition={{
                duration: 0.5,
                repeat: status === "thinking" || status === "listening" ? Infinity : 0,
            }}
        />
    )
}

export function AIBotAvatar({ 
    size = "md", 
    animate = true, 
    glow = true,
    className,
    status = "idle"
}: AIBotAvatarProps) {
    const [particles, setParticles] = useState<Array<{ id: number; delay: number; duration: number; distance: number }>>([])

    useEffect(() => {
        // Generate random particles
        const newParticles = Array.from({ length: 6 }, (_, i) => ({
            id: i,
            delay: i * 0.5,
            duration: 3 + Math.random() * 2,
            distance: 30 + Math.random() * 20,
        }))
        setParticles(newParticles)
    }, [])

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            {/* Outer glow effect */}
            {glow && (
                <motion.div
                    className={cn(
                        "absolute rounded-full blur-xl opacity-50",
                        sizeClasses[size]
                    )}
                    style={{
                        background: "radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, rgba(236, 72, 153, 0.3) 50%, transparent 70%)",
                    }}
                    variants={pulseGlowVariants}
                    initial="initial"
                    animate="animate"
                />
            )}

            {/* Orbital rings */}
            {animate && (
                <>
                    <OrbitalRing 
                        size={size === "sm" ? 50 : size === "md" ? 70 : size === "lg" ? 100 : 140} 
                        duration={20} 
                        delay={0} 
                        color="rgba(139, 92, 246, 0.3)" 
                    />
                    <OrbitalRing 
                        size={size === "sm" ? 60 : size === "md" ? 85 : size === "lg" ? 120 : 170} 
                        duration={25} 
                        delay={45} 
                        color="rgba(236, 72, 153, 0.2)" 
                    />
                </>
            )}

            {/* Floating particles */}
            {animate && particles.map((particle) => (
                <Particle 
                    key={particle.id} 
                    delay={particle.delay} 
                    duration={particle.duration} 
                    distance={particle.distance} 
                />
            ))}

            {/* Main avatar container */}
            <motion.div
                className={cn(
                    "relative rounded-full overflow-hidden",
                    "bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500",
                    "flex items-center justify-center",
                    sizeClasses[size]
                )}
                variants={animate ? breathingVariants : undefined}
                initial="initial"
                animate="animate"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Inner gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/50 via-transparent to-pink-500/50" />

                {/* Holographic scan effect */}
                {animate && <HolographicScan />}

                {/* AI Icon */}
                <motion.svg
                    className={cn("relative z-10 text-white", iconSizes[size])}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={status === "thinking" ? {
                        rotate: [0, 5, -5, 0],
                    } : {}}
                    transition={{
                        duration: 0.5,
                        repeat: status === "thinking" ? Infinity : 0,
                    }}
                >
                    {/* Brain/AI icon paths */}
                    <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                    <path d="M9 21h6" />
                    <motion.circle
                        cx="12"
                        cy="9"
                        r="2"
                        fill="currentColor"
                        animate={status === "speaking" ? {
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.7, 1],
                        } : {}}
                        transition={{
                            duration: 0.3,
                            repeat: status === "speaking" ? Infinity : 0,
                        }}
                    />
                    {/* Circuit lines */}
                    <motion.path
                        d="M8 9h-3M19 9h-3M12 5V3"
                        strokeOpacity="0.6"
                        animate={animate ? {
                            strokeDasharray: ["0, 10", "10, 0"],
                            strokeDashoffset: [0, -10],
                        } : {}}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                </motion.svg>

                {/* Shine effect */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)",
                        backgroundSize: "200% 200%",
                    }}
                    animate={{
                        backgroundPosition: ["200% 200%", "-200% -200%"],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </motion.div>

            {/* Status indicator */}
            <StatusIndicator status={status} size={size} />
        </div>
    )
}

// Animated AI Bot with text
interface AIBotWithTextProps extends AIBotAvatarProps {
    text?: string
    subtext?: string
    align?: "left" | "right" | "center"
}

export function AIBotWithText({ 
    text = "AI Assistant", 
    subtext,
    align = "center",
    ...avatarProps 
}: AIBotWithTextProps) {
    return (
        <div className={cn(
            "flex flex-col items-center gap-3",
            align === "left" && "items-start",
            align === "right" && "items-end"
        )}>
            <AIBotAvatar {...avatarProps} />
            
            <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h4 className="text-white font-semibold text-sm">{text}</h4>
                {subtext && (
                    <p className="text-gray-400 text-xs mt-0.5">{subtext}</p>
                )}
            </motion.div>
        </div>
    )
}

// Mini AI Bot for inline use
export function AIBotMini({ className }: { className?: string }) {
    return (
        <motion.div
            className={cn(
                "w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-pink-500",
                "flex items-center justify-center",
                className
            )}
            animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                    "0 0 5px rgba(139, 92, 246, 0.5)",
                    "0 0 15px rgba(139, 92, 246, 0.8)",
                    "0 0 5px rgba(139, 92, 246, 0.5)",
                ],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
            }}
        >
            <svg
                className="w-3.5 h-3.5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                <circle cx="12" cy="9" r="1.5" fill="currentColor" />
            </svg>
        </motion.div>
    )
}

export default AIBotAvatar
