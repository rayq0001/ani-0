import React, { useState, useRef, useEffect } from "react"
import { useLoreKeeperQuery } from "../../api/hooks/anyverse.hooks"
import { TypewriterText } from "./TypewriterText"
import { motion, AnimatePresence } from "framer-motion"

interface LoreTooltipProps {
    children: React.ReactNode
    query: string
    title: string
    mediaId: number
    currentChapter: number
}

export const LoreTooltip: React.FC<LoreTooltipProps> = ({
    children,
    query,
    title,
    mediaId,
    currentChapter
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [hasQueried, setHasQueried] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    
    const { mutate, data, isPending, reset } = useLoreKeeperQuery()

    // Handle clicking outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                // Rest timeout to allow animation to play out before clearing data
                setTimeout(() => {
                    setHasQueried(false)
                    reset()
                }, 300)
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen, reset])

    const handleQuery = () => {
        if (!isOpen) {
            setIsOpen(true)
        }
        
        if (!hasQueried) {
            setHasQueried(true)
            mutate({
                mediaId,
                currentChapter,
                query,
                title
            })
        }
    }

    return (
        <div className="relative inline-block" ref={containerRef}>
            {/* The highlighted text that triggers the tooltip */}
            <span 
                className="cursor-pointer border-b border-dashed border-purple-400 text-purple-200 hover:text-purple-100 transition-colors"
                onClick={handleQuery}
            >
                {children}
            </span>

            {/* The Tooltip Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 mt-2 w-80 p-4 rounded-xl border border-purple-500/50 right-0 md:left-1/2 md:-translate-x-1/2"
                        style={{
                            /* Glass-morphism + Neon Border exactly as requested */
                            background: "rgba(10, 5, 20, 0.75)",
                            backdropFilter: "blur(15px)",
                            WebkitBackdropFilter: "blur(15px)",
                            boxShadow: "0 0 15px rgba(157, 78, 221, 0.5), inset 0 0 20px rgba(157, 78, 221, 0.1)"
                        }}
                    >
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-purple-500/30">
                            <div className="flex items-center gap-2 text-purple-300 font-semibold text-sm">
                                <span className="text-xl">📚</span>
                                Aniverse Lore-Keeper
                            </div>
                            {data?.cached && (
                                <span className="text-[10px] uppercase tracking-wider text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded-full border border-purple-500/30">
                                    Cached
                                </span>
                            )}
                        </div>

                        <div className="text-gray-100 text-sm leading-relaxed min-h-[60px]" dir="rtl">
                            {isPending ? (
                                <div className="flex items-center justify-center h-full gap-2 text-purple-400 py-4">
                                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            ) : data ? (
                                <TypewriterText 
                                    text={data.answer} 
                                    speed={15} 
                                    className="font-arabic"
                                />
                            ) : null}
                        </div>

                        {data && (
                            <div className="mt-3 text-xs text-purple-400/60 text-center font-mono tracking-wider border-t border-purple-500/20 pt-2">
                                SECURE CHAPTER {currentChapter}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
