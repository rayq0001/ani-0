import { useGenerateLoreTree, useGetAISettings, LoreTree, LoreEntry } from "@/api/hooks/ai.hooks"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/components/ui/core/styling"
import { useState } from "react"
import { LuLoader, LuRefreshCw, LuSparkles, LuUsers, LuMapPin, LuBuilding2, LuX } from "react-icons/lu"

interface AILoreWidgetProps {
    isOpen: boolean
    onClose: () => void
    mediaId: number
    title: string
    chapters?: string
}

// Custom AI Icon with gradient - matches Seanime's glowing effect style
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

type LoreCategory = "characters" | "locations" | "organizations"

function LoreEntryCard({ entry }: { entry: LoreEntry }) {
    return (
        <Card className="p-3 bg-gray-800 border-gray-700">
            {entry.imageUrl && (
                <img 
                    src={entry.imageUrl} 
                    alt={entry.name}
                    className="w-full h-32 object-cover rounded-md mb-2"
                />
            )}
            <h4 className="font-semibold text-white">{entry.name}</h4>
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{entry.description}</p>
            {entry.abilities && entry.abilities.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                    {entry.abilities.slice(0, 3).map((ability, i) => (
                        <span key={i} className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                            {ability}
                        </span>
                    ))}
                </div>
            )}
        </Card>
    )
}

export function AILoreWidget({ isOpen, onClose, mediaId, title, chapters }: AILoreWidgetProps) {
    const { data: settings } = useGetAISettings()
    const { mutate: generateLore, data: loreTree, isPending } = useGenerateLoreTree()
    
    const [error, setError] = useState<string | null>(null)
    const [activeCategory, setActiveCategory] = useState<LoreCategory>("characters")

    const handleGenerateLore = () => {
        setError(null)
        generateLore(
            { mediaId, title, chapters: chapters || "" },
            {
                onError: (err) => {
                    setError(err?.message || "Failed to generate lore tree")
                },
            }
        )
    }

    if (!isOpen) return null

    if (!settings?.enableSearch) {
        return (
            <Card className="fixed bottom-4 right-4 w-[600px] h-[500px] flex flex-col z-50 bg-gray-900 border-gray-800 shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <AIGradientIcon className="text-xl" />
                        <span className="font-semibold">AI Lore Tree</span>
                    </div>
                    <Button size="sm" intent="gray-basic" onClick={onClose}>
                        <LuX className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex-1 flex items-center justify-center p-4 text-center text-gray-400">
                    <div>
                        <AIGradientIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>AI Lore Tree is disabled.</p>
                        <p className="text-sm mt-1">Enable it in Settings {'>'} AI</p>
                    </div>
                </div>
            </Card>
        )
    }

    if (!settings?.geminiApiKey) {
        return (
            <Card className="fixed bottom-4 right-4 w-[600px] h-[500px] flex flex-col z-50 bg-gray-900 border-gray-800 shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <AIGradientIcon className="text-xl" />
                        <span className="font-semibold">AI Lore Tree</span>
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

    const currentEntries: LoreEntry[] = loreTree?.[activeCategory] || []

    return (
        <Card className="fixed bottom-4 right-4 w-[600px] h-[500px] flex flex-col z-50 bg-gray-900 border-gray-800 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <AIGradientIcon className="text-xl" />
                    <span className="font-semibold">AI Lore Tree</span>
                    {loreTree?.mangaTitle && (
                        <span className="text-xs text-gray-500 ml-2">
                            • {loreTree.mangaTitle}
                        </span>
                    )}
                </div>
                <Button size="sm" intent="gray-basic" onClick={onClose}>
                    <LuX className="w-4 h-4" />
                </Button>
            </div>

            {!loreTree && !isPending && (
                <div className="flex-1 flex items-center justify-center p-4 text-center text-gray-400">
                    <div>
                        <AIGradientIcon className="w-12 h-12 mx-auto mb-2" />
                        <p>Track characters, locations, and organizations!</p>
                        <Button 
                            intent="primary" 
                            className="mt-4"
                            onClick={handleGenerateLore}
                        >
                            <LuSparkles className="w-4 h-4 mr-2" />
                            Generate Lore Tree
                        </Button>
                    </div>
                </div>
            )}
            
            {isPending && (
                <div className="flex-1 flex items-center justify-center p-4 text-center text-gray-400">
                    <div>
                        <LuLoader className="w-8 h-8 mx-auto mb-2 animate-spin" />
                        <p>Generating lore tree...</p>
                    </div>
                </div>
            )}
            
            {loreTree && (
                <>
                    <div className="flex gap-2 p-4 border-b border-gray-800">
                        <Button
                            size="sm"
                            intent={activeCategory === "characters" ? "primary" : "gray-basic"}
                            onClick={() => setActiveCategory("characters")}
                        >
                            <LuUsers className="w-4 h-4 mr-1" />
                            Characters ({loreTree.characters?.length || 0})
                        </Button>
                        <Button
                            size="sm"
                            intent={activeCategory === "locations" ? "primary" : "gray-basic"}
                            onClick={() => setActiveCategory("locations")}
                        >
                            <LuMapPin className="w-4 h-4 mr-1" />
                            Locations ({loreTree.locations?.length || 0})
                        </Button>
                        <Button
                            size="sm"
                            intent={activeCategory === "organizations" ? "primary" : "gray-basic"}
                            onClick={() => setActiveCategory("organizations")}
                        >
                            <LuBuilding2 className="w-4 h-4 mr-1" />
                            Organizations ({loreTree.organizations?.length || 0})
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {currentEntries.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {currentEntries.map((entry) => (
                                    <LoreEntryCard key={entry.id} entry={entry} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                No {activeCategory} found
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-gray-800">
                        <Button 
                            intent="gray-basic" 
                            className="w-full"
                            onClick={handleGenerateLore}
                            disabled={isPending}
                        >
                            <LuRefreshCw className={cn("w-4 h-4 mr-2", isPending && "animate-spin")} />
                            Regenerate
                        </Button>
                    </div>
                </>
            )}
            
            {error && (
                <div className="p-4 text-center text-red-400 text-sm">
                    {error}
                </div>
            )}
        </Card>
    )
}

