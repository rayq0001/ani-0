"use client"

import { TextInput } from "@/components/ui/text-input"
import { cn } from "@/components/ui/core/styling"
import { BiSearch, BiFilter, BiX } from "react-icons/bi"
import { LuBookOpenCheck } from "react-icons/lu"
import React from "react"
import { motion, AnimatePresence } from "motion/react"

interface ComicsFiltersProps {
    searchQuery: string
    onSearchChange: (value: string) => void
    unreadOnly: boolean
    onToggleUnread: () => void
    genres: string[]
    selectedGenres: string[]
    onToggleGenre: (genre: string) => void
}

export function ComicsFilters({
    searchQuery,
    onSearchChange,
    unreadOnly,
    onToggleUnread,
    genres,
    selectedGenres,
    onToggleGenre,
}: ComicsFiltersProps) {
    const [showFilters, setShowFilters] = React.useState(false)

    return (
        <div className="space-y-3">
            {/* Search Bar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <TextInput
                        type="text"
                        placeholder="Search comics..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
                        className={cn(
                            "pl-10 pr-10 bg-white/[0.03] border-white/[0.06]",
                            "focus:border-white/20 focus:ring-0",
                            "placeholder:text-white/30"
                        )}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                        >
                            <BiX className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Filter Toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200",
                        showFilters
                            ? "bg-white/10 border-white/20 text-white"
                            : "bg-white/[0.03] border-white/[0.06] text-white/60 hover:text-white/80"
                    )}
                >
                    <BiFilter className="w-4 h-4" />
                    <span className="text-sm hidden sm:inline">Filters</span>
                    {selectedGenres.length > 0 && (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 text-white text-xs">
                            {selectedGenres.length}
                        </span>
                    )}
                </button>

                {/* Unread Toggle */}
                <button
                    onClick={onToggleUnread}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200",
                        unreadOnly
                            ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                            : "bg-white/[0.03] border-white/[0.06] text-white/60 hover:text-white/80"
                    )}
                >
                    <LuBookOpenCheck className="w-4 h-4" />
                    <span className="text-sm hidden sm:inline">Unread</span>
                </button>
            </div>

            {/* Genre Filters */}
            <AnimatePresence>
                {showFilters && genres.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="flex flex-wrap gap-2 pt-2">
                            {genres.map((genre) => {
                                const isSelected = selectedGenres.includes(genre)
                                return (
                                    <button
                                        key={genre}
                                        onClick={() => onToggleGenre(genre)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                                            isSelected
                                                ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                                                : "bg-white/[0.03] text-white/60 border border-white/[0.06] hover:border-white/20 hover:text-white/80"
                                        )}
                                    >
                                        {genre}
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
