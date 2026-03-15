"use client"

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';
import { searchResultsAtom, selectedStarAtom, isSearchingAtom } from '@/app/(main)/_atoms/space.atoms';
import { GlassCard } from '@/components/anyverse/GlassCard';
import { NeonBadge } from '@/components/anyverse/NeonBadge';
import { 
    LuStar, 
    LuExternalLink, 
    LuDna, 
    LuSparkles, 
    LuOrbit, 
    LuX, 
    LuGlobe 
} from 'react-icons/lu';

// Mock data for demonstration
const MOCK_STARS = [
  {
    id: '1',
    mediaId: 1,
    title: 'Solo Leveling',
    type: 'manhwa',
    coverImage: 'https://example.com/solo-leveling.jpg',
    coordinates: { x: 20, y: 30, z: 10 },
    similarityScore: 0.95,
    publicRating: 8.9,
    aiOpinion: "A masterpiece of the 'system' genre. Jin-woo's progression is masterfully paced, making every power-up feel earned. The art and concept defined a whole new generation of manhwa.",
    year: 2018,
    genres: ['action', 'fantasy', 'supernatural'],
    dna: {
      heroArchetype: 80,
      worldSetting: 70,
      powerSystem: 60,
      conflictType: 70,
      romanceLevel: 20,
      comedyLevel: 30,
      darknessLevel: 60,
      mysteryLevel: 50,
      selectedGenes: ['system', 'leveling', 'shadow-monarch'],
    },
    dimensions: [
      { type: 'novel', title: 'Solo Leveling (Novel)', relation: 'Original' },
      { type: 'anime', title: 'Solo Leveling (TV)', relation: 'Adaptation' }
    ]
  },
  {
    id: '2',
    mediaId: 2,
    title: 'Tower of God',
    type: 'manhwa',
    coverImage: 'https://example.com/tower-of-god.jpg',
    coordinates: { x: -40, y: 20, z: 15 },
    similarityScore: 0.87,
    publicRating: 8.4,
    aiOpinion: "The world-building here is unparalleled. Every floor brings a new ecosystem and set of rules. It starts as a simple quest and evolves into a complex political and philosophical epic.",
    year: 2010,
    genres: ['action', 'fantasy', 'mystery'],
    dna: {
      heroArchetype: 40,
      worldSetting: 90,
      powerSystem: 50,
      conflictType: 60,
      romanceLevel: 40,
      comedyLevel: 40,
      darknessLevel: 50,
      mysteryLevel: 80,
      selectedGenes: ['tower', 'climbing', 'betrayal'],
    },
    dimensions: [
      { type: 'anime', title: 'Tower of God (TV)', relation: 'Adaptation' }
    ]
  }
];

export const StarField = () => {
  const [results, setResults] = useAtom(searchResultsAtom);
  const [selectedStar, setSelectedStar] = useAtom(selectedStarAtom);
  const [isSearching] = useAtom(isSearchingAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // No mock data override - use results from atom

  // Parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left - rect.width / 2) / 50,
          y: (e.clientY - rect.top - rect.height / 2) / 50,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="flex-1 relative overflow-hidden rounded-2xl bg-black/20"
    >
      {/* Searching Overlay */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0f]/40 backdrop-blur-md"
          >
            <LuOrbit className="w-12 h-12 text-purple-400 animate-spin mb-4" />
            <span className="text-white/60 text-sm tracking-widest uppercase animate-pulse">Scanning the Multiverse...</span>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 3D Space Container */}
      <div 
        className="absolute inset-0"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Stars */}
        {results.map((star, index) => {
          const x = star.coordinates.x * 10 + mousePos.x * (index + 1);
          const y = star.coordinates.y * 10 + mousePos.y * (index + 1);
          const z = star.coordinates.z * 5;
          const scale = 1 + (z / 100);

          return (
            <motion.div
              key={star.id}
              className="absolute cursor-pointer group"
              initial={{ opacity: 0, scale: 0, z: -100 }}
              animate={{ 
                opacity: 1, 
                scale: scale,
                x: `calc(50% + ${x}px)`,
                y: `calc(50% + ${y}px)`,
                z: 0
              }}
              transition={{ 
                delay: index * 0.05,
                type: "spring",
                stiffness: 80,
                damping: 25
              }}
              style={{
                zIndex: Math.round(z),
                perspective: '1000px'
              }}
              onClick={() => setSelectedStar(star)}
              whileHover={{ scale: scale * 1.15, z: 20 }}
            >
              <div className="relative">
                {/* Advanced Multi-Layer Glow */}
                <div 
                  className="absolute inset-0 rounded-full blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-700"
                  style={{
                    background: `radial-gradient(circle, ${getStarColor(star.similarityScore)} 0%, transparent 70%)`,
                    width: '100px',
                    height: '100px',
                    left: '-40px',
                    top: '-40px',
                  }}
                />
                
                {/* Orbital Rings (Luxury Detail) */}
                <motion.div 
                  className="absolute -inset-4 border border-white/5 rounded-full pointer-events-none"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />

                {/* Star Core (Premium Gradient) */}
                <div 
                  className="w-6 h-6 rounded-full relative overflow-hidden group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, white 0%, ${getStarColor(star.similarityScore)} 50%, #000 100%)`,
                  }}
                >
                    {/* Interior Sparkle */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)] opacity-30 animate-pulse" />
                </div>

                {/* Dynamic Label Container */}
                <motion.div 
                    className="absolute top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0"
                    style={{ perspective: '500px' }}
                >
                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap">
                        <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full" style={{ background: getStarColor(star.similarityScore) }} />
                             <span className="text-[11px] font-bold text-white tracking-widest uppercase italic">{star.title}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Hover Connection Line (Visual Guide) */}
                <motion.div 
                    className="absolute top-1/2 left-1/2 w-[1px] h-0 bg-gradient-to-t from-purple-500/50 to-transparent -translate-x-1/2 origin-top"
                    initial={{ scaleY: 0 }}
                    whileHover={{ scaleY: 1 }}
                    transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          );
        })}

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          {results.map((star1, i) => 
            results.slice(i + 1).map((star2, j) => {
              if (star1.similarityScore > 0.8 && star2.similarityScore > 0.8) {
                const x1 = 50 + star1.coordinates.x * 0.5;
                const y1 = 50 + star1.coordinates.y * 0.5;
                const x2 = 50 + star2.coordinates.x * 0.5;
                const y2 = 50 + star2.coordinates.y * 0.5;
                
                return (
                  <line
                    key={`${star1.id}-${star2.id}`}
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke="url(#lineGradient)"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                  />
                );
              }
              return null;
            })
          )}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="1" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Selected Star Detail Panel */}
      <AnimatePresence>
        {selectedStar && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9, rotateY: 20 }}
            animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, x: 100, scale: 0.9, rotateY: 20 }}
            className="absolute right-6 top-6 bottom-6 w-[440px] z-[80]"
          >
            <GlassCard variant="heavy" className="h-full flex flex-col shadow-2xl overflow-hidden" glow glowColor="purple">
               {/* Visual Header */}
               <div className="relative h-56 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent z-10" />
                    
                    {/* Dynamic Image/Pattern Placeholder */}
                    <div className="absolute inset-0 bg-[#0a0a0f]">
                         <motion.div 
                            className="absolute inset-0 opacity-20"
                            animate={{ 
                                background: [
                                    'radial-gradient(circle at 50% 50%, #4c1d95 0%, transparent 70%)',
                                    'radial-gradient(circle at 30% 70%, #4c1d95 0%, transparent 70%)',
                                    'radial-gradient(circle at 50% 50%, #4c1d95 0%, transparent 70%)'
                                ]
                            }}
                            transition={{ duration: 10, repeat: Infinity }}
                         />
                         <div className="absolute inset-0 flex items-center justify-center">
                              <LuOrbit className="w-32 h-32 text-white/5 animate-spin-slow" />
                         </div>
                    </div>
                    
                    {/* Floating Title & Metadata */}
                    <div className="absolute bottom-6 left-8 z-20">
                        <div className="flex items-center gap-3 mb-2">
                            <NeonBadge color="purple" size="sm">{selectedStar.type.toUpperCase()}</NeonBadge>
                            <span className="text-[10px] text-white/40 tracking-[.4em] uppercase font-light">Year {selectedStar.year}</span>
                        </div>
                        <h3 className="text-3xl font-serif italic text-white tracking-widest leading-tight">{selectedStar.title}</h3>
                    </div>

                    <motion.button 
                        onClick={() => setSelectedStar(null)}
                        className="absolute top-6 right-6 z-20 w-10 h-10 rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all hover:rotate-90"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <LuX className="w-6 h-6" />
                    </motion.button>
               </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar relative z-20">
                
                {/* AI Analysis - Premium Box */}
                <div className="relative group">
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/20 to-transparent rounded-2xl blur-sm" />
                    <div className="relative bg-black/40 rounded-2xl p-6 border border-white/5 backdrop-blur-3xl">
                        <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-[.3em] mb-4 flex items-center gap-3">
                            <LuSparkles className="w-3.5 h-3.5" />
                            Core Resonance Analysis
                        </h4>
                        <p className="text-[13px] text-white/70 italic leading-loose font-light">
                            {selectedStar.aiOpinion || "Reconstructing story shards from the multiverse..."}
                        </p>
                    </div>
                </div>

                {/* Dimensions (Related Media) */}
                {selectedStar.dimensions && selectedStar.dimensions.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[.3em] flex items-center gap-3">
                            <LuGlobe className="w-3.5 h-3.5" />
                            Cross-Media Dimensions
                        </h4>
                        <div className="grid grid-cols-1 gap-2.5">
                            {selectedStar.dimensions.map((dim: any, i: number) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center justify-between bg-white/5 px-5 py-3 rounded-xl border border-white/5 group hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs text-white/90 font-medium tracking-wide">{dim.title}</span>
                                        <span className="text-[10px] text-white/30 uppercase tracking-widest">{dim.relation}</span>
                                    </div>
                                    <NeonBadge color={dim.type === 'anime' ? 'blue' : 'gold'} size="xs">{dim.type}</NeonBadge>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* DNA Sequence Vis - Luxury Progress Sliders */}
                <div className="space-y-5">
                  <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[.3em] flex items-center gap-3">
                    <LuDna className="w-3.5 h-3.5" />
                    Story DNA Sequence
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(selectedStar.dna)
                      .filter(([key]) => key !== 'selectedGenes')
                      .map(([key, value], idx) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-white/40">
                             <span>{translateDNAKey(key)}</span>
                             <span className="text-purple-400/80">{(value as any) as number}%</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden relative">
                             <motion.div 
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(value as any) as number}%` }}
                                transition={{ duration: 1.5, delay: 0.2 + (idx * 0.05), ease: "circOut" }}
                             >
                                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                             </motion.div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Actions - Premium Buttons */}
                <div className="pt-6 grid grid-cols-2 gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(139, 92, 246, 0.9)' }}
                    whileTap={{ scale: 0.98 }}
                    className="py-3 rounded-2xl bg-purple-600 text-white text-xs font-bold tracking-[.2em] uppercase flex items-center justify-center gap-2 transition-all shadow-[0_10px_30px_rgba(139,92,246,0.3)]"
                  >
                    <LuExternalLink className="w-4 h-4" />
                    Dive In
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    className="py-3 rounded-2xl bg-white/5 border border-white/10 text-white/80 text-xs font-bold tracking-[.2em] uppercase flex items-center justify-center gap-2 transition-all"
                  >
                    <LuStar className="w-4 h-4" />
                    Collect
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-4 left-4">
        <GlassCard className="p-3 space-y-2">
          <p className="text-xs text-white/60">Color Guide:</p>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-white/80">90%+</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-white/80">80%+</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-white/80">70%+</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

// Helper functions
function getStarColor(similarity: number): string {
  if (similarity >= 0.9) return '#10B981'; // Green
  if (similarity >= 0.8) return '#3B82F6'; // Blue
  if (similarity >= 0.7) return '#8B5CF6'; // Purple
  if (similarity >= 0.6) return '#F59E0B'; // Orange
  return '#EF4444'; // Red
}

function translateDNAKey(key: string): string {
  const translations: Record<string, string> = {
    heroArchetype: 'Hero',
    worldSetting: 'World',
    powerSystem: 'Power',
    conflictType: 'Conflict',
    romanceLevel: 'Romance',
    comedyLevel: 'Comedy',
    darknessLevel: 'Darkness',
    mysteryLevel: 'Mystery',
  };
  return translations[key] || key;
}

function translateGene(gene: string): string {
  const translations: Record<string, string> = {
    system: 'System',
    leveling: 'Leveling',
    'shadow-monarch': 'Shadow Monarch',
    dungeons: 'Dungeons',
    tower: 'Tower',
    climbing: 'Climbing',
    betrayal: 'Betrayal',
    regression: 'Regression',
    reader: 'Reader',
    apocalypse: 'Apocalypse',
    reincarnation: 'Reincarnation',
    magic: 'Magic',
    king: 'King',
    spear: 'Spear',
    knight: 'Knight',
  };
  return translations[gene] || gene;
}
