import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAISceneVisualization } from "../../api/hooks/anyverse.hooks"

interface SceneVisualizerModalProps {
    isOpen: boolean
    onClose: () => void
    arabicText: string // The selected text from the novel
}

export const SceneVisualizerModal: React.FC<SceneVisualizerModalProps> = ({ isOpen, onClose, arabicText }) => {
    const { mutate, data, isPending } = useAISceneVisualization()
    const [hasTriggered, setHasTriggered] = useState(false)

    // Trigger generation when modal opens
    React.useEffect(() => {
        if (isOpen && arabicText && !hasTriggered) {
            mutate({ arabic_text: arabicText })
            setHasTriggered(true)
        }
    }, [isOpen, arabicText, hasTriggered, mutate])

    // Reset trigger when closed
    React.useEffect(() => {
        if (!isOpen) setHasTriggered(false)
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-4xl bg-[#0a0412] border border-purple-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(157,78,221,0.2)]"
                        dir="rtl"
                    >
                        <div className="absolute top-4 left-4 z-50">
                            <button 
                                onClick={onClose}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-white/10 text-white backdrop-blur-md transition-colors border border-white/10"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row h-[70vh] md:h-[600px]">
                            {/* Text Selection Area (Right Side in RTL) */}
                            <div className="w-full md:w-1/3 p-6 border-b md:border-b-0 md:border-l border-purple-500/20 bg-gradient-to-b from-purple-900/10 to-transparent flex flex-col">
                                <h3 className="text-xl font-bold font-arabic mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 flex items-center gap-2">
                                    <span className="text-2xl">🪄</span> Magic Eye
                                </h3>
                                
                                <p className="text-gray-400 text-sm mb-2 font-mono uppercase tracking-widest px-2 relative inline-table">
                                    Text Fragment
                                </p>
                                
                                <div className="flex-1 bg-black/40 rounded-xl p-4 overflow-y-auto border border-white/5 font-arabic text-gray-300 leading-relaxed text-justify relative">
                                    <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-purple-500 to-transparent rounded-r-xl" />
                                    {arabicText}
                                </div>
                            </div>

                            {/* Image Generation Area (Left Side in RTL) */}
                            <div className="w-full md:w-2/3 relative flex items-center justify-center bg-black/60 overflow-hidden">
                                {isPending || !data ? (
                                    <div className="flex flex-col items-center justify-center space-y-6 z-10">
                                        <div className="relative">
                                            <div className="w-24 h-24 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                                            <div className="absolute inset-0 flex items-center justify-center text-4xl">
                                                🎨
                                            </div>
                                        </div>
                                        <div className="text-center font-arabic space-y-2">
                                            <h4 className="text-lg text-purple-200 font-bold">Embodying imagination...</h4>
                                            <p className="text-sm text-purple-400/60 animate-pulse">Converting words into colors and dimensions</p>
                                        </div>
                                    </div>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 1.05 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="relative w-full h-full"
                                    >
                                        {/* Fallback mock implementation image */}
                                        <img 
                                            src={data.image_url || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2874&auto=format&fit=crop"} 
                                            alt="Generated Scene"
                                            className="w-full h-full object-cover"
                                        />
                                        
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-20">
                                            <p className="text-white/80 font-mono text-xs opacity-50 mb-1">PROMPT:</p>
                                            <p className="text-purple-200 text-sm italic font-mono truncate">
                                                {data.prompt}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Background ambient glow */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-pink-900/10 mix-blend-screen pointer-events-none" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
