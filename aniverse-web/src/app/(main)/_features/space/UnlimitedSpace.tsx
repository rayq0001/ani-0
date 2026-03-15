"use client"

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';
import { spaceModeAtom, dnaFiltersAtom, emotionalStateAtom } from '@/app/(main)/_atoms/space.atoms';
import { GlassCard } from '@/components/anyverse/GlassCard';
import { HolographicButton } from '@/components/anyverse/HolographicButton';
import { NeonBadge } from '@/components/anyverse/NeonBadge';
import { DNAFilterPanel } from './DNAFilterPanel';
import { StarField } from './StarField';
import { SpaceScene } from './SpaceScene';
import { GalaxyClusters } from './GalaxyClusters';
import { TimelineNavigator } from './TimelineNavigator';
import { 
    LuOrbit, 
    LuDna, 
    LuClock, 
    LuImage, 
    LuSearch,
    LuX,
    LuSparkles,
    LuGlobe
} from 'react-icons/lu';
import { useCosmicSearch } from '@/api/hooks/space.hooks';
import { useDebounce } from '@/hooks/use-debounce';
import { isSearchingAtom, searchResultsAtom, timelineYearRangeAtom, StarNode } from '@/app/(main)/_atoms/space.atoms';

export const UnlimitedSpace = () => {
    const [isOpen, setIsOpen] = useAtom(spaceModeAtom);
    const [activeView, setActiveView] = useState<'galaxy' | 'dna' | 'timeline' | 'visual'>('galaxy');
    const [searchQuery, setSearchQuery] = useState('');
    const [dnaFilters] = useAtom(dnaFiltersAtom);
    const [emotionalState] = useAtom(emotionalStateAtom);
    const [yearRange] = useAtom(timelineYearRangeAtom);
    const [, setResults] = useAtom(searchResultsAtom);
    const [isSearching, setIsSearching] = useAtom(isSearchingAtom);

    const { mutate: search, isPending } = useCosmicSearch();
    const debouncedSearchQuery = useDebounce(searchQuery, 800);

    // Search effect
    useEffect(() => {
        if (debouncedSearchQuery.trim()) {
            setIsSearching(true);
            search({
                query: debouncedSearchQuery,
                dnaFilters: dnaFilters,
                emotionalState: emotionalState,
                yearRange: yearRange,
                includeDimensions: ['anime', 'manga', 'novel'],
                excludeGenres: [],
                minSimilarity: 0.1,
                maxResults: 20
            }, {
                onSuccess: (data: any) => {
                    setResults((data.results as any) as StarNode[]);
                    setIsSearching(false);
                },
                onError: () => {
                    setIsSearching(false);
                }
            });
        }
    }, [debouncedSearchQuery, dnaFilters, emotionalState, yearRange]);

    // Body scroll lock & Escape listener
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleEscape);
        return () => {
            window.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, setIsOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-[#0a0a0f] overflow-hidden"
            >
                {/* 4K 3D Space Background */}
                <SpaceScene />

                {/* Scanline Overlay (Luxury Cinematic) */}
                <div className="absolute inset-0 pointer-events-none z-[60] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] opacity-20" />

                {/* Header */}
                <motion.header 
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    className="absolute top-0 left-0 right-0 z-[70] p-8 flex items-center justify-between"
                >
                    <div className="flex items-center gap-16 w-full justify-center">
                        <motion.div 
                            className="flex flex-col items-center gap-2"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <h1 className="text-5xl font-extralight tracking-[0.3em] text-white/95 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] uppercase italic font-serif">
                                Unlimited <span className="font-sans not-italic font-thin">Space</span>
                            </h1>
                            <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
                            <span className="text-[10px] tracking-[0.5em] text-purple-400/60 uppercase mt-1">Cosmic Explorer V3</span>
                        </motion.div>
 
                        {/* Search Bar - Premium Refinement */}
                        <div className="relative group">
                            <motion.div 
                                className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/20 via-white/5 to-purple-500/20 rounded-xl blur-[2px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"
                            />
                            <input
                                type="text"
                                placeholder="Search the infinite..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="relative w-72 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl px-5 py-3 pl-12 text-sm text-white placeholder-white/15 focus:outline-none focus:w-96 focus:bg-white/10 focus:border-purple-500/50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                            />
                            {isSearching || isPending ? (
                                <LuOrbit className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 animate-spin" />
                            ) : (
                                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-purple-400 transition-colors duration-500" />
                            )}
                        </div>
                    </div>

                    {/* View Switcher - Premium Floating Design */}
                    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-2xl p-1.5 rounded-2xl border border-white/10 shadow-2xl">
                        {[
                            { id: 'galaxy', icon: LuOrbit, label: 'Galaxies' },
                            { id: 'dna', icon: LuDna, label: 'Genes' },
                            { id: 'timeline', icon: LuClock, label: 'Timeline' },
                            { id: 'visual', icon: LuImage, label: 'Visual' },
                        ].map((view) => {
                            const Icon = view.icon;
                            const isActive = activeView === view.id;
                            return (
                                <motion.button
                                    key={view.id}
                                    onClick={() => setActiveView(view.id as any)}
                                    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
                                        isActive 
                                            ? 'text-purple-300' 
                                            : 'text-white/40 hover:text-white/70'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isActive && (
                                        <motion.div 
                                            layoutId="active-view"
                                            className="absolute inset-0 bg-purple-500/20 border border-purple-500/40 rounded-xl"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-purple-400' : ''}`} />
                                    <span className="text-xs font-medium tracking-wide relative z-10">{view.label}</span>
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Close Button - Premium Minimalist */}
                    <motion.button
                        onClick={() => setIsOpen(false)}
                        className="absolute right-10 top-10 w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all shadow-2xl group"
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <LuX className="w-6 h-6 group-hover:text-purple-400 transition-colors" />
                    </motion.button>
                </motion.header>

                {/* Main Content */}
                <div className="absolute inset-0 pt-24 pb-6 px-6">
                    <AnimatePresence mode="wait">
                        {activeView === 'galaxy' && (
                            <motion.div
                                key="galaxy"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="h-full"
                            >
                                <GalaxyClusters />
                            </motion.div>
                        )}

                        {activeView === 'dna' && (
                            <motion.div
                                key="dna"
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                className="h-full flex gap-6"
                            >
                                <DNAFilterPanel />
                                <StarField />
                            </motion.div>
                        )}

                        {activeView === 'timeline' && (
                            <motion.div
                                key="timeline"
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -100 }}
                                className="h-full"
                            >
                                <TimelineNavigator />
                            </motion.div>
                        )}

                        {activeView === 'visual' && (
                            <motion.div
                                key="visual"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex items-center justify-center"
                            >
                                <GlassCard className="p-8 text-center max-w-md">
                                    <LuImage className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">Search by Image</h3>
                                    <p className="text-white/60 mb-6">Upload a character image or scene to find the original work</p>
                                    <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-8 hover:border-purple-500/60 transition-colors cursor-pointer">
                                        <p className="text-purple-400">Drag image here or click to select</p>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Emotional Signature Slider (Bottom) - Luxury Resonance Visualizer */}
                <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[70]"
                >
                    <GlassCard variant="medium" className="px-8 py-4 flex items-center gap-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)]" glow glowColor="purple">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-[.4em] flex items-center gap-2">
                                <motion.div
                                    animate={{ rotate: [0, 90, 180, 270, 360] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                >
                                    <LuSparkles className="w-3.5 h-3.5 text-yellow-400" />
                                </motion.div>
                                Resonance
                            </span>
                            <span className="text-[8px] text-white/20 uppercase tracking-[.2em]">Emotional Signature</span>
                        </div>

                        <div className="flex items-center gap-6">
                            {[
                                { label: 'Sadness', color: 'from-blue-600 to-cyan-400', value: 20, glow: 'rgba(59, 130, 246, 0.5)' },
                                { label: 'Excitement', color: 'from-red-600 to-orange-400', value: 80, glow: 'rgba(239, 68, 68, 0.5)' },
                                { label: 'Comedy', color: 'from-yellow-600 to-amber-300', value: 40, glow: 'rgba(245, 158, 11, 0.5)' },
                                { label: 'Mystery', color: 'from-purple-600 to-pink-500', value: 60, glow: 'rgba(139, 92, 246, 0.5)' },
                            ].map((emotion) => (
                                <div key={emotion.label} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[9px] text-white/40 uppercase tracking-widest">{emotion.label}</span>
                                    </div>
                                    <div className="relative w-28 h-[3px] bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${emotion.color}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${emotion.value}%` }}
                                            transition={{ duration: 1.5, delay: 0.8, ease: "circOut" }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 blur-[2px] animate-pulse" />
                                        </motion.div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Help Tooltip - Premium Minimalist */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-10 left-10 z-[70]"
                >
                    <div className="flex items-center gap-4 bg-black/40 backdrop-blur-3xl px-6 py-3 rounded-2xl border border-white/5 shadow-2xl">
                        <div className="flex items-center gap-2">
                            <kbd className="px-2 py-0.5 rounded-md bg-white/10 text-[9px] text-white/60 border border-white/10">ESC</kbd>
                            <span className="text-[10px] text-white/40 uppercase tracking-widest">Exit</span>
                        </div>
                        <div className="w-[1px] h-3 bg-white/10" />
                        <span className="text-[10px] text-white/40 uppercase tracking-widest">Drag to navigate • Click stars for details</span>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Space Mode Toggle Button
export const SpaceModeToggle = () => {
    const [, setIsOpen] = useAtom(spaceModeAtom);

    return (
        <motion.button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 left-8 z-[60] w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10 
                      shadow-2xl flex items-center justify-center text-white/40 group hover:text-purple-400 hover:border-purple-500/40 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
                boxShadow: [
                    '0 0 20px rgba(139,92,246,0.1)',
                    '0 0 40px rgba(139,92,246,0.2)',
                    '0 0 20px rgba(139,92,246,0.1)'
                ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
        >
            <LuOrbit className="w-6 h-6 group-hover:animate-spin" />
            
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 px-3 py-1 rounded-lg text-xs text-white/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Unlimited Space
            </div>
        </motion.button>
    );
};
