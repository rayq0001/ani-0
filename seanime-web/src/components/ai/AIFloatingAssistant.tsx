"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/components/ui/core/styling"
import { AIBotAvatar } from "./AIBotAvatar"
import { AIChatEnhanced } from "./AIChatEnhanced"
import { 
    containerVariants, 
    itemVariants, 
    popInVariants,
    notificationPulseVariants 
} from "./ai-animations"
import { 
    LuX, 
    LuMessageSquare, 
    LuSparkles,
    LuZap,
    LuBrain
} from "react-icons/lu"

interface AIFloatingAssistantProps {
    className?: string
    initialOpen?: boolean
}

// Quick action button
function QuickAction({ 
    icon: Icon, 
    label, 
    onClick, 
    color = "violet" 
}: { 
    icon: React.ElementType
    label: string
    onClick: () => void
    color?: "violet" | "blue" | "green" | "amber"
}) {
    const colorClasses = {
        violet: "from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400",
        blue: "from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400",
        green: "from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400",
        amber: "from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400",
    }

    return (
        <motion.button
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/80 border border-gray-700/50 hover:border-gray-600 transition-all w-full text-left group"
            onClick={onClick}
            variants={itemVariants}
            whileHover={{ x: 5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className={cn(
                "w-8 h-8 rounded-lg bg-gradient-to-r flex items-center justify-center flex-shrink-0",
                colorClasses[color]
            )}>
                <Icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                {label}
            </span>
            <LuSparkles className="w-3.5 h-3.5 text-violet-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
    )
}

// Suggestion chip
function SuggestionChip({ text, onClick }: { text: string; onClick: () => void }) {
    return (
        <motion.button
            className="px-3 py-1.5 rounded-full bg-gray-800/60 border border-gray-700/50 hover:border-violet-500/50 hover:bg-violet-500/10 text-xs text-gray-400 hover:text-violet-300 transition-all whitespace-nowrap"
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {text}
        </motion.button>
    )
}

export function AIFloatingAssistant({ 
    className,
    initialOpen = false 
}: AIFloatingAssistantProps) {
    const [isOpen, setIsOpen] = useState(initialOpen)
    const [showChat, setShowChat] = useState(false)
    const [hasNotification, setHasNotification] = useState(true)
    const [assistantStatus, setAssistantStatus] = useState<"idle" | "thinking" | "speaking">("idle")

    // Simulate status changes
    useEffect(() => {
        if (!isOpen) return
        
        const interval = setInterval(() => {
            const statuses: Array<"idle" | "thinking" | "speaking"> = ["idle", "thinking", "speaking"]
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
            setAssistantStatus(randomStatus)
        }, 5000)

        return () => clearInterval(interval)
    }, [isOpen])

    const handleOpenChat = () => {
        setShowChat(true)
        setIsOpen(false)
        setHasNotification(false)
    }

    const handleSuggestionClick = (suggestion: string) => {
        setShowChat(true)
        setIsOpen(false)
    }

    const quickActions = [
        { icon: LuMessageSquare, label: "Chat with AI", onClick: handleOpenChat, color: "violet" as const },
        { icon: LuZap, label: "Get Recommendations", onClick: handleOpenChat, color: "amber" as const },
        { icon: LuBrain, label: "AI Tools", onClick: handleOpenChat, color: "blue" as const },
    ]

    const suggestions = [
        "What should I watch?",
        "Explain this anime",
        "Similar to Attack on Titan",
        "Trending now",
    ]

    return (
        <>
            {/* Floating Button - Always visible with high z-index */}
            <div className={cn("fixed bottom-6 right-6 z-[9999] ai-floating-button", className)} style={{ display: 'block', visibility: 'visible' }}>
                <AnimatePresence>
                    {!isOpen && !showChat && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                            <motion.button
                                className="relative group w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center text-white border-2 border-white/20"
                                onClick={() => setIsOpen(true)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {/* Notification badge */}
                                {hasNotification && (
                                    <motion.div
                                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full z-20 border-2 border-gray-900"
                                        variants={notificationPulseVariants}
                                        initial="initial"
                                        animate="animate"
                                    />
                                )}
                                
                                {/* Bot Icon */}
                                <svg 
                                    className="w-8 h-8 text-white" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                                    />
                                </svg>
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Expanded Panel */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="absolute bottom-0 right-0 w-80"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                            <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                                {/* Header */}
                                <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-violet-600/20 to-purple-600/20">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <AIBotAvatar size="sm" animate status={assistantStatus} />
                                            <div>
                                                <h4 className="font-semibold text-white text-sm">AI Assistant</h4>
                                                <p className="text-xs text-gray-400">
                                                    {assistantStatus === "thinking" ? "Thinking..." : 
                                                     assistantStatus === "speaking" ? "Ready to help" : 
                                                     "Online"}
                                                </p>
                                            </div>
                                        </div>
                                        <motion.button
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                                            onClick={() => setIsOpen(false)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <LuX className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-3">
                                    {/* Quick Actions */}
                                    <motion.div
                                        className="space-y-2"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {quickActions.map((action) => (
                                            <QuickAction key={action.label} {...action} />
                                        ))}
                                    </motion.div>

                                    {/* Suggestions */}
                                    <div className="pt-2">
                                        <p className="text-xs text-gray-500 mb-2">Try asking:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {suggestions.map((suggestion) => (
                                                <SuggestionChip 
                                                    key={suggestion} 
                                                    text={suggestion}
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-4 py-3 bg-gray-800/50 border-t border-gray-800">
                                    <p className="text-[10px] text-gray-500 text-center">
                                        Powered by Gemini AI • Press to chat
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Full Chat Modal */}
            <AnimatePresence>
                {showChat && (
                    <AIChatEnhanced
                        isOpen={showChat}
                        onClose={() => setShowChat(false)}
                        title="AI Assistant"
                        subtitle="Ask me anything about anime and manga"
                    />
                )}
            </AnimatePresence>
        </>
    )
}

export default AIFloatingAssistant
