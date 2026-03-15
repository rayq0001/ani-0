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
                onSuccess: (data) => {
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

                {/* Header */}
                <motion.header 
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between"
                >
                    <div className="flex items-center gap-12 w-full justify-center">
                        <motion.div 
                            className="flex flex-col items-center gap-1"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <h1 className="text-4xl font-extralight tracking-[0.2em] text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] uppercase">
                                Unlimited Space
                            </h1>
                            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                        </motion.div>
 
                        {/* Search Bar - Smaller & Liquid Glass */}
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search the infinite..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl px-4 py-2 pl-10 text-sm text-white placeholder-white/20 focus:outline-none focus:w-80 focus:bg-white/10 focus:border-purple-500/40 transition-all duration-500 ease-out shadow-2xl"
                            />
                            {isSearching || isPending ? (
                                <LuOrbit className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 animate-spin" />
                            ) : (
                                <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                            )}
                        </div>
                    </div>

                    {/* View Switcher */}
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl p-1 rounded-full border border-purple-500/30">
                        {[
                            { id: 'galaxy', icon: LuOrbit, label: 'Galaxies' },
                            { id: 'dna', icon: LuDna, label: 'Genes' },
                            { id: 'timeline', icon: LuClock, label: 'Timeline' },
                            { id: 'visual', icon: LuImage, label: 'Image' },
                        ].map((view) => {
                            const Icon = view.icon;
                            const isActive = activeView === view.id;
                            return (
                                <button
                                    key={view.id}
                                    onClick={() => setActiveView(view.id as any)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                                        isActive 
                                            ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' 
                                            : 'text-white/50 hover:text-white/80'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="text-sm">{view.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Close Button - Liquid Glass */}
                    <motion.button
                        onClick={() => setIsOpen(false)}
                        className="absolute right-8 top-8 w-10 h-10 rounded-xl bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all shadow-xl"
                        whileHover={{ scale: 1.05, rotate: 90 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <LuX className="w-5 h-5" />
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

                {/* Emotional Signature Slider (Bottom) */}
                <motion.div 
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50"
                >
                    <GlassCard className="px-6 py-3 flex items-center gap-6">
                        <span className="text-sm text-white/60 flex items-center gap-2">
                            <LuSparkles className="w-4 h-4 text-yellow-400" />
                            Emotional Signature
                        </span>
                        <div className="flex items-center gap-4">
                            {[
                                { label: 'Sadness', color: 'bg-blue-500', value: 20 },
                                { label: 'Excitement', color: 'bg-red-500', value: 80 },
                                { label: 'Comedy', color: 'bg-yellow-500', value: 40 },
                                { label: 'Mystery', color: 'bg-purple-500', value: 60 },
                            ].map((emotion) => (
                                <div key={emotion.label} className="flex flex-col items-center gap-1">
                                    <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div 
                                            className={`h-full ${emotion.color}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${emotion.value}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                        />
                                    </div>
                                    <span className="text-xs text-white/40">{emotion.label}</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Help Tooltip */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-6 left-6 z-50"
                >
                    <div className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded-lg border border-white/10 text-xs text-white/60">
                        <p>Press ESC to exit • Drag to navigate • Click stars for details</p>
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
