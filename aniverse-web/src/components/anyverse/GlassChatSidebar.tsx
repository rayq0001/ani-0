import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAIWatchPartyCompanion, WatchReaction } from "../../api/hooks/anyverse.hooks"

interface GlassChatSidebarProps {
    subtitleText: string
    currentTimeMs: number // from the video player
    onClose?: () => void
}

export const GlassChatSidebar: React.FC<GlassChatSidebarProps> = ({ subtitleText, currentTimeMs, onClose }) => {
    const { mutate, data: reactions, isPending } = useAIWatchPartyCompanion()
    const [visibleReactions, setVisibleReactions] = useState<WatchReaction[]>([])
    const scrollRef = useRef<HTMLDivElement>(null)

    // Helper to parse MM:SS string to milliseconds
    const parseTimeToMs = (timeStr: string) => {
        const parts = timeStr.split(":")
        if (parts.length === 2) {
            return (parseInt(parts[0]) * 60 + parseInt(parts[1])) * 1000
        }
        return 0
    }

    // Trigger AI extraction on mount (assuming caching is handled by backend)
    useEffect(() => {
        if (subtitleText) {
            mutate({ subtitle_text: subtitleText })
        }
    }, [subtitleText, mutate])

    // Sync reactions with video time
    useEffect(() => {
        if (!reactions) return

        const active = reactions.filter(
            (r) => parseTimeToMs(r.timestamp) <= currentTimeMs
        )
        if (active.length !== visibleReactions.length) {
            setVisibleReactions(active)
            // Scroll to bottom
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
                }
            }, 100)
        }
    }, [currentTimeMs, reactions, visibleReactions.length])

    return (
        <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-0 right-0 h-full w-80 p-4 border-l border-purple-500/30 flex flex-col pointer-events-auto"
            style={{
                background: "rgba(10, 4, 18, 0.75)",
                backdropFilter: "blur(15px)",
                WebkitBackdropFilter: "blur(15px)",
                boxShadow: "-10px 0 30px rgba(0,0,0,0.5)"
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3 mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🤖</span>
                    <span className="text-purple-200 font-bold tracking-tight">Aniverse AI Party</span>
                </div>
                {onClose && (
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Chat Area */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent flex flex-col justify-end"
                dir="rtl"
            >
                {isPending && (
                    <div className="flex items-center justify-center p-4">
                        <div className="w-4 h-4 rounded-full border-t-2 border-purple-400 animate-spin" />
                        <span className="ml-2 text-sm text-purple-300">Loading ethereal friends...</span>
                    </div>
                )}

                <AnimatePresence>
                    {visibleReactions.map((reaction, idx) => (
                        <motion.div
                            key={`${reaction.timestamp}-${idx}`}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="flex items-start gap-3 bg-purple-900/20 p-3 rounded-2xl rounded-tr-none border border-purple-500/30 shadow-[0_4px_15px_rgba(157,78,221,0.1)]"
                        >
                            <div className="text-2xl mt-1">
                                {reaction.emotion === "shock" ? "😱" : 
                                 reaction.emotion === "hype" ? "🔥" : 
                                 reaction.emotion === "funny" ? "😂" : 
                                 reaction.emotion === "sad" ? "😢" : "✨"}
                            </div>
                            <div>
                                <div className="text-xs text-purple-400/80 mb-1 font-mono">
                                    [Mascot AI] @ {reaction.timestamp}
                                </div>
                                <div className="text-gray-100 text-sm font-arabic leading-relaxed">
                                    {reaction.reaction}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {reactions && visibleReactions.length === 0 && !isPending && (
                    <div className="h-full flex flex-col items-center justify-center text-center text-purple-400/50 opacity-50">
                        <span className="text-4xl mb-2">🍿</span>
                        <p className="text-sm px-4">Aniverse intelligence is preparing to interact with episode events...</p>
                    </div>
                )}
            </div>

            {/* Fake Input Area to simulate chat */}
            <div className="mt-4 pt-4 border-t border-purple-500/20">
                <div className="bg-black/40 border border-purple-500/30 rounded-full p-2.5 flex items-center px-4">
                    <span className="text-gray-500 text-sm italic ml-auto">Add your comment...</span>
                    <span className="text-purple-400 opacity-50">↩</span>
                </div>
            </div>
        </motion.div>
    )
}
