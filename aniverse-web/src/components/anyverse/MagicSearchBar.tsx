import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSemanticVibeSearch } from "../../api/hooks/anyverse.hooks"

interface MagicSearchBarProps {
    onTagsGenerated: (tags: string[]) => void
}

export const MagicSearchBar: React.FC<MagicSearchBarProps> = ({ onTagsGenerated }) => {
    const { mutate, data: tags, isPending } = useSemanticVibeSearch()
    const [query, setQuery] = useState("")
    const [isFocused, setIsFocused] = useState(false)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            mutate(
                { user_search: query },
                {
                    onSuccess: (newTags) => {
                        if (newTags && newTags.length > 0) {
                            onTagsGenerated(newTags)
                        }
                    }
                }
            )
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto relative group" dir="rtl">
            {/* Ambient Background Glow */}
            <motion.div
                animate={{
                    opacity: isFocused ? 0.8 : 0.3,
                    scale: isFocused ? 1.05 : 1,
                }}
                transition={{ duration: 0.5 }}
                className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 blur-xl opacity-30 group-hover:opacity-60 transition-opacity"
            />

            <form onSubmit={handleSearch} className="relative z-10 w-full">
                <div 
                    className={`relative overflow-hidden flex items-center bg-black/50 backdrop-blur-xl border rounded-2xl transition-all duration-300 ${
                        isFocused ? "border-purple-400 shadow-[0_0_30px_rgba(157,78,221,0.3)]" : "border-white/10"
                    }`}
                >
                    {/* Glowing input progress bar underneath */}
                    {isPending && (
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                        />
                    )}

                    <div className="pl-4 pr-6 flex items-center flex-1">
                        <span className={`text-2xl transition-transform duration-300 ${isFocused ? "scale-110" : ""}`}>
                            {isPending ? "🔮" : "✨"}
                        </span>
                        
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Search for story vibes.. (hero turns on friends, peaceful forest novel)"
                            className="w-full bg-transparent border-none outline-none text-white/90 placeholder-gray-500/70 font-arabic text-lg py-5 px-4 focus:ring-0"
                            lang="ar"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending || !query.trim()}
                        className={`absolute left-2 px-6 py-3 rounded-xl font-bold font-arabic transition-all duration-300 ${
                            query.trim()
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg"
                                : "bg-white/5 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Magic Path
                    </button>
                </div>
            </form>

            {/* Generated Tags Display */}
            <AnimatePresence>
                {tags && tags.length > 0 && !isPending && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                        className="absolute w-full mt-4 p-4 border border-purple-500/30 bg-black/40 backdrop-blur-md rounded-2xl shadow-xl z-20"
                    >
                        <p className="text-sm text-purple-300/70 mb-3 font-arabic font-bold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            Core concepts extracted:
                        </p>
                        <div className="flex flex-wrap gap-2" dir="ltr">
                            {tags.map((tag, idx) => (
                                <motion.span
                                    key={`${tag}-${idx}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-purple-100 bg-purple-500/20 border border-purple-400/50 rounded-lg hover:bg-purple-500/40 hover:scale-105 transition-all cursor-pointer"
                                >
                                    #{tag.replace(/\s+/g, '_')}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
