import { useGenerateSmartSummary } from "@/api/hooks/anyverse.hooks"
import { Button, IconButton } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Tooltip } from "@/components/ui/tooltip"
import { cn } from "@/components/ui/core/styling"
import React from "react"
import { LuSparkles, LuWand, LuBookOpen } from "react-icons/lu"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface SmartSummaryButtonProps {
    mediaId: number
    title: string
    chaptersRead?: number[]
    lastChapter?: number
    lastReadAt?: string
    type: "anime" | "manga" | "manhwa" | "manhua"
    variant?: "button" | "icon" | "glowing"
    className?: string
    position?: "inline" | "bottom-right" | "meta-section"
}

export function SmartSummaryButton({
    mediaId,
    title,
    chaptersRead = [],
    lastChapter = 0,
    lastReadAt,
    type,
    variant = "button",
    className,
    position = "inline",
}: SmartSummaryButtonProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [summary, setSummary] = React.useState<string | null>(null)
    
    const { mutate: generateSummary, isPending } = useGenerateSmartSummary()

    const handleGenerate = () => {
        generateSummary({
            mediaId,
            mangaTitle: title,
            chaptersRead,
            lastChapter,
            lastReadAt: lastReadAt || new Date().toISOString(),
            language: "ar",
            includeSpoilers: false,
        }, {
            onSuccess: (data) => {
                // Handle both camelCase and PascalCase response formats
                const summaryText = data?.summary || data?.arabicSummary || data?.Summary || data?.ArabicSummary || "Summary generated successfully"
                setSummary(summaryText)
                setIsOpen(true)
                toast.success("Smart summary generated!")
            },
            onError: (error) => {
                toast.error("Failed to generate summary: " + (error?.message || "Unknown error"))
            },
        })
    }

    const buttonContent = (
        <>
            <LuSparkles className="text-lg" />
            <span className="hidden sm:inline">Smart Summary</span>
        </>
    )

    if (variant === "glowing") {
        return (
            <>
                <motion.div
                    className={cn(
                        "relative group cursor-pointer",
                        position === "meta-section" && "absolute top-2 right-2",
                        className
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGenerate}
                >
                    {/* Button - Glassmorphism with purple glow */}
                    <div className="relative bg-white/10 backdrop-blur-md border border-purple-500/30 rounded-full px-4 py-2 flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:bg-white/15 hover:border-purple-500/50 transition-all duration-300">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <LuWand className="text-purple-400 text-lg drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                        </motion.div>
                        <span className="text-sm font-medium text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
                            Smart Summary
                        </span>
                    </div>
                </motion.div>

                <Modal
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    title={`✨ Smart Summary: ${title}`}
                    contentClass="max-w-2xl"
                >
                    <div className="space-y-4">
                        {isPending ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
                                <span className="mr-3 text-[--muted]">Generating summary...</span>
                            </div>
                        ) : summary ? (
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-xl p-6 border border-purple-500/20">
                                    <p className="text-lg leading-relaxed text-gray-100">{summary}</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[--muted]">
                                    <LuBookOpen />
                                    <span>This summary was generated using AI based on the {type === "anime" ? "Anime" : "Manga"} story</span>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </Modal>
            </>
        )
    }

    if (variant === "icon") {
        return (
            <>
                <Tooltip trigger={
                    <button
                        onClick={handleGenerate}
                        disabled={isPending}
                        className={cn(
                            "w-9 h-9 rounded-lg bg-white/5 backdrop-blur-md border border-purple-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 disabled:opacity-50",
                            className
                        )}
                    >
                        {isPending ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400" />
                        ) : (
                            <LuSparkles className="text-lg text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                        )}
                    </button>
                }>
                    Smart Summary
                </Tooltip>

                <Modal
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    title={`✨ Smart Summary: ${title}`}
                    contentClass="max-w-2xl"
                >
                    <div className="space-y-4">
                        {isPending ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
                                <span className="mr-3 text-[--muted]">Generating summary...</span>
                            </div>
                        ) : summary ? (
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-xl p-6 border border-purple-500/20">
                                    <p className="text-lg leading-relaxed text-gray-100">{summary}</p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </Modal>
            </>
        )
    }

    return (
        <>
            <button
                onClick={handleGenerate}
                disabled={isPending}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-md border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 disabled:opacity-50",
                    className
                )}
            >
                {isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400" />
                ) : (
                    <LuSparkles className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                )}
                <span className="text-sm font-medium text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">Smart Summary</span>
            </button>

            <Modal
                open={isOpen}
                onOpenChange={setIsOpen}
                title={`✨ Smart Summary: ${title}`}
                contentClass="max-w-2xl"
            >
                <div className="space-y-4">
                    {isPending ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
                            <span className="mr-3 text-[--muted]">Generating summary...</span>
                        </div>
                    ) : summary ? (
                        <div className="space-y-4">
                            <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-xl p-6 border border-purple-500/20">
                                <p className="text-lg leading-relaxed text-gray-100">{summary}</p>
                            </div>
                        </div>
                    ) : null}
                </div>
            </Modal>
        </>
    )
}

// Component for episode/chapter specific summary
interface EpisodeSmartSummaryProps {
    episodeNumber: number
    episodeTitle?: string
    mediaId: number
    mediaTitle: string
    type: "anime" | "manga"
}

export function EpisodeSmartSummary({
    episodeNumber,
    episodeTitle,
    mediaId,
    mediaTitle,
    type,
}: EpisodeSmartSummaryProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [summary, setSummary] = React.useState<string | null>(null)
    
    const { mutate: generateSummary, isPending } = useGenerateSmartSummary()

    const handleGenerate = () => {
        generateSummary({
            mediaId,
            mangaTitle: `${mediaTitle} - ${type === "anime" ? "Episode" : "Chapter"} ${episodeNumber}${episodeTitle ? `: ${episodeTitle}` : ""}`,
            chaptersRead: [episodeNumber],
            lastChapter: episodeNumber,
            lastReadAt: new Date().toISOString(),
            language: "ar",
            includeSpoilers: false,
        }, {
            onSuccess: (data) => {
                // Handle both camelCase and PascalCase response formats
                const summaryText = data?.summary || data?.arabicSummary || data?.Summary || data?.ArabicSummary || "Summary generated successfully"
                setSummary(summaryText)
                setIsOpen(true)
                toast.success("Smart summary generated!")
            },
            onError: (error) => {
                toast.error("Failed to generate summary: " + (error?.message || "Unknown error"))
            },
        })
    }

    return (
        <>
            <Tooltip trigger={
                <button
                    onClick={handleGenerate}
                    disabled={isPending}
                    className="w-9 h-9 rounded-lg bg-white/5 backdrop-blur-md border border-purple-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 disabled:opacity-50"
                >
                    {isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400" />
                    ) : (
                        <LuSparkles className="text-lg text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    )}
                </button>
            }>
                Smart summary for {type === "anime" ? "Episode" : "Chapter"}
            </Tooltip>

            <Modal
                open={isOpen}
                onOpenChange={setIsOpen}
                title={`✨ Smart Summary: ${mediaTitle} - ${type === "anime" ? "Episode" : "Chapter"} ${episodeNumber}`}
                contentClass="max-w-2xl"
            >
                <div className="space-y-4">
                    {isPending ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
                            <span className="mr-3 text-[--muted]">Generating summary...</span>
                        </div>
                    ) : summary ? (
                        <div className="space-y-4">
                            <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-xl p-6 border border-purple-500/20">
                                <p className="text-lg leading-relaxed text-gray-100">{summary}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[--muted]">
                                <LuBookOpen />
                                <span>This summary was generated without spoilers</span>
                            </div>
                        </div>
                    ) : null}
                </div>
            </Modal>
        </>
    )
}
