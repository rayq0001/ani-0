import { useGenerateRecap, useGetAISettings } from "@/api/hooks/ai.hooks"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/components/ui/core/styling"
import { useState } from "react"
import { LuLoader, LuRefreshCw, LuSparkles, LuX } from "react-icons/lu"

interface AIRecapWidgetProps {
    isOpen: boolean
    onClose: () => void
    mediaId: number
    mediaType: "anime" | "manga"
    mangaTitle?: string
    chaptersRead?: number
    currentChapter?: number
}

// Custom AI Icon with gradient - matches Aniverse's glowing effect style
function AIGradientIcon({ className }: { className?: string }) {
    return (
        <div className={cn("relative", className)}>
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-75" />
            <div className="relative bg-gradient-to-tr from-violet-500 via-purple-500 to-pink-500 rounded-full p-1.5">
                <LuSparkles className="w-5 h-5 text-white" />
            </div>
        </div>
    )
}

export function AIRecapWidget({ isOpen, onClose, mediaId, mediaType, mangaTitle, chaptersRead, currentChapter }: AIRecapWidgetProps) {
    const { data: settings } = useGetAISettings()
    const { mutate: getRecap, data: recapResponse, isPending } = useGenerateRecap()
    
    const [error, setError] = useState<string | null>(null)

    const handleGenerateRecap = () => {
        if (!mangaTitle) {
            setError("Manga title is required")
            return
        }
        setError(null)
        getRecap(
            { 
                mediaId, 
                mangaTitle, 
                chaptersRead: chaptersRead || 0, 
                currentChapter: currentChapter || 1 
            },
            {
                onError: (err) => {
                    setError(err?.message || "Failed to generate recap")
                },
            }
        )
    }

    if (!isOpen) return null

    if (!settings?.enableRecap) {
        return (
            <Card className="fixed bottom-4 right-4 w-96 h-[500px] flex flex-col z-50 bg-gray-900 border-gray-800 shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <AIGradientIcon className="text-xl" />
                        <span className="font-semibold">AI Recap</span>
                    </div>
                    <Button size="sm" intent="gray-basic" onClick={onClose}>
                        <LuX className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex-1 flex items-center justify-center p-4 text-center text-gray-400">
                    <div>
                        <AIGradientIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>AI Recap is disabled.</p>
                        <p className="text-sm mt-1">Enable it in Settings {'>'} AI</p>
                    </div>
                </div>
            </Card>
        )
    }

    if (!settings?.geminiApiKey) {
        return (
            <Card className="fixed bottom-4 right-4 w-96 h-[500px] flex flex-col z-50 bg-gray-900 border-gray-800 shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <AIGradientIcon className="text-xl" />
                        <span className="font-semibold">AI Recap</span>
                    </div>
                    <Button size="sm" intent="gray-basic" onClick={onClose}>
                        <LuX className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex-1 flex items-center justify-center p-4 text-center text-gray-400">
                    <div>
                        <AIGradientIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Please configure your Gemini API key.</p>
                        <p className="text-sm mt-1">Go to Settings {'>'} AI to set it up</p>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <Card className="fixed bottom-4 right-4 w-96 h-[500px] flex flex-col z-50 bg-gray-900 border-gray-800 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <AIGradientIcon className="text-xl" />
                    <span className="font-semibold">AI Recap</span>
                </div>
                <Button size="sm" intent="gray-basic" onClick={onClose}>
                    <LuX className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {!recapResponse?.recap && !isPending && (
                    <div className="text-center text-gray-500 py-8">
                        <AIGradientIcon className="w-12 h-12 mx-auto mb-2" />
                        <p>Get a quick recap of what you've {mediaType === 'anime' ? 'watched' : 'read'}!</p>
                        <Button 
                            intent="primary" 
                            className="mt-4"
                            onClick={handleGenerateRecap}
                        >
                            <LuSparkles className="w-4 h-4 mr-2" />
                            Generate Recap
                        </Button>
                    </div>
                )}
                
                {isPending && (
                    <div className="text-center text-gray-400 py-8">
                        <LuLoader className="w-8 h-8 mx-auto mb-2 animate-spin" />
                        <p>Generating recap...</p>
                    </div>
                )}
                
                {recapResponse?.recap && (
                    <div className="prose prose-invert prose-sm max-w-none">
                        <p className="text-gray-200 whitespace-pre-wrap">{recapResponse.recap}</p>
                    </div>
                )}
                
                {error && (
                    <div className="text-center text-red-400 text-sm py-2">
                        {error}
                    </div>
                )}
            </div>

            {recapResponse?.recap && (
                <div className="p-4 border-t border-gray-800">
                    <Button 
                        intent="gray-basic" 
                        className="w-full"
                        onClick={handleGenerateRecap}
                        disabled={isPending}
                    >
                        <LuRefreshCw className={cn("w-4 h-4 mr-2", isPending && "animate-spin")} />
                        Regenerate
                    </Button>
                </div>
            )}
        </Card>
    )
}

