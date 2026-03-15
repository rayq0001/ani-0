/**
 * Anyverse Design Tokens
 * 
 * This module defines the design tokens for the Anyverse ecosystem,
 * featuring holographic, glass-morphism aesthetics with liquid UI elements.
 */

// Color Palette
export const colors = {
    // Primary - Deep Neon Purple
    primary: {
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
    },
    // Secondary - Cinematic Gold
    secondary: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
    },
    // Accent - Holographic Pink
    accent: {
        50: '#fdf2f8',
        100: '#fce7f3',
        200: '#fbcfe8',
        300: '#f9a8d4',
        400: '#f472b6',
        500: '#ec4899',
        600: '#db2777',
        700: '#be185d',
        800: '#9d174d',
        900: '#831843',
    },
    // Background - Deep Space
    background: {
        dark: '#0a0a0f',
        darker: '#050508',
        card: 'rgba(15, 15, 25, 0.8)',
        overlay: 'rgba(0, 0, 0, 0.6)',
    },
    // Glass Effect
    glass: {
        light: 'rgba(255, 255, 255, 0.05)',
        medium: 'rgba(255, 255, 255, 0.1)',
        heavy: 'rgba(255, 255, 255, 0.15)',
        border: 'rgba(255, 255, 255, 0.1)',
        borderHover: 'rgba(255, 255, 255, 0.2)',
    },
    // Neon Glow
    neon: {
        purple: '#8b5cf6',
        pink: '#ec4899',
        gold: '#f59e0b',
        blue: '#3b82f6',
        green: '#10b981',
    },
    // Mood Colors
    mood: {
        action: '#ef4444',
        tension: '#f97316',
        romance: '#ec4899',
        calm: '#10b981',
        mystery: '#6366f1',
        comedy: '#f59e0b',
    },
} as const

// Typography
export const typography = {
    fontFamily: {
        display: '"Orbitron", "SF Pro Display", system-ui, sans-serif',
        body: '"Inter", "SF Pro Text", system-ui, sans-serif',
        mono: '"JetBrains Mono", "SF Mono", monospace',
        arabic: '"Cairo", "Noto Sans Arabic", sans-serif',
    },
    fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
    },
    fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
} as const

// Spacing
export const spacing = {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
} as const

// Border Radius
export const borderRadius = {
    none: '0',
    sm: '0.25rem',
    DEFAULT: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
} as const

// Shadows
export const shadows = {
    glow: {
        sm: '0 0 10px rgba(139, 92, 246, 0.3)',
        md: '0 0 20px rgba(139, 92, 246, 0.4)',
        lg: '0 0 40px rgba(139, 92, 246, 0.5)',
        xl: '0 0 60px rgba(139, 92, 246, 0.6)',
    },
    glass: {
        sm: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        md: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        lg: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
    },
    neon: {
        purple: '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6',
        pink: '0 0 10px #ec4899, 0 0 20px #ec4899, 0 0 30px #ec4899',
        gold: '0 0 10px #f59e0b, 0 0 20px #f59e0b, 0 0 30px #f59e0b',
    },
} as const

// Animations
export const animations = {
    // Gradient animations
    gradient: {
        slow: 'gradient-slow 8s ease infinite',
        medium: 'gradient-medium 4s ease infinite',
        fast: 'gradient-fast 2s ease infinite',
    },
    // Glow pulse
    glow: {
        pulse: 'glow-pulse 2s ease-in-out infinite',
        breathe: 'glow-breathe 4s ease-in-out infinite',
    },
    // Glass shimmer
    shimmer: 'glass-shimmer 3s ease-in-out infinite',
    // Float
    float: 'float 6s ease-in-out infinite',
    // Slide
    slideUp: 'slide-up 0.5s ease-out',
    slideDown: 'slide-down 0.5s ease-out',
    slideLeft: 'slide-left 0.5s ease-out',
    slideRight: 'slide-right 0.5s ease-out',
} as const

// CSS Keyframes (to be used in global CSS)
export const keyframes = {
    'gradient-slow': {
        '0%, 100%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
    },
    'gradient-medium': {
        '0%, 100%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
    },
    'gradient-fast': {
        '0%, 100%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
    },
    'glow-pulse': {
        '0%, 100%': { opacity: 1 },
        '50%': { opacity: 0.5 },
    },
    'glow-breathe': {
        '0%, 100%': { 
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
            transform: 'scale(1)',
        },
        '50%': { 
            boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)',
            transform: 'scale(1.02)',
        },
    },
    'glass-shimmer': {
        '0%': { backgroundPosition: '-200% 0' },
        '100%': { backgroundPosition: '200% 0' },
    },
    'float': {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-10px)' },
    },
    'slide-up': {
        '0%': { transform: 'translateY(20px)', opacity: 0 },
        '100%': { transform: 'translateY(0)', opacity: 1 },
    },
    'slide-down': {
        '0%': { transform: 'translateY(-20px)', opacity: 0 },
        '100%': { transform: 'translateY(0)', opacity: 1 },
    },
    'slide-left': {
        '0%': { transform: 'translateX(20px)', opacity: 0 },
        '100%': { transform: 'translateX(0)', opacity: 1 },
    },
    'slide-right': {
        '0%': { transform: 'translateX(-20px)', opacity: 0 },
        '100%': { transform: 'translateX(0)', opacity: 1 },
    },
} as const

// Breakpoints
export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
} as const

// Z-Index Scale
export const zIndex = {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modal: 1300,
    popover: 1400,
    tooltip: 1500,
    toast: 1600,
    anyverse: {
        canvas: 100,
        overlay: 200,
        modal: 300,
        hud: 400,
        cursor: 500,
    },
} as const

// Transitions
export const transitions = {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    liquid: '800ms cubic-bezier(0.65, 0, 0.35, 1)',
} as const

// Glass Effect Presets
export const glassEffects = {
    light: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    medium: {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
    },
    heavy: {
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    holographic: {
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1), rgba(245, 158, 11, 0.1))',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
    },
} as const

// Gradient Presets
export const gradients = {
    primary: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    secondary: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    anyverse: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)',
    cosmic: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
    holographic: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3), rgba(245, 158, 11, 0.3))',
    mesh: 'radial-gradient(at 40% 20%, rgba(139, 92, 246, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(236, 72, 153, 0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(245, 158, 11, 0.2) 0px, transparent 50%)',
} as const

// Export all tokens as a single object
export const anyverseTokens = {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    animations,
    keyframes,
    breakpoints,
    zIndex,
    transitions,
    glassEffects,
    gradients,
} as const

export type AnyverseTokens = typeof anyverseTokens
export default anyverseTokens

