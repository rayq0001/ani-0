"use client"

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { HolographicButton } from './HolographicButton';
import { NeonBadge } from './NeonBadge';
import { LuSparkles, LuBookOpen, LuClock } from 'react-icons/lu';

interface SummaryOverlayProps {
    summary: string;
    chapterTitle?: string;
    lastReadDate?: string;
    onContinue: () => void;
    onSkip?: () => void;
    isOpen: boolean;
}

export const SummaryOverlay = ({ 
    summary, 
    chapterTitle,
    lastReadDate,
    onContinue, 
    onSkip,
    isOpen 
}: SummaryOverlayProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <GlassCard className="max-w-lg p-8 border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <LuSparkles className="w-5 h-5 text-amber-400" />
                                    <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">
                                        Previously on Aniverse
                                    </span>
                                </div>
                                <NeonBadge color="gold">AI Summary</NeonBadge>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-black mb-2 text-white">
                                Story Recap
                            </h2>
                            
                            {chapterTitle && (
                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                                    <LuBookOpen className="w-4 h-4" />
                                    <span>{chapterTitle}</span>
                                </div>
                            )}

                            {lastReadDate && (
                                <div className="flex items-center gap-2 text-amber-400/70 text-xs mb-6">
                                    <LuClock className="w-3 h-3" />
                                    <span>Last read: {lastReadDate}</span>
                                </div>
                            )}

                            {/* Summary Content */}
                            <div className="relative">
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-amber-400 to-amber-500 rounded-full" />
                                <p className="text-gray-300 leading-relaxed text-lg pr-6 border-r-4 border-amber-500/30 pr-4">
                                    &ldquo;{summary}&rdquo;
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 space-y-3">
                                <HolographicButton 
                                    className="w-full py-4 text-lg font-bold" 
                                    onClick={onContinue}
                                >
                                    <LuBookOpen className="w-5 h-5" />
                                    Complete the saga now
                                </HolographicButton>
                                
                                {onSkip && (
                                    <button
                                        onClick={onSkip}
                                        className="w-full py-3 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        Skip recap
                                    </button>
                                )}
                            </div>
                        </GlassCard>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SummaryOverlay;

