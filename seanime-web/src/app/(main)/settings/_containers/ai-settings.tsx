import { AISettings, useGetAISettings, useUpdateAISettings } from "@/api/hooks/ai.hooks"
import { SettingsCard, SettingsPageHeader } from "../_components/settings-card"
import { SettingsSubmitButton } from "../_components/settings-submit-button"
import { Field, Form } from "@/components/ui/form"
import { useServerStatus } from "@/app/(main)/_hooks/use-server-status"
import { toast } from "sonner"
import React, { useEffect } from "react"
import { LuSparkles } from "react-icons/lu"
import { cn } from "@/components/ui/core/styling"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const aiSettingsSchema = z.object({
    geminiApiKey: z.string(),
    openaiApiKey: z.string(),
    replicateApiToken: z.string(),
    elevenlabsApiKey: z.string(),
    pineconeApiKey: z.string(),
    targetLanguage: z.string(),
    defaultTranslator: z.string(),
    enableOcr: z.boolean(),
    enableChat: z.boolean(),
    enableRecap: z.boolean(),
    enableSearch: z.boolean(),
    enableUpscaling: z.boolean(),
    enableImageGeneration: z.boolean(),
    enableVideoGeneration: z.boolean(),
    enableMusicGeneration: z.boolean(),
    enableTts: z.boolean(),
    enableEmotion: z.boolean(),
    enableCulture: z.boolean(),
})

interface AISettingsContainerProps {
    className?: string
}

export const AISettingsContainer: React.FC<AISettingsContainerProps> = (props) => {

    const { className } = props

    const status = useServerStatus()
    const { data: aiSettings, isLoading, refetch } = useGetAISettings()
    const { mutate, isPending, isSuccess, isError, error } = useUpdateAISettings()

    // Handle mutation success/error with useEffect
    useEffect(() => {
        if (isSuccess) {
            toast.success("AI settings saved successfully")
            refetch() // Refresh data after save
        }
        if (isError && error) {
            toast.error(error?.message || "Failed to save AI settings")
        }
    }, [isSuccess, isError, error, refetch])

    const handleSubmit = React.useCallback((data: Partial<AISettings>, event?: React.BaseSyntheticEvent) => {
        console.log("Submitting AI settings:", data)
        // Prevent default form submission
        event?.preventDefault()
        
        mutate(data as AISettings, {
            onSuccess: () => {
                toast.success("AI settings saved successfully")
                refetch()
            },
            onError: (error) => {
                toast.error(error?.message || "Failed to save AI settings")
            }
        })
    }, [mutate, refetch])

    if (isLoading) {
        return (
            <div className={cn("space-y-4 animate-pulse", className)}>
                <div className="h-8 bg-gray-800 rounded w-1/3"></div>
                <div className="h-32 bg-gray-800 rounded"></div>
            </div>
        )
    }

    // Prevent form submission - handle everything via button click
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        e.stopPropagation()
        return false
    }

    return (
        <form 
            className={cn("space-y-6", className)} 
            onSubmit={handleFormSubmit}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault()
                    e.stopPropagation()
                }
            }}
        >
            <SettingsPageHeader
                title="AI Features"
                description="Configure AI-powered features for your manga and anime experience"
                icon={LuSparkles}
            />

            {/* Status Badge */}
            <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-lg">AI Service Status</h3>
                            <p className="text-sm text-gray-400">
                                {aiSettings?.geminiApiKey ? "✅ Gemini API Key configured" : "⚠️ Gemini API Key required for AI features"}
                            </p>
                        </div>
                        <Badge className={aiSettings?.geminiApiKey ? "bg-green-500" : "bg-red-500"}>
                            {aiSettings?.geminiApiKey ? "Active" : "Not Configured"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                {/* API Configuration Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span className="text-xl">🔑</span>
                            API Configuration
                        </CardTitle>
                        <CardDescription>
                            Configure your AI service API keys. Gemini is required for core features.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Gemini API Key</label>
                            <input
                                type="password"
                                id="geminiApiKey"
                                defaultValue={aiSettings?.geminiApiKey || ""}
                                placeholder="AIzaSy..."
                                className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/20"
                            />
                            <p className="text-xs text-white/50">Required. Get from Google AI Studio</p>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">OpenAI API Key (Optional)</label>
                                <input
                                    type="password"
                                    id="openaiApiKey"
                                    defaultValue={aiSettings?.openaiApiKey || ""}
                                    placeholder="sk-..."
                                    className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Replicate Token (Optional)</label>
                                <input
                                    type="password"
                                    id="replicateApiToken"
                                    defaultValue={aiSettings?.replicateApiToken || ""}
                                    placeholder="r8_..."
                                    className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">ElevenLabs API Key (Optional)</label>
                                <input
                                    type="password"
                                    id="elevenlabsApiKey"
                                    defaultValue={aiSettings?.elevenlabsApiKey || ""}
                                    placeholder="..."
                                    className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pinecone API Key (Optional)</label>
                                <input
                                    type="password"
                                    id="pineconeApiKey"
                                    defaultValue={aiSettings?.pineconeApiKey || ""}
                                    placeholder="..."
                                    className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/20"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Translation Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span className="text-xl">🌐</span>
                            Translation Settings
                        </CardTitle>
                        <CardDescription>
                            Configure language and translation preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Target Language</label>
                            <input
                                type="text"
                                id="targetLanguage"
                                defaultValue={aiSettings?.targetLanguage || "Arabic"}
                                placeholder="Arabic"
                                className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Default Translator</label>
                            <input
                                type="text"
                                id="defaultTranslator"
                                defaultValue={aiSettings?.defaultTranslator || "gemini"}
                                placeholder="gemini"
                                className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/20"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Feature Toggles */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span className="text-xl">✨</span>
                            Feature Toggles
                        </CardTitle>
                        <CardDescription>
                            Enable or disable specific AI features
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                { id: "enableOcr", label: "OCR Translation", help: "Extract text from manga pages", default: true },
                                { id: "enableChat", label: "AI Concierge", help: "Chat with AI assistant", default: true },
                                { id: "enableRecap", label: "Smart Recaps", help: "Generate summaries", default: true },
                                { id: "enableSearch", label: "Vibe Search", help: "Natural language search", default: true },
                                { id: "enableUpscaling", label: "Image Upscaling", help: "Enhance image quality", default: false },
                                { id: "enableImageGeneration", label: "AI Images", help: "Generate images", default: true },
                                { id: "enableVideoGeneration", label: "AI Videos", help: "Generate animations", default: true },
                                { id: "enableMusicGeneration", label: "Dynamic OST", help: "Mood-based music", default: true },
                                { id: "enableTts", label: "Voice Dubbing", help: "Text-to-speech", default: true },
                                { id: "enableEmotion", label: "Emotion Detection", help: "Camera-based emotions", default: false },
                                { id: "enableCulture", label: "Cultural Translation", help: "Arabic dialects", default: true },
                            ].map((feature) => (
                                <div key={feature.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div>
                                        <p className="text-sm font-medium text-white">{feature.label}</p>
                                        <p className="text-xs text-white/50">{feature.help}</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        id={feature.id}
                                        defaultChecked={Boolean(aiSettings?.[feature.id as keyof AISettings] ?? feature.default)}
                                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <Button 
                        type="button"
                        size="lg"
                        disabled={isPending}
                        className="min-w-[200px]"
                        onClick={() => {
                            const formData: Partial<AISettings> = {
                                geminiApiKey: (document.getElementById("geminiApiKey") as HTMLInputElement)?.value || "",
                                openaiApiKey: (document.getElementById("openaiApiKey") as HTMLInputElement)?.value || "",
                                replicateApiToken: (document.getElementById("replicateApiToken") as HTMLInputElement)?.value || "",
                                elevenlabsApiKey: (document.getElementById("elevenlabsApiKey") as HTMLInputElement)?.value || "",
                                pineconeApiKey: (document.getElementById("pineconeApiKey") as HTMLInputElement)?.value || "",
                                targetLanguage: (document.getElementById("targetLanguage") as HTMLInputElement)?.value || "Arabic",
                                defaultTranslator: (document.getElementById("defaultTranslator") as HTMLInputElement)?.value || "gemini",
                                enableOcr: (document.getElementById("enableOcr") as HTMLInputElement)?.checked ?? true,
                                enableChat: (document.getElementById("enableChat") as HTMLInputElement)?.checked ?? true,
                                enableRecap: (document.getElementById("enableRecap") as HTMLInputElement)?.checked ?? true,
                                enableSearch: (document.getElementById("enableSearch") as HTMLInputElement)?.checked ?? true,
                                enableUpscaling: (document.getElementById("enableUpscaling") as HTMLInputElement)?.checked ?? false,
                                enableImageGeneration: (document.getElementById("enableImageGeneration") as HTMLInputElement)?.checked ?? true,
                                enableVideoGeneration: (document.getElementById("enableVideoGeneration") as HTMLInputElement)?.checked ?? true,
                                enableMusicGeneration: (document.getElementById("enableMusicGeneration") as HTMLInputElement)?.checked ?? true,
                                enableTts: (document.getElementById("enableTts") as HTMLInputElement)?.checked ?? true,
                                enableEmotion: (document.getElementById("enableEmotion") as HTMLInputElement)?.checked ?? false,
                                enableCulture: (document.getElementById("enableCulture") as HTMLInputElement)?.checked ?? true,
                            }
                            console.log("Form data collected:", formData)
                            mutate(formData as AISettings, {
                                onSuccess: () => {
                                    toast.success("AI settings saved successfully")
                                    refetch()
                                },
                                onError: (error) => {
                                    toast.error(error?.message || "Failed to save AI settings")
                                }
                            })
                        }}
                    >
                        {isPending ? "Saving..." : "Save AI Settings"}
                    </Button>
                </div>
            </div>
        </form>
    )
}

