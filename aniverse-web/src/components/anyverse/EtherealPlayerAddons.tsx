import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSmartEpisodeAnalyzer, SmartEpisodeAnalyzerResponse } from "../../api/hooks/anyverse.hooks"
import { useInteractiveLoreSubtitles } from "../../api/hooks/anyverse.hooks"

// --- Ethereal Button for Intro/Outro --- //

interface SkipButtonProps {
    type: "intro" | "outro" | "post_credit"
    onClick: () => void
    visible: boolean
}

export const EtherealSkipButton: React.FC<SkipButtonProps> = ({ type, onClick, visible }) => {
    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    onClick={onClick}
                    className="absolute bottom-24 right-8 px-6 py-3 rounded-2xl overflow-hidden group pointer-events-auto shadow-[0_0_40px_rgba(139,92,246,0.6)] backdrop-blur-xl"
                    style={{
                        background: "rgba(10, 4, 18, 0.8)",
                    }}
                >
                    {/* Slow Rotating Border Glow */}
                    <motion.div
                        className="absolute w-[300%] h-[300%] opacity-80 pointer-events-none mix-blend-screen origin-center"
                        style={{
                            top: "-100%", left: "-100%",
                            background: "conic-gradient(from 0deg, transparent 0 200deg, #8b5cf6 320deg, transparent 360deg)"
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                    
                    {/* Inner glowing core */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none mix-blend-screen"
                        style={{
                            background: "radial-gradient(circle at center, rgba(139,92,246,0.6) 0%, transparent 70%)"
                        }}
                        animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.1, 0.9] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    {/* Inner Black Glass Surface - translucent */}
                    <div className="absolute inset-[2px] rounded-[14px] bg-[#0a0412]/40 backdrop-blur-md shadow-[inset_0_0_35px_rgba(139,92,246,0.5)] transition-colors group-hover:bg-[#0a0412]/30 group-hover:shadow-[inset_0_0_45px_rgba(139,92,246,0.7)]" />
                    
                    <span className="relative z-10 text-purple-100 font-bold tracking-wide text-sm flex items-center gap-2 drop-shadow-[0_0_8px_rgba(216,180,254,0.6)]">
                        {type === "intro" ? "Skip Intro" : type === "outro" ? "Skip Outro" : "Post-credits Scene"}
                        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                    </span>
                </motion.button>
            )}
        </AnimatePresence>
    )
}

// --- Interactive Lore Popup for Subtitles --- //

interface ContextMenuProps {
    x: number
    y: number
    text: string
    onClose: () => void
    animeTitle: string
    currentEpisode: number
}

export const LoreContextMenu: React.FC<ContextMenuProps> = ({ x, y, text, onClose, animeTitle, currentEpisode }) => {
    const { mutate, data, isPending } = useInteractiveLoreSubtitles()

    useEffect(() => {
        if (text) {
            mutate({
                anime_title: animeTitle,
                clicked_term: text,
                context_db: "mock_db",
                current_episode: currentEpisode
            })
        }
    }, [text, animeTitle, currentEpisode, mutate])

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute z-[9999] p-4 rounded-xl shadow-2xl pointer-events-auto max-w-sm"
                style={{
                    left: Math.min(x, window.innerWidth - 320),
                    top: Math.min(y, window.innerHeight - 200),
                    background: "rgba(10, 4, 18, 0.85)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(138, 43, 226, 0.4)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.6), 0 0 20px rgba(138,43,226,0.2)"
                }}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-2 left-2 text-gray-400 hover:text-white"
                >
                    ✕
                </button>
                <div className="flex items-center gap-2 mb-3 border-b border-purple-500/30 pb-2">
                    <span className="text-xl">✨</span>
                    <h3 className="text-purple-300 font-bold font-arabic">{text}</h3>
                </div>
                
                <div className="text-gray-200 text-sm font-arabic leading-relaxed rtl">
                    {isPending ? (
                        <div className="flex flex-col items-center justify-center py-4 space-y-3">
                            <div className="flex items-center space-x-1">
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-purple-500 rounded-full" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-purple-400 rounded-full" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-purple-300 rounded-full" />
                            </div>
                            <span className="text-purple-400/60 text-xs">Extracting secure records...</span>
                        </div>
                    ) : data ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {data.result}
                        </motion.div>
                    ) : (
                        <span className="text-red-400">Error retrieving information.</span>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
