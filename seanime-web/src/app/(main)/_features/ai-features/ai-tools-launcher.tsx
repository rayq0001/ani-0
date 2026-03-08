"use client"

import React from 'react';
import { useAtom } from 'jotai';
import { anyverseAtom } from '@/app/(main)/_atoms/anyverse.atoms';
import { useGetAISettings } from '@/api/hooks/ai.hooks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/components/ui/core/styling';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LuBotMessageSquare, 
    LuSparkles, 
    LuSearch, 
    LuLanguages, 
    LuUsers, 
    LuRefreshCw,
    LuBrain,
    LuX,
    LuWand
} from 'react-icons/lu';
import { AIConciergeWidget } from './concierge';
import { AIRecapWidget } from './recap';
import { AILoreWidget } from './lore';
import { AIOcrWidget } from './ocr';
import { AISearchWidget } from './search';
import { AnyverseHub } from '@/components/anyverse/AnyverseHub';

type AITool = 'concierge' | 'recap' | 'lore' | 'ocr' | 'search' | null;

interface AIToolButton {
    id: AITool;
    label: string;
    description: string;
    icon: React.ElementType;
    color: string;
    enabled: boolean;
}

export function AIToolsLauncher() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [activeTool, setActiveTool] = React.useState<AITool>(null);
    const { data: settings } = useGetAISettings();
    const [anyverseConfig] = useAtom(anyverseAtom);

    // Listen for custom events from AI Tools page
    React.useEffect(() => {
        const handleOpenTool = (event: CustomEvent) => {
            const toolId = event.detail as AITool;
            if (toolId && ['concierge', 'recap', 'lore', 'ocr', 'search'].includes(toolId)) {
                setActiveTool(toolId);
                setIsOpen(false);
            }
        };

        window.addEventListener('open-ai-tool', handleOpenTool as EventListener);
        
        return () => {
            window.removeEventListener('open-ai-tool', handleOpenTool as EventListener);
        };
    }, []);

    const tools: AIToolButton[] = [
        {
            id: 'concierge',
            label: 'AI Concierge',
            description: 'Chat with AI about your anime/manga',
            icon: LuBotMessageSquare,
            color: 'from-violet-500 to-purple-500',
            enabled: settings?.enableChat ?? false,
        },
        {
            id: 'recap',
            label: 'AI Recap',
            description: 'Get smart recaps of what you watched',
            icon: LuRefreshCw,
            color: 'from-blue-500 to-cyan-500',
            enabled: settings?.enableRecap ?? false,
        },
        {
            id: 'lore',
            label: 'AI Lore Tree',
            description: 'Track characters, locations & organizations',
            icon: LuUsers,
            color: 'from-emerald-500 to-teal-500',
            enabled: settings?.enableSearch ?? false,
        },
        {
            id: 'ocr',
            label: 'OCR Translation',
            description: 'Extract & translate text from images',
            icon: LuLanguages,
            color: 'from-orange-500 to-amber-500',
            enabled: settings?.enableOcr ?? false,
        },
        {
            id: 'search',
            label: 'AI Vibe Search',
            description: 'Search by description, mood, or vibe',
            icon: LuSearch,
            color: 'from-pink-500 to-rose-500',
            enabled: settings?.enableSearch ?? false,
        },
    ];

    const activeToolsCount = tools.filter(t => t.enabled).length;
    const hasAnyverse = anyverseConfig?.dialect !== undefined;

    const handleToolClick = (toolId: AITool) => {
        setActiveTool(toolId);
        setIsOpen(false);
    };

    const closeWidget = () => {
        setActiveTool(null);
    };

    return (
        <>
            {/* Main AI Tools Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full",
                    "bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500",
                    "shadow-[0_0_30px_rgba(139,92,246,0.5)]",
                    "flex items-center justify-center text-white",
                    "hover:scale-110 transition-transform"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                    boxShadow: [
                        '0 0 20px rgba(139,92,246,0.4)',
                        '0 0 40px rgba(139,92,246,0.6)',
                        '0 0 20px rgba(139,92,246,0.4)'
                    ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                {isOpen ? <LuX className="w-6 h-6" /> : <LuBrain className="w-6 h-6" />}
            </motion.button>

            {/* Active Tool Indicator Badge */}
            {activeTool && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="fixed bottom-6 left-24 z-50"
                >
                    <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                        <LuSparkles className="w-4 h-4" />
                        {tools.find(t => t.id === activeTool)?.label}
                        <button 
                            onClick={closeWidget}
                            className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                        >
                            <LuX className="w-3 h-3" />
                        </button>
                    </div>
                </motion.div>
            )}

            {/* AI Tools Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed bottom-24 left-6 z-50"
                    >
                        <Card className="w-80 p-5 bg-gray-900 border-gray-800 shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-full p-1.5">
                                        <LuWand className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">AI Tools</h3>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {activeToolsCount} active
                                </div>
                            </div>

                            {/* Tools Grid */}
                            <div className="grid grid-cols-2 gap-2">
                                {tools.map((tool) => {
                                    const Icon = tool.icon;
                                    const isActive = activeTool === tool.id;
                                    
                                    return (
                                        <button
                                            key={tool.id}
                                            onClick={() => handleToolClick(tool.id)}
                                            disabled={!tool.enabled}
                                            className={cn(
                                                "p-3 rounded-xl text-left transition-all duration-200",
                                                "border border-gray-800 hover:border-gray-700",
                                                tool.enabled 
                                                    ? "hover:bg-gray-800 cursor-pointer" 
                                                    : "opacity-50 cursor-not-allowed",
                                                isActive && "ring-2 ring-violet-500 bg-gray-800"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg bg-gradient-to-r flex items-center justify-center mb-2",
                                                tool.color
                                            )}>
                                                <Icon className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="text-sm font-medium text-white">
                                                {tool.label}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                {tool.description}
                                            </div>
                                            {!tool.enabled && (
                                                <div className="text-[10px] text-amber-500 mt-1">
                                                    Enable in Settings
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Footer */}
                            <div className="mt-4 pt-3 border-t border-gray-800">
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>Powered by Gemini AI</span>
                                    <button 
                                        onClick={() => setIsOpen(false)}
                                        className="text-violet-400 hover:text-violet-300"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Active Widgets */}
            {activeTool === 'concierge' && (
                <AIConciergeWidget 
                    isOpen={true} 
                    onClose={closeWidget}
                />
            )}
            
            {activeTool === 'recap' && (
                <AIRecapWidget 
                    isOpen={true} 
                    onClose={closeWidget}
                    mediaId={0}
                    mediaType="anime"
                />
            )}
            
            {activeTool === 'lore' && (
                <AILoreWidget 
                    isOpen={true} 
                    onClose={closeWidget}
                    mediaId={0}
                    title=""
                />
            )}
            
            {activeTool === 'ocr' && (
                <AIOcrWidget 
                    isOpen={true} 
                    onClose={closeWidget}
                />
            )}
            
            {activeTool === 'search' && (
                <AISearchWidget 
                    isOpen={true} 
                    onClose={closeWidget}
                />
            )}

            {/* Anyverse Hub - Always visible if configured */}
            <AnyverseHub />
        </>
    );
}

// Simple button version for navigation
export function AIToolsNavButton({ onClick }: { onClick?: () => void }) {
    const { data: settings } = useGetAISettings();
    const activeToolsCount = [
        settings?.enableChat,
        settings?.enableRecap,
        settings?.enableSearch,
        settings?.enableOcr,
    ].filter(Boolean).length;

    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors w-full text-left"
        >
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-full p-1">
                <LuBrain className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-300">AI Tools</span>
            {activeToolsCount > 0 && (
                <span className="ml-auto text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full">
                    {activeToolsCount}
                </span>
            )}
        </button>
    );
}
