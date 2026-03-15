import { useOCRPage, useTranslateText, useUpscaleImage, useGetAISettings } from "@/api/hooks/ai.hooks"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/components/ui/core/styling"
import { useState, useRef } from "react"
import { LuLoader, LuSparkles, LuLanguages, LuMaximize2, LuImagePlus, LuX } from "react-icons/lu"

interface AIOcrWidgetProps {
    isOpen: boolean
    onClose: () => void
}

// Custom AI Icon with gradient - matches Aniverse's glowing effect style
function AIGradientIcon({ className }: { className?: string }) {
    return (
        <div className={cn("relative", className)}>
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-75" />
            <div className="relative bg-gradient-to-tr from-violet-500 via-purple-500 to-pink-500 rounded-full p-1.5">
                <LuLanguages className="w-5 h-5 text-white" />
            </div>
        </div>
    )
}

export function AIOcrWidget({ isOpen, onClose }: AIOcrWidgetProps) {
    const { data: settings } = useGetAISettings()
    const { mutate: ocrPage, data: ocrResult, isPending: isOcrPending } = useOCRPage()
    const { mutate: upscaleImage, data: upscaleResult, isPending: isUpscalePending } = useUpscaleImage()
    
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            const base64 = reader.result as string
            const base64Data = base64.split(',')[1]
            setImageUrl(base64)
            
            // Run OCR
            ocrPage(
                { 
                    imageBase64: base64Data, 
                    mimeType: file.type 
                },
                {
                    onError: (err) => {
                        setError(err?.message || "Failed to process image")
                    },
                }
            )
        }
        reader.readAsDataURL(file)
    }

    const handleUpscale = () => {
        if (!imageUrl) return
        const base64Data = imageUrl.split(',')[1]
        upscaleImage(
            { imageBase64: base64Data, scale: 2 },
            {
                onError: (err) => {
                    setError(err?.message || "Failed to upscale image")
                },
            }
        )
    }

    if (!isOpen) return null

    if (!settings?.enableOcr) {
        return (
            <Card className="fixed bottom-4 right-4 w-96 h-[500px] flex flex-col z-50 bg-gray-900 border-gray-800 shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <AIGradientIcon className="text-xl" />
                        <span className="font-semibold">OCR Translation</span>
                    </div>
                    <Button size="sm" intent="gray-basic" onClick={onClose}>
                        <LuX className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex-1 flex items-center justify-center p-4 text-center text-gray-400">
                    <div>
                        <AIGradientIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>OCR Translation is disabled</p>
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
                        <span className="font-semibold">OCR Translation</span>
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
                    <span className="font-semibold">OCR Translation</span>
                </div>
                <Button size="sm" intent="gray-basic" onClick={onClose}>
                    <LuX className="w-4 h-4" />
                </Button>
            </div>

            <div className="p-4 border-b border-gray-800">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                />
                <Button 
                    intent="primary-outline" 
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isOcrPending}
                >
                    <LuImagePlus className="w-4 h-4 mr-2" />
                    Select Image
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {!imageUrl && !isOcrPending && (
                    <div className="text-center text-gray-500 py-8">
                        <AIGradientIcon className="w-12 h-12 mx-auto mb-2" />
                        <p>Upload an image to translate text!</p>
                    </div>
                )}
                
                {isOcrPending && (
                    <div className="text-center text-gray-400 py-8">
                        <LuLoader className="w-8 h-8 mx-auto mb-2 animate-spin" />
                        <p>Processing image...</p>
                    </div>
                )}
                
                {imageUrl && (
                    <div className="space-y-4">
                        <img 
                            src={imageUrl} 
                            alt="Uploaded" 
                            className="w-full rounded-lg"
                        />
                        
                        {ocrResult && (
                            <div className="space-y-2">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-400">Original:</h4>
                                    <p className="text-gray-200 whitespace-pre-wrap">{ocrResult.originalText}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-400">Translated:</h4>
                                    <p className="text-white whitespace-pre-wrap">{ocrResult.translatedText}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {error && (
                    <div className="text-center text-red-400 text-sm py-2">
                        {error}
                    </div>
                )}
            </div>

            {imageUrl && (
                <div className="p-4 border-t border-gray-800">
                    <Button 
                        intent="primary-outline" 
                        className="w-full"
                        onClick={handleUpscale}
                        disabled={isUpscalePending}
                    >
                        <LuMaximize2 className={cn("w-4 h-4 mr-2", isUpscalePending && "animate-spin")} />
                        Upscale Image
                    </Button>
                </div>
            )}
        </Card>
    )
}

