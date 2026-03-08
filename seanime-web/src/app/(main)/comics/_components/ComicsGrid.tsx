"use client"

import { Manga_Collection } from "@/api/generated/types"
import { ComicsCard } from "./ComicsCard"
import { motion } from "motion/react"
import React from "react"
import { LuffyError } from "@/components/shared/luffy-error"
import { Button } from "@/components/ui/button"
import { SeaLink } from "@/components/shared/sea-link"

interface ComicsGridProps {
    collection: Manga_Collection | null
    hasComics: boolean
    type: string
}

export function ComicsGrid({ collection, hasComics, type }: ComicsGridProps) {
    if (!hasComics) {
        return (
            <LuffyError title={`No ${type} found`}>
                <div className="space-y-4 text-center">
                    <p className="text-white/60">
                        No {type} has been added to your library yet.
                    </p>
                    <SeaLink href="/discover?type=manga">
                        <Button intent="white-outline" rounded>
                            Browse {type}
                        </Button>
                    </SeaLink>
                </div>
            </LuffyError>
        )
    }

    const lists = collection?.lists || []

    return (
        <div className="space-y-12">
            {lists.map((list, listIndex) => {
                if (!list?.entries?.length) return null

                const isCurrent = list.type === "CURRENT"
                const isPaused = list.type === "PAUSED"
                const isPlanning = list.type === "PLANNING"

                const sectionTitles: Record<string, string> = {
                    CURRENT: "Continue Reading",
                    PAUSED: "Paused",
                    PLANNING: "Plan to Read",
                }

                const sectionColors: Record<string, string> = {
                    CURRENT: "from-emerald-500/20 to-emerald-600/5",
                    PAUSED: "from-amber-500/20 to-amber-600/5",
                    PLANNING: "from-blue-500/20 to-blue-600/5",
                }

                return (
                    <motion.section
                        key={list.type}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: listIndex * 0.1 }}
                        className="space-y-4"
                    >
                        {/* Section Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`h-8 w-1 rounded-full bg-gradient-to-b ${sectionColors[list.type || ""] || "from-white/20 to-white/5"}`}
                                />
                                <h2 className="text-lg font-semibold text-white/90">
                                    {sectionTitles[list.type || ""] || list.type}
                                </h2>
                                <span className="text-sm text-white/40">
                                    {list.entries.length}
                                </span>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                            {list.entries.map((entry, index) => (
                                <ComicsCard
                                    key={entry.media?.id || index}
                                    entry={entry}
                                    index={index}
                                />
                            ))}
                        </div>
                    </motion.section>
                )
            })}
        </div>
    )
}
