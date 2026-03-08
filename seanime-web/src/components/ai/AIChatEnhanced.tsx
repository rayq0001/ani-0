"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/components/ui/core/styling"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { GlassCard } from "@/components/anyverse/GlassCard"
import { AIBotAvatar, AIBotMini } from "./AIBotAvatar"
import { 
    messageVariants, 
    containerVariants, 
    typingDotVariants,
    slideInRightVariants,
    fadeInVariants 
} from "./ai-animations"
import { 
    LuSend, 
    LuX, 
    LuSparkles, 
    LuCopy, 
    LuCheck,
    LuTrash2,
    LuDownload
} from "react-icons/lu"

interface ChatMessage {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
    isTyping?: boolean
}

interface AIChatEnhancedProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    subtitle?: string
    onSendMessage?: (message: string) => Promise<string>
    initialMessages?: ChatMessage[]
    className?: string
    context?: {
        mangaTitle?: string
        animeTitle?: string
        currentPage?: number
    }
}

// Typing indicator component
function TypingIndicator() {
    return (
        <div className="flex items-center gap-1 px-4 py-3 bg-gray-800/80 rounded-2xl rounded-tl-sm">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-violet-400"
                    variants={typingDotVariants}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                />
            ))}
        </div>
    )
}

// Message bubble component
function MessageBubble({ 
    message, 
    onCopy 
}: { 
    message: ChatMessage
    onCopy: (text: string) => void 
}) {
    const [copied, setCopied] = useState(false)
    const isUser = message.role === "user"

    const handleCopy = () => {
        onCopy(message.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <motion.div
            className={cn(
                "flex gap-3",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            layout
        >
            {/* Avatar */}
            <div className="flex-shrink-0">
                {isUser ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">You</span>
                    </div>
                ) : (
                    <AIBotMini />
                )}
            </div>

            {/* Message content */}
            <div className={cn(
                "flex flex-col max-w-[80%]",
                isUser ? "items-end" : "items-start"
            )}>
                <div className={cn(
                    "relative group px-4 py-3 rounded-2xl text-sm leading-relaxed",
                    isUser 
                        ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-tr-sm"
                        : "bg-gray-800/80 text-gray-200 rounded-tl-sm border border-gray-700/50"
                )}>
                    {/* Message text */}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {/* Copy button */}
                    <motion.button
                        className={cn(
                            "absolute -top-2 opacity-0 group-hover:opacity-100 transition-opacity",
                            isUser ? "-left-8" : "-right-8",
                            "p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white"
                        )}
                        onClick={handleCopy}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {copied ? <LuCheck className="w-3.5 h-3.5 text-green-400" /> : <LuCopy className="w-3.5 h-3.5" />}
                    </motion.button>
                </div>

                {/* Timestamp */}
                <span className="text-[10px] text-gray-500 mt-1 px-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </motion.div>
    )
}

// Welcome screen component
function WelcomeScreen({ 
    onSuggestionClick,
    title = "AI Assistant",
    subtitle = "How can I help you today?"
}: { 
    onSuggestionClick: (suggestion: string) => void
    title?: string
    subtitle?: string
}) {
    const suggestions = [
        "What anime should I watch next?",
        "Explain the plot of Attack on Titan",
        "Recommend manga similar to One Piece",
        "What's trending this season?",
    ]

    return (
        <motion.div
            className="flex flex-col items-center justify-center h-full p-6 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <AIBotAvatar size="lg" animate glow className="mb-6" />
            
            <motion.h3 
                className="text-xl font-bold text-white mb-2"
                variants={fadeInVariants}
            >
                {title}
            </motion.h3>
            
            <motion.p 
                className="text-gray-400 mb-8"
                variants={fadeInVariants}
            >
                {subtitle}
            </motion.p>

            <motion.div 
                className="grid grid-cols-1 gap-2 w-full max-w-sm"
                variants={containerVariants}
            >
                {suggestions.map((suggestion, index) => (
                    <motion.button
                        key={index}
                        className="p-3 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-violet-500/50 hover:bg-gray-800 transition-all text-left text-sm text-gray-300 hover:text-white"
                        variants={slideInRightVariants}
                        onClick={() => onSuggestionClick(suggestion)}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <LuSparkles className="w-4 h-4 inline-block mr-2 text-violet-400" />
                        {suggestion}
                    </motion.button>
                ))}
            </motion.div>
        </motion.div>
    )
}

// Empty state component
function EmptyState({ context }: { context?: AIChatEnhancedProps["context"] }) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <AIBotAvatar size="md" animate={false} className="mb-4 opacity-50" />
            <p className="text-gray-500 text-sm">
                {context?.mangaTitle 
                    ? `Ask me anything about ${context.mangaTitle}`
                    : context?.animeTitle
                    ? `Ask me anything about ${context.animeTitle}`
                    : "Start a conversation with the AI assistant"}
            </p>
        </div>
    )
}

export function AIChatEnhanced({
    isOpen,
    onClose,
    title = "AI Assistant",
    subtitle,
    onSendMessage,
    initialMessages = [],
    className,
    context,
}: AIChatEnhancedProps) {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [showWelcome, setShowWelcome] = useState(initialMessages.length === 0)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isTyping])

    // Focus input when opened
    useEffect(() => {
        if (isOpen && !showWelcome) {
            setTimeout(() => textareaRef.current?.focus(), 100)
        }
    }, [isOpen, showWelcome])

    const handleSend = async () => {
        if (!inputValue.trim() || isTyping) return

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue.trim(),
            timestamp: new Date(),
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue("")
        setIsTyping(true)
        setShowWelcome(false)

        if (onSendMessage) {
            try {
                const response = await onSendMessage(userMessage.content)
                
                const assistantMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: response,
                    timestamp: new Date(),
                }

                setMessages(prev => [...prev, assistantMessage])
            } catch (error) {
                const errorMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: "Sorry, I encountered an error. Please try again.",
                    timestamp: new Date(),
                }
                setMessages(prev => [...prev, errorMessage])
            } finally {
                setIsTyping(false)
            }
        } else {
            // Simulate typing delay for demo
            setTimeout(() => {
                const assistantMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: "This is a demo response. Connect to an AI service for real responses.",
                    timestamp: new Date(),
                }
                setMessages(prev => [...prev, assistantMessage])
                setIsTyping(false)
            }, 1500)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion)
        setShowWelcome(false)
        setTimeout(() => handleSend(), 100)
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    const clearChat = () => {
        setMessages([])
        setShowWelcome(true)
    }

    if (!isOpen) return null

    return (
        <motion.div
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm",
                className
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="w-full max-w-2xl h-[80vh] max-h-[700px]"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
            >
                <GlassCard 
                    variant="heavy" 
                    glow 
                    glowColor="purple"
                    className="h-full flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-800/50 bg-gray-900/30">
                        <div className="flex items-center gap-3">
                            <AIBotAvatar size="sm" animate status="idle" />
                            <div>
                                <h3 className="font-semibold text-white flex items-center gap-2">
                                    {title}
                                    <span className="flex items-center gap-1 text-xs font-normal text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">
                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                                        Online
                                    </span>
                                </h3>
                                {subtitle && (
                                    <p className="text-xs text-gray-400">{subtitle}</p>
                                )}
                                {context?.mangaTitle && (
                                    <p className="text-xs text-violet-400">
                                        Discussing: {context.mangaTitle}
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {/* Clear chat button */}
                            {messages.length > 0 && (
                                <motion.button
                                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                    onClick={clearChat}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Clear chat"
                                >
                                    <LuTrash2 className="w-4 h-4" />
                                </motion.button>
                            )}
                            
                            {/* Close button */}
                            <motion.button
                                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                                onClick={onClose}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <LuX className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Messages area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {showWelcome ? (
                                <WelcomeScreen 
                                    key="welcome"
                                    onSuggestionClick={handleSuggestionClick}
                                    title={title}
                                    subtitle={subtitle}
                                />
                            ) : messages.length === 0 ? (
                                <EmptyState key="empty" context={context} />
                            ) : (
                                <motion.div
                                    key="messages"
                                    className="space-y-4"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {messages.map((message) => (
                                        <MessageBubble 
                                            key={message.id} 
                                            message={message}
                                            onCopy={handleCopy}
                                        />
                                    ))}
                                    
                                    {isTyping && (
                                        <motion.div
                                            className="flex gap-3"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <AIBotMini />
                                            <TypingIndicator />
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input area */}
                    <div className="p-4 border-t border-gray-800/50 bg-gray-900/30">
                        <div className="flex gap-3">
                            <Textarea
                                ref={textareaRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={showWelcome ? "Or type your message..." : "Type your message..."}
                                className="min-h-[60px] max-h-[120px] resize-none bg-gray-800/50 border-gray-700/50 focus:border-violet-500/50 text-white placeholder:text-gray-500"
                                disabled={isTyping}
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!inputValue.trim() || isTyping}
                                className={cn(
                                    "self-end h-[60px] px-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white",
                                    (!inputValue.trim() || isTyping) && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                <motion.div
                                    animate={isTyping ? { rotate: 360 } : {}}
                                    transition={{ duration: 1, repeat: isTyping ? Infinity : 0 }}
                                >
                                    {isTyping ? (
                                        <LuSparkles className="w-5 h-5" />
                                    ) : (
                                        <LuSend className="w-5 h-5" />
                                    )}
                                </motion.div>
                            </Button>
                        </div>
                        
                        <p className="text-[10px] text-gray-500 mt-2 text-center">
                            AI responses are generated and may not always be accurate
                        </p>
                    </div>
                </GlassCard>
            </motion.div>
        </motion.div>
    )
}

export default AIChatEnhanced
