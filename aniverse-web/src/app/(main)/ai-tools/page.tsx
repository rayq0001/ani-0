"use client"

import React from 'react'
import { useGetAISettings } from '@/api/hooks/ai.hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/components/ui/core/styling'
import { GlassCard } from '@/components/anyverse/GlassCard'

import { 
    LuBotMessageSquare, 
    LuSparkles, 
    LuSearch, 
    LuLanguages, 
    LuUsers, 
    LuRefreshCw,
    LuBrain,
    LuSettings,
    LuExternalLink,
    LuWand,
    LuZap
} from 'react-icons/lu'
import { useRouter } from '@/lib/navigation'
import { motion } from 'framer-motion'


interface AIToolCard {
    id: string
    title: string
    description: string
    icon: React.ElementType
    color: string
    enabled: boolean
    href?: string
    onClick?: () => void
}

export default function AIToolsPage() {
    const { data: settings } = useGetAISettings()
    const router = useRouter()

    const tools: AIToolCard[] = [
        {
            id: 'concierge',
            title: 'AI Concierge',
            description: 'Chat with your personal AI assistant about anime and manga. Ask questions, get recommendations, and discover new content.',
            icon: LuBotMessageSquare,
            color: 'from-violet-500 to-purple-500',
            enabled: settings?.enableChat ?? false,
            onClick: () => {
                window.dispatchEvent(new CustomEvent('open-ai-tool', { detail: 'concierge' }))
            },
        },
        {
            id: 'recap',
            title: 'AI Recap',
            description: 'Get smart recaps of what you have watched or read. Never forget where you left off in your favorite series.',
            icon: LuRefreshCw,
            color: 'from-blue-500 to-cyan-500',
            enabled: settings?.enableRecap ?? false,
            onClick: () => {
                window.dispatchEvent(new CustomEvent('open-ai-tool', { detail: 'recap' }))
            },
        },
        {
            id: 'lore',
            title: 'AI Lore Tree',
            description: 'Track characters, locations, and organizations across your favorite series. Build your own knowledge base.',
            icon: LuUsers,
            color: 'from-emerald-500 to-teal-500',
            enabled: settings?.enableSearch ?? false,
            onClick: () => {
                window.dispatchEvent(new CustomEvent('open-ai-tool', { detail: 'lore' }))
            },
        },
        {
            id: 'ocr',
            title: 'OCR Translation',
            description: 'Extract and translate text from images. Perfect for translating manga pages or anime screenshots.',
            icon: LuLanguages,
            color: 'from-orange-500 to-amber-500',
            enabled: settings?.enableOcr ?? false,
            onClick: () => {
                window.dispatchEvent(new CustomEvent('open-ai-tool', { detail: 'ocr' }))
            },
        },
        {
            id: 'search',
            title: 'AI Vibe Search',
            description: 'Search for anime by description, mood, or vibe. Describe what you want to watch and let AI find it for you.',
            icon: LuSearch,
            color: 'from-pink-500 to-rose-500',
            enabled: settings?.enableSearch ?? false,
            onClick: () => {
                window.dispatchEvent(new CustomEvent('open-ai-tool', { detail: 'search' }))
            },
        },
    ]

    const activeToolsCount = tools.filter(t => t.enabled).length

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl p-2">
                        <LuBrain className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">AI Tools</h1>
                </div>
                <p className="text-gray-400 max-w-2xl">
                    Enhance your anime and manga experience with AI-powered features. 
                    {activeToolsCount > 0 ? (
                        <span className="text-violet-400"> {activeToolsCount} tools currently active.</span>
                    ) : (
                        <span> Enable tools in settings to get started.</span>
                    )}
                </p>
            </div>

            {/* Settings Link */}
            <Card className="mb-6 p-4 bg-gray-900/50 border-gray-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <LuSettings className="w-5 h-5 text-gray-400" />
                        <div>
                            <h3 className="text-sm font-medium text-white">AI Settings</h3>
                            <p className="text-xs text-gray-500">Configure API keys and enable features</p>
                        </div>
                    </div>
                    <Button 
                        intent="gray-basic" 
                        size="sm"
                        onClick={() => router.push('/settings?tab=ai')}
                    >
                        <LuExternalLink className="w-4 h-4 mr-2" />
                        Open Settings
                    </Button>
                </div>
            </Card>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((tool, index) => {
                    const Icon = tool.icon
                    
                    return (
                        <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card 
                                className={cn(
                                    "p-5 h-full transition-all duration-200",
                                    "bg-gray-900 border-gray-800 hover:border-gray-700",
                                    tool.enabled ? "cursor-pointer hover:bg-gray-800" : "opacity-60"
                                )}
                                onClick={tool.enabled ? tool.onClick : undefined}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl bg-gradient-to-r flex items-center justify-center",
                                        tool.color
                                    )}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    {tool.enabled ? (
                                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded-full">
                                            Disabled
                                        </span>
                                    )}
                                </div>
                                
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {tool.title}
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {tool.description}
                                </p>
                                
                                {!tool.enabled && (
                                    <div className="mt-4 pt-3 border-t border-gray-800">
                                        <p className="text-xs text-amber-500">
                                            Enable in Settings {'>'} AI to use this feature
                                        </p>
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    )
                })}
            </div>

            {/* Quick Tip */}
            <div className="mt-8 p-4 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                    <LuSparkles className="w-5 h-5 text-violet-400 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-medium text-violet-300 mb-1">Quick Tip</h4>
                        <p className="text-sm text-gray-400">
                            You can also access AI tools from the floating button in the bottom-left corner of any page. 
                            Click the brain icon to open the AI Tools Launcher.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
