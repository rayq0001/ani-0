import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAIFanTheoryPredictor, Theory } from "../../api/hooks/anyverse.hooks"

interface GlassTheoryCardsProps {
    novelTitle: string
    currentChapter: number
    storySummary: string // Passed from the Novel reader context
}

export const GlassTheoryCards: React.FC<GlassTheoryCardsProps> = ({ novelTitle, currentChapter, storySummary }) => {
    const { mutate, data: theories, isPending, isError } = useAIFanTheoryPredictor()
    const [selectedTheory, setSelectedTheory] = useState<Theory | null>(null)

    useEffect(() => {
        if (novelTitle && currentChapter) {
            mutate({
                novel_title: novelTitle,
                current_chapter: currentChapter,
                story_summary: storySummary
            })
        }
    }, [novelTitle, currentChapter, storySummary, mutate])

    const getTheoryIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case "logical": return "🧠"
            case "plot_twist": return "🌪️"
            case "dark": return "🌑"
            default: return "🔮"
        }
    }

    const getTheoryColor = (type: string) => {
        switch (type.toLowerCase()) {
            case "logical": return "from-blue-500/20 to-cyan-500/20 border-cyan-500/50"
            case "plot_twist": return "from-purple-500/20 to-fuchsia-500/20 border-fuchsia-500/50"
            case "dark": return "from-red-500/20 to-orange-500/20 border-red-500/50"
            default: return "from-indigo-500/20 to-purple-500/20 border-purple-500/50"
        }
    }

    const getTheoryTitleColor = (type: string) => {
        switch (type.toLowerCase()) {
            case "logical": return "text-cyan-300"
            case "plot_twist": return "text-fuchsia-300"
            case "dark": return "text-red-300"
            default: return "text-purple-300"
        }
    }

    if (isPending) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <div className="relative w-16 h-16">
                    <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute inset-0 border-t-2 border-r-2 border-purple-500 rounded-full"
                    />
                    <motion.div 
                        animate={{ rotate: -360 }} 
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="absolute inset-2 border-b-2 border-l-2 border-pink-500 rounded-full opacity-70"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">🔮</div>
                </div>
                <p className="text-purple-300 font-arabic tracking-wide animate-pulse">
                    Aniverse eye is exploring future paths...
                </p>
            </div>
        )
    }

    if (isError || !theories) {
        return (
            <div className="text-center p-8 text-red-400 font-arabic border border-red-500/30 rounded-xl bg-red-900/10">
                <span className="text-3xl block mb-2">⚠️</span>
                Could not generate theories. Mystery shrouds this chapter.
            </div>
        )
    }

    return (
        <div className="space-y-6" dir="rtl">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold font-arabic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                    Predictions after Chapter {currentChapter}
                </h3>
                <p className="text-sm text-gray-400 mt-2 font-arabic">
                    Select a theory to dive deeper into story possibilities
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {theories.map((theory, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -10, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedTheory(selectedTheory === theory ? null : theory)}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.15, type: "spring", stiffness: 200, damping: 20 }}
                        className={`cursor-pointer rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br ${getTheoryColor(theory.type)} border backdrop-blur-md transition-all shadow-[0_8px_30px_rgba(0,0,0,0.5)]`}
                        style={{
                            boxShadow: selectedTheory === theory ? "0 0 30px rgba(157,78,221,0.5)" : "0 8px 30px rgba(0,0,0,0.5)"
                        }}
                    >
                        {/* Fake Glass Reflection */}
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none transform -skew-y-12" />
                        
                        <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                            <span className="text-5xl drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                {getTheoryIcon(theory.type)}
                            </span>
                            <h4 className={`text-xl font-bold font-arabic ${getTheoryTitleColor(theory.type)}`}>
                                {theory.title}
                            </h4>
                            <p className="text-xs uppercase tracking-widest text-gray-500 font-mono font-bold">
                                {theory.type}
                            </p>
                        </div>

                        {/* Expandable Content inside card */}
                        <AnimatePresence>
                            {selectedTheory === theory && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden mt-4 pt-4 border-t border-white/10"
                                >
                                    <p className="text-sm text-gray-200 leading-relaxed font-arabic text-justify drop-shadow-md">
                                        {theory.content}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
