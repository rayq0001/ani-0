"use client"

import { GlassCard } from "@/components/anyverse"
import { NeonBadge } from "@/components/anyverse/NeonBadge"
import { HolographicButton } from "@/components/anyverse/HolographicButton"
import { useAtom, useAtomValue } from "jotai"
import { 
    aiDirectorEnabledAtom, 
    generationProgressAtom, 
    currentPerspectiveAtom,
    Perspective,
    is3DAvailableAtom
} from "../../_atoms/anyverse.atoms"
import { motion, AnimatePresence } from "framer-motion"
import React, { useState } from "react"
import { 
    LuCamera, 
    LuRotateCcw, 
    LuEye, 
    LuUsers, 
    LuBird, 
    LuZap,
    LuLoader,
    LuCheck,
    LuX
} from "react-icons/lu"

const perspectives: { id: Perspective; label: string; icon: React.ReactNode; description: string }[] = [
    {
        id: "first-person",
        label: "First Person",
        icon: <LuEye className="w-5 h-5" />,
        description: "View from protagonist's eye level",
    },
    {
        id: "third-person",
        label: "Third Person",
        icon: <LuUsers className="w-5 h-5" />,
        description: "Standard over-the-shoulder view",
    },
    {
        id: "aerial",
        label: "Aerial",
        icon: <LuBird className="w-5 h-5" />,
        description: "Bird's eye view of the scene",
    },
    {
        id: "dynamic",
        label: "Dynamic",
        icon: <LuZap className="w-5 h-5" />,
        description: "Emphasized action and movement",
    },
]

interface AIDirectorEngineProps {
    currentImage?: string
    onGenerate?: (perspective: Perspective) => void
}

export function AIDirectorEngine({ currentImage, onGenerate }: AIDirectorEngineProps) {
    const [enabled, setEnabled] = useAtom(aiDirectorEnabledAtom)
    const [progress, setProgress] = useAtom(generationProgressAtom)
    const [selectedPerspective, setSelectedPerspective] = useAtom(currentPerspectiveAtom)
    const isAvailable = useAtomValue(is3DAvailableAtom)
    
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedImage, setGeneratedImage] = useState<string | null>(null)

    const handleGenerate = async (perspective: Perspective) => {
        if (!isAvailable || isGenerating) return
        
        setIsGenerating(true)
        setSelectedPerspective(perspective)
        
        // Simulate generation progress
        for (let i = 0; i <= 100; i += 10) {
            setProgress(i)
            await new Promise(resolve => setTimeout(resolve, 200))
        }
        
        // In production, this would call the AI image generation API
        setGeneratedImage(currentImage || null)
        setIsGenerating(false)
        onGenerate?.(perspective)
    }

    const handleReset = () => {
        setGeneratedImage(null)
        setProgress(0)
        setSelectedPerspective("third-person")
    }

    if (!isAvailable) {
        return (
            <GlassCard variant="medium" className="p-6">
                <div className="text-center">
                    <div className="inline-flex p-4 rounded-xl bg-violet-600/20 mb-4">
                        <LuCamera className="w-8 h-8 text-violet-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">AI Director</h3>
                    <p className="text-sm text-white/50 mb-4">
                        Upgrade to Elite to unlock 3D perspective transformation
                    </p>
                    <NeonBadge color="purple" variant="glow">
                        Elite Feature
                    </NeonBadge>
                </div>
            </GlassCard>
        )
    }

    return (
        <GlassCard 
            variant={enabled ? "holographic" : "medium"} 
            glow={enabled}
            className="p-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600">
                        <LuCamera className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">AI Director</h3>
                        <p className="text-sm text-white/50">Transform your viewing experience</p>
                    </div>
                </div>
                <button
                    onClick={() => setEnabled(!enabled)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                        enabled ? "bg-violet-600" : "bg-white/10"
                    }`}
                >
                    <motion.div
                        className="absolute top-1 w-4 h-4 bg-white rounded-full"
                        animate={{ left: enabled ? 28 : 4 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                </button>
            </div>

            <AnimatePresence mode="wait">
                {!enabled ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-8"
                    >
                        <p className="text-white/40">Enable AI Director to transform perspectives</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Perspective Selection */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {perspectives.map((perspective) => (
                                <button
                                    key={perspective.id}
                                    onClick={() => handleGenerate(perspective.id)}
                                    disabled={isGenerating}
                                    className={`relative p-4 rounded-xl border text-left transition-all ${
                                        selectedPerspective === perspective.id
                                            ? "border-violet-500 bg-violet-600/20"
                                            : "border-white/10 bg-white/5 hover:border-white/20"
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={selectedPerspective === perspective.id ? "text-violet-400" : "text-white/70"}>
                                            {perspective.icon}
                                        </span>
                                        <span className={`text-sm font-medium ${
                                            selectedPerspective === perspective.id ? "text-white" : "text-white/70"
                                        }`}>
                                            {perspective.label}
                                        </span>
                                    </div>
                                    <p className="text-xs text-white/40">{perspective.description}</p>
                                    
                                    {selectedPerspective === perspective.id && generatedImage && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-2 right-2"
                                        >
                                            <LuCheck className="w-4 h-4 text-emerald-400" />
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Generation Progress */}
                        {isGenerating && (
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-white/70">Generating...</span>
                                    <span className="text-sm text-violet-400">{progress}%</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-violet-600 to-pink-600"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Generated Image Preview */}
                        {generatedImage && !isGenerating && (
                            <div className="mb-6">
                                <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                                    <img
                                        src={generatedImage}
                                        alt="Generated"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-3 left-3">
                                        <NeonBadge color="pink" variant="solid">
                                            {selectedPerspective?.replace("-", " ")} View
                                        </NeonBadge>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <HolographicButton
                                        onClick={handleReset}
                                        variant="ghost"
                                        size="sm"
                                        className="flex-1"
                                    >
                                        <LuRotateCcw className="w-4 h-4 mr-2" />
                                        Reset
                                    </HolographicButton>
                                    <HolographicButton
                                        onClick={() => setSelectedPerspective("first-person")}
                                        size="sm"
                                        className="flex-1"
                                    >
                                        <LuEye className="w-4 h-4 mr-2" />
                                        Try Another
                                    </HolographicButton>
                                </div>
                            </div>
                        )}

                        {/* Generate Button */}
                        {!generatedImage && !isGenerating && (
                            <HolographicButton
                                onClick={() => handleGenerate(selectedPerspective || "third-person")}
                                className="w-full"
                                glowColor="pink"
                            >
                                <LuZap className="w-4 h-4 mr-2" />
                                Generate {selectedPerspective?.replace("-", " ")} View
                            </HolographicButton>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    )
}

export default AIDirectorEngine

