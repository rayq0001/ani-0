"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { searchResultsAtom, selectedStarAtom } from '@/app/(main)/_atoms/space.atoms';
import { GlassCard } from '@/components/anyverse/GlassCard';
import { NeonBadge } from '@/components/anyverse/NeonBadge';
import { LuAtom, LuArrowRight, LuSparkles } from 'react-icons/lu';

export const SearchResultsGrid = () => {
    const [results] = useAtom(searchResultsAtom);
    const [, setSelectedStar] = useAtom(selectedStarAtom);

    if (results.length === 0) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-x-0 bottom-32 top-32 z-[80] overflow-y-auto px-12 py-8 custom-scrollbar bg-black/20 backdrop-blur-sm"
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-4xl font-serif italic text-white tracking-[0.2em] mb-2 flex items-center gap-4">
                            <LuSparkles className="w-8 h-8 text-purple-400" />
                            Cosmic Matches
                        </h2>
                        <p className="text-white/40 text-sm tracking-[.3em] uppercase">Identified {results.length} resonant frequencies in the multiverse</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {results.map((star, index) => (
                        <motion.div
                            key={star.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setSelectedStar(star)}
                        >
                            <GlassCard 
                                variant="medium" 
                                className="h-full group cursor-pointer border-white/5 hover:border-purple-500/40 transition-all duration-500"
                                glow
                                glowColor="purple"
                            >
                                <div className="p-6 flex flex-col h-full">
                                    {/* Visual Proxy */}
                                    <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-5 bg-gradient-to-br from-purple-900/40 to-black">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <LuAtom className="w-12 h-12 text-white/10 group-hover:text-purple-400/30 transition-colors duration-700 group-hover:scale-110" />
                                        </div>
                                        <div className="absolute top-3 right-3">
                                            <NeonBadge color="purple" size="xs">
                                                {((star.similarityScore || 0) * 100).toFixed(0)}% MATCH
                                            </NeonBadge>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] text-white/30 uppercase tracking-[.2em]">{star.type}</span>
                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                            <span className="text-[10px] text-white/30 uppercase tracking-[.2em]">{star.year}</span>
                                        </div>
                                        <h3 className="text-xl font-serif italic text-white mb-3 group-hover:text-purple-200 transition-colors uppercase tracking-widest">{star.title}</h3>
                                        <p className="text-xs text-white/50 line-clamp-2 leading-relaxed font-light mb-6">
                                            {star.aiOpinion || "No cosmic resonance data available for this entity yet."}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex gap-1.5">
                                            {Array.isArray(star.genres) && star.genres.slice(0, 2).map((genre: string) => (
                                                <span key={genre} className="text-[9px] text-purple-400/60 uppercase tracking-tighter">{genre}</span>
                                            ))}
                                        </div>
                                        <motion.div 
                                            className="text-white/20 group-hover:text-purple-400 transition-colors"
                                            whileHover={{ x: 5 }}
                                        >
                                            <LuArrowRight className="w-5 h-5" />
                                        </motion.div>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
