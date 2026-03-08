/**
 * AI Animation Variants
 * Shared animation configurations for AI components
 */

import { Variants } from "framer-motion"

// Container animations
export const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
        },
    },
}

// Item animations for lists
export const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 24,
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.95,
        transition: {
            duration: 0.2,
        },
    },
}

// Slide in from right
export const slideInRightVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
        },
    },
    exit: {
        opacity: 0,
        x: 50,
        transition: {
            duration: 0.2,
        },
    },
}

// Slide in from left
export const slideInLeftVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
        },
    },
    exit: {
        opacity: 0,
        x: -50,
        transition: {
            duration: 0.2,
        },
    },
}

// Scale up animation
export const scaleUpVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        transition: {
            duration: 0.2,
        },
    },
}

// Fade in animation
export const fadeInVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.3,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2,
        },
    },
}

// Message bubble animations
export const messageVariants: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        transition: {
            duration: 0.15,
        },
    },
}

// Typing indicator animation
export const typingDotVariants: Variants = {
    hidden: { opacity: 0, y: 0 },
    visible: (i: number) => ({
        opacity: 1,
        y: [0, -5, 0],
        transition: {
            opacity: { duration: 0.2 },
            y: {
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
            },
        },
    }),
}

// Pulse glow animation
export const pulseGlowVariants: Variants = {
    initial: {
        boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
    },
    animate: {
        boxShadow: [
            "0 0 20px rgba(139, 92, 246, 0.3)",
            "0 0 40px rgba(139, 92, 246, 0.5)",
            "0 0 60px rgba(139, 92, 246, 0.3)",
            "0 0 20px rgba(139, 92, 246, 0.3)",
        ],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
}

// Floating animation
export const floatingVariants: Variants = {
    initial: { y: 0 },
    animate: {
        y: [-5, 5, -5],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
}

// Breathing animation for AI avatar
export const breathingVariants: Variants = {
    initial: { scale: 1 },
    animate: {
        scale: [1, 1.02, 1],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
}

// Card hover animation
export const cardHoverVariants = {
    rest: {
        scale: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
    hover: {
        scale: 1.02,
        y: -5,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
}

// Stagger container for lists
export const staggerContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
}

// Pop in animation for buttons
export const popInVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 500,
            damping: 25,
        },
    },
    exit: {
        opacity: 0,
        scale: 0,
        transition: {
            duration: 0.15,
        },
    },
}

// Shimmer animation for loading states
export const shimmerVariants: Variants = {
    initial: {
        backgroundPosition: "-200% 0",
    },
    animate: {
        backgroundPosition: ["200% 0", "-200% 0"],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "linear",
        },
    },
}

// Rotate animation
export const rotateVariants: Variants = {
    initial: { rotate: 0 },
    animate: {
        rotate: 360,
        transition: {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
        },
    },
}

// Bounce animation
export const bounceVariants: Variants = {
    initial: { y: 0 },
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 0.6,
            repeat: Infinity,
            ease: "easeOut",
        },
    },
}

// Notification badge pulse
export const notificationPulseVariants: Variants = {
    initial: {
        scale: 1,
        boxShadow: "0 0 0 0 rgba(139, 92, 246, 0.7)",
    },
    animate: {
        scale: [1, 1.1, 1],
        boxShadow: [
            "0 0 0 0 rgba(139, 92, 246, 0.7)",
            "0 0 0 10px rgba(139, 92, 246, 0)",
            "0 0 0 0 rgba(139, 92, 246, 0)",
        ],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
        },
    },
}

// Spring transition presets
export const springTransitions = {
    gentle: {
        type: "spring",
        stiffness: 200,
        damping: 25,
    },
    bouncy: {
        type: "spring",
        stiffness: 400,
        damping: 20,
    },
    stiff: {
        type: "spring",
        stiffness: 500,
        damping: 30,
    },
    slow: {
        type: "spring",
        stiffness: 100,
        damping: 20,
    },
}

// Easing functions
export const easings = {
    smooth: [0.22, 1, 0.36, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
    gentle: [0.4, 0, 0.2, 1],
    snappy: [0.25, 0.46, 0.45, 0.94],
}
