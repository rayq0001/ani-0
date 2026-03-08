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
                setSummary(data?.summary || data?.arabicSummary || "تم إنشاء التلخيص بنجاح")
                setIsOpen(true)
                toast.success("تم إنشاء التلخيص الذكي!")
            },
            onError: (error) => {
                toast.error("فشل في إنشاء التلخيص: " + error.message)
            },
        })
    }

    const buttonContent = (
        <>
            <LuSparkles className="text-lg" />
            <span className="hidden sm:inline">تلخيص ذكي</span>
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
                    {/* Glowing effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full blur-md opacity-75 group-hover:opacity-100 animate-pulse" />
                    
                    {/* Button */}
                    <div className="relative bg-[--paper] border border-purple-500/50 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <LuWand className="text-purple-400 text-lg" />
                        </motion.div>
                        <span className="text-sm font-medium bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                            تلخيص ذكي
                        </span>
                    </div>
                </motion.div>

                <Modal
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    title={`✨ تلخيص ذكي: ${title}`}
                    contentClass="max-w-2xl"
                >
                    <div className="space-y-4">
                        {isPending ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
                                <span className="mr-3 text-[--muted]">جاري إنشاء التلخيص...</span>
                            </div>
                        ) : summary ? (
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-xl p-6 border border-purple-500/20">
                                    <p className="text-lg leading-relaxed text-gray-100">{summary}</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[--muted]">
                                    <LuBookOpen />
                                    <span>تم إنشاء هذا التلخيص باستخدام الذكاء الاصطناعي بناءً على قصة {type === "anime" ? "الأنمي" : "المانجا"}</span>
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
                    <IconButton
                        icon={<LuSparkles className="text-lg" />}
                        intent="gray-basic"
                        size="sm"
                        onClick={handleGenerate}
                        loading={isPending}
                        className={cn("hover:text-purple-400", className)}
                    />
                }>
                    تلخيص ذكي
                </Tooltip>

                <Modal
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    title={`✨ تلخيص ذكي: ${title}`}
                    contentClass="max-w-2xl"
                >
                    <div className="space-y-4">
                        {isPending ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
                                <span className="mr-3 text-[--muted]">جاري إنشاء التلخيص...</span>
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
            <Button
                leftIcon={<LuSparkles />}
                intent="gray-outline"
                size="sm"
                onClick={handleGenerate}
                loading={isPending}
                className={cn("hover:border-purple-500/50 hover:text-purple-400", className)}
            >
                تلخيص ذكي
            </Button>

            <Modal
                open={isOpen}
                onOpenChange={setIsOpen}
                title={`✨ تلخيص ذكي: ${title}`}
                contentClass="max-w-2xl"
            >
                <div className="space-y-4">
                    {isPending ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
                            <span className="mr-3 text-[--muted]">جاري إنشاء التلخيص...</span>
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
            mangaTitle: `${mediaTitle} - ${type === "anime" ? "الحلقة" : "الفصل"} ${episodeNumber}${episodeTitle ? `: ${episodeTitle}` : ""}`,
            chaptersRead: [episodeNumber],
            lastChapter: episodeNumber,
            lastReadAt: new Date().toISOString(),
            language: "ar",
            includeSpoilers: false,
        }, {
            onSuccess: (data) => {
                setSummary(data?.summary || data?.arabicSummary || "تم إنشاء التلخيص بنجاح")
                setIsOpen(true)
                toast.success("تم إنشاء التلخيص الذكي!")
            },
            onError: (error) => {
                toast.error("فشل في إنشاء التلخيص: " + error.message)
            },
        })
    }

    return (
        <>
            <Tooltip trigger={
                <IconButton
                    icon={<LuSparkles className="text-lg text-purple-400" />}
                    intent="gray-basic"
                    size="sm"
                    onClick={handleGenerate}
                    loading={isPending}
                    className="hover:bg-purple-500/20"
                />
            }>
                تلخيص ذكي لل{type === "anime" ? "حلقة" : "فصل"}
            </Tooltip>

            <Modal
                open={isOpen}
                onOpenChange={setIsOpen}
                title={`✨ تلخيص ذكي: ${mediaTitle} - ${type === "anime" ? "الحلقة" : "الفصل"} ${episodeNumber}`}
                contentClass="max-w-2xl"
            >
                <div className="space-y-4">
                    {isPending ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
                            <span className="mr-3 text-[--muted]">جاري إنشاء التلخيص...</span>
                        </div>
                    ) : summary ? (
                        <div className="space-y-4">
                            <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-xl p-6 border border-purple-500/20">
                                <p className="text-lg leading-relaxed text-gray-100">{summary}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[--muted]">
                                <LuBookOpen />
                                <span>تم إنشاء هذا التلخيص بدون حرق للأحداث</span>
                            </div>
                        </div>
                    ) : null}
                </div>
            </Modal>
        </>
    )
}
