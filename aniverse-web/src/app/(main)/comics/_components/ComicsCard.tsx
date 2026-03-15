"use client"

import { Manga_CollectionEntry } from "@/api/generated/types"
import { SeaImage } from "@/components/shared/sea-image"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/components/ui/core/styling"
import { getImageUrl } from "@/lib/server/assets"
import { useRouter } from "@/lib/navigation"
import { motion } from "motion/react"
import React from "react"
import { BiBookOpen, BiDotsVerticalRounded } from "react-icons/bi"
import { LuBookOpenCheck } from "react-icons/lu"

interface ComicsCardProps {
    entry: Manga_CollectionEntry
    index?: number
}

export function ComicsCard({ entry, index = 0 }: ComicsCardProps) {
    const router = useRouter()
    const media = entry.media
    const listData = entry.listData

    if (!media) return null

    const progress = listData?.progress || 0
    const totalChapters = media.chapters || 0
    const progressPercent = totalChapters > 0 ? (progress / totalChapters) * 100 : 0

    const status = listData?.status
    const statusColors: Record<string, string> = {
        CURRENT: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        PAUSED: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        PLANNING: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        COMPLETED: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        DROPPED: "bg-red-500/20 text-red-400 border-red-500/30",
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group relative"
        >
            <div
                onClick={() => router.push(`/manga/entry?id=${media.id}`)}
                className={cn(
                    "relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer",
                    "bg-white/[0.03] border border-white/[0.06]",
                    "transition-all duration-300",
                    "hover:border-white/[0.15] hover:shadow-2xl hover:shadow-black/50",
                    "hover:-translate-y-1"
                )}
            >
                {/* Cover Image */}
                <SeaImage
                    src={getImageUrl(media.coverImage?.large || media.coverImage?.medium || "")}
                    alt={media.title?.userPreferred || ""}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Status Badge */}
                {status && (
                    <div className="absolute top-2 left-2">
                        <Badge
                            className={cn(
                                "text-[10px] font-semibold uppercase tracking-wider border",
                                statusColors[status] || "bg-white/10 text-white/70 border-white/20"
                            )}
                        >
                            {status === "CURRENT" ? "Reading" : status.toLowerCase()}
                        </Badge>
                    </div>
                )}

                {/* Progress Bar */}
                {progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                            style={{ width: `${Math.min(progressPercent, 100)}%` }}
                        />
                    </div>
                )}

                {/* Hover Actions */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/manga/entry?id=${media.id}`)
                            }}
                            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
                        >
                            <BiBookOpen className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Progress Indicator */}
                {progress > 0 && progressPercent < 100 && (
                    <div className="absolute top-2 right-2">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-500/90 text-white text-xs font-medium">
                            <LuBookOpenCheck className="w-3 h-3" />
                            {Math.round(progressPercent)}%
                        </div>
                    </div>
                )}
            </div>

            {/* Title & Info */}
            <div className="mt-3 space-y-1">
                <h3 className="text-sm font-medium text-white/90 line-clamp-2 group-hover:text-white transition-colors">
                    {media.title?.userPreferred}
                </h3>
                <div className="flex items-center gap-2 text-xs text-white/50">
                    <span>{media.format || "Manga"}</span>
                    {progress > 0 && (
                        <>
                            <span>•</span>
                            <span>Ch. {progress}</span>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
