import { useAISearch, useGetAISettings } from "@/api/hooks/ai.hooks"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TextInput } from "@/components/ui/text-input"
import { cn } from "@/components/ui/core/styling"
import { useState } from "react"
import React from "react"
import { LuLoader, LuSearch, LuSparkles, LuX } from "react-icons/lu"

interface AISearchWidgetProps {
    isOpen: boolean
    onClose: () => void
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

export function AISearchWidget({ isOpen, onClose }: AISearchWidgetProps) {
    const { data: settings } = useGetAISettings()
    const { mutate: search, data: searchResults, isPending } = useAISearch()
    
    const [query, setQuery] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handleSearch = () => {
        if (!query.trim()) return
        setError(null)
        search(
            { query },
            {
                onError: (err) => {
                    setError(err?.message || "Failed to search")
                },
            }
        )
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    if (!isOpen) return null

    if (!settings?.enableSearch) {
        return (
            <Card className="fixed bottom-4 right-4 w-96 h-[500px] flex flex-col z-50 bg-gray-900 border-gray-800 shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <AIGradientIcon className="text-xl" />
                        <span className="font-semibold">AI Vibe Search</span>
                    </div>
                    <Button size="sm" intent="gray-basic" onClick={onClose}>
                        <LuX className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex-1 flex items-center justify-center p-4 text-center text-gray-400">
                    <div>
                        <AIGradientIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>AI Vibe Search is disabled.</p>
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
                        <span className="font-semibold">AI Vibe Search</span>
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
                    <span className="font-semibold">AI Vibe Search</span>
                </div>
                <Button size="sm" intent="gray-basic" onClick={onClose}>
                    <LuX className="w-4 h-4" />
                </Button>
            </div>

            <div className="p-4 border-b border-gray-800">
                <div className="flex gap-2">
                    <TextInput
                        value={query}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Describe what you want to watch..."
                        className="flex-1"
                    />
                    <Button
                        onClick={handleSearch}
                        disabled={!query.trim() || isPending}
                        intent="primary"
                    >
                        {isPending ? (
                            <LuLoader className="w-4 h-4 animate-spin" />
                        ) : (
                            <LuSearch className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {!searchResults && !isPending && (
                    <div className="text-center text-gray-500 py-8">
                        <AIGradientIcon className="w-12 h-12 mx-auto mb-2" />
                        <p>Search for anime by description, mood, or vibe!</p>
                        <p className="text-sm mt-2 text-gray-400">Example: "Emotional anime about friendship"</p>
                    </div>
                )}
                
                {isPending && (
                    <div className="text-center text-gray-400 py-8">
                        <LuLoader className="w-8 h-8 mx-auto mb-2 animate-spin" />
                        <p>Searching...</p>
                    </div>
                )}
                
                {searchResults?.results && (
                    <div className="prose prose-invert prose-sm max-w-none">
                        <p className="text-gray-200 whitespace-pre-wrap">{searchResults.results}</p>
                    </div>
                )}
                
                {error && (
                    <div className="text-center text-red-400 text-sm py-2">
                        {error}
                    </div>
                )}
            </div>
        </Card>
    )
}

