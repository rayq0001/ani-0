import { useAIChat, useGetAISettings, ChatContext, ChatMessage } from "@/api/hooks/ai.hooks"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/components/ui/core/styling"
import { Textarea } from "@/components/ui/textarea"
import { useState, useRef, useEffect } from "react"
import { LuBotMessageSquare, LuLoader, LuSend, LuX } from "react-icons/lu"

interface AIConciergeWidgetProps {
    isOpen: boolean
    onClose: () => void
    context?: ChatContext
}

// Custom AI Icon with gradient - matches Seanime's glowing effect style
function AIGradientIcon({ className }: { className?: string }) {
    return (
        <div className={cn("relative", className)}>
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-75" />
            <div className="relative bg-gradient-to-tr from-violet-500 via-purple-500 to-pink-500 rounded-full p-1.5">
                <LuBotMessageSquare className="w-5 h-5 text-white" />
            </div>
        </div>
    )
}

export function AIConciergeWidget({ isOpen, onClose, context }: AIConciergeWidgetProps) {
    const { data: settings } = useGetAISettings()
    const { mutate: chat, isPending } = useAIChat()
    
    const [message, setMessage] = useState("")
    const [history, setHistory] = useState<ChatMessage[]>([])
    const [error, setError] = useState<string | null>(null)
    
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [history])

    const handleSend = () => {
        if (!message.trim() || isPending) return

        const userMessage: ChatMessage = {
            role: "user",
            content: message,
        }

        setHistory(prev => [...prev, userMessage])
        setMessage("")
        setError(null)

        chat(
            {
                message: message,
                context: context,
                history: history,
            },
            {
                onSuccess: (response) => {
                    if (response?.error) {
                        setError(response.error)
                    } else {
                        setHistory(prev => [
                            ...prev,
                            {
                                role: "assistant",
                                content: response?.message || "Sorry, I couldn't generate a response.",
                            },
                        ])
                    }
                },
                onError: (err) => {
                    setError(err?.message || "Failed to send message")
                },
            }
        )
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    if (!isOpen) return null

    if (!settings?.enableChat) {
        return (
            <Card className="fixed bottom-4 right-4 w-96 h-[500px] flex flex-col z-50 bg-gray-900 border-gray-800 shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <AIGradientIcon className="text-xl" />
                        <span className="font-semibold">AI Concierge</span>
                    </div>
                    <Button size="sm" intent="gray-basic" onClick={onClose}>
                        <LuX className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex-1 flex items-center justify-center p-4 text-center text-gray-400">
                    <div>
                        <AIGradientIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>AI Concierge is disabled.</p>
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
                        <span className="font-semibold">AI Concierge</span>
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
                    <span className="font-semibold">AI Concierge</span>
                    {context?.mangaTitle && (
                        <span className="text-xs text-gray-500 ml-2">
                            • {context.mangaTitle}
                        </span>
                    )}
                </div>
                <Button size="sm" intent="gray-basic" onClick={onClose}>
                    <LuX className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {history.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        <AIGradientIcon className="w-12 h-12 mx-auto mb-2" />
                        <p>Hi! I'm your AI manga assistant.</p>
                        <p className="text-sm mt-1">Ask me anything about your manga!</p>
                    </div>
                )}
                
                {history.map((msg, index) => (
                    <div
                        key={index}
                        className={cn(
                            "flex",
                            msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            className={cn(
                                "max-w-[80%] rounded-lg p-3 text-sm",
                                msg.role === "user"
                                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                                    : "bg-gray-800 text-gray-200"
                            )}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                
                {error && (
                    <div className="text-center text-red-400 text-sm py-2">
                        {error}
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-800">
                <div className="flex gap-2">
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about your manga..."
                        className="min-h-[60px] resize-none bg-gray-800 border-gray-700"
                        disabled={isPending}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!message.trim() || isPending}
                        intent="primary"
                        className="self-end bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
                    >
                        {isPending ? (
                            <LuLoader className="w-4 h-4 animate-spin" />
                        ) : (
                            <LuSend className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </div>
        </Card>
    )
}

// Floating button to open the concierge - with gradient effect
export function AIConciergeButton({ onClick }: { onClick: () => void }) {
    const { data: settings } = useGetAISettings()
    
    if (!settings?.enableChat) return null
    
    return (
        <Button
            onClick={onClick}
            className="fixed bottom-4 right-4 z-40 rounded-full w-14 h-14 shadow-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 hover:from-violet-500 hover:via-purple-500 hover:to-pink-400 transition-all duration-300"
            size="lg"
        >
            <LuBotMessageSquare className="w-6 h-6" />
        </Button>
    )
}

