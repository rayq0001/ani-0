"use client"

import { ComicsType } from "@/app/(main)/comics/_lib/useComics"
import { cn } from "@/components/ui/core/styling"
import { motion } from "motion/react"
import React from "react"

interface ComicsTabsProps {
    currentType: ComicsType
    onTypeChange: (type: ComicsType) => void
}

const tabs: { type: ComicsType; label: string; flag: string; color: string; gradient: string }[] = [
    {
        type: "manga",
        label: "Manga",
        flag: "🇯🇵",
        color: "#8B5CF6",
        gradient: "from-violet-500/20 to-violet-600/5",
    },
    {
        type: "manhwa",
        label: "Manhwa",
        flag: "🇰🇷",
        color: "#06B6D4",
        gradient: "from-cyan-500/20 to-cyan-600/5",
    },
    {
        type: "manhua",
        label: "Manhua",
        flag: "🇨🇳",
        color: "#F97316",
        gradient: "from-orange-500/20 to-orange-600/5",
    },
]

export function ComicsTabs({ currentType, onTypeChange }: ComicsTabsProps) {
    return (
        <div className="flex items-center gap-1 p-1 bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.06]">
            {tabs.map((tab) => {
                const isActive = currentType === tab.type
                return (
                    <button
                        key={tab.type}
                        onClick={() => onTypeChange(tab.type)}
                        className={cn(
                            "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                            isActive ? "text-white" : "text-white/50 hover:text-white/80"
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeTab"
                                className={cn(
                                    "absolute inset-0 rounded-lg bg-gradient-to-b",
                                    tab.gradient
                                )}
                                style={{
                                    boxShadow: `inset 0 1px 0 0 ${tab.color}40, 0 0 20px ${tab.color}20`,
                                }}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 text-base">{tab.flag}</span>
                        <span className="relative z-10">{tab.label}</span>
                    </button>
                )
            })}
        </div>
    )
}
