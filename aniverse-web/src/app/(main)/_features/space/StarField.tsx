"use client"

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';
import { searchResultsAtom, selectedStarAtom, isSearchingAtom } from '@/app/(main)/_atoms/space.atoms';
import { GlassCard } from '@/components/anyverse/GlassCard';
import { NeonBadge } from '@/components/anyverse/NeonBadge';
import { LuStar, LuExternalLink, LuDna, LuSparkles } from 'react-icons/lu';

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
  },
  {
    id: '2',
    mediaId: 2,
    title: 'Tower of God',
    type: 'manhwa',
    coverImage: 'https://example.com/tower-of-god.jpg',
    coordinates: { x: -40, y: 20, z: 15 },
    similarityScore: 0.87,
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
  },
  {
    id: '3',
    mediaId: 3,
    title: 'Omniscient Reader',
    type: 'manhwa',
    coverImage: 'https://example.com/orv.jpg',
    coordinates: { x: 50, y: -20, z: 25 },
    similarityScore: 0.92,
    year: 2020,
    genres: ['action', 'fantasy', 'supernatural'],
    dna: {
      heroArchetype: 60,
      worldSetting: 80,
      powerSystem: 70,
      conflictType: 80,
      romanceLevel: 30,
      comedyLevel: 50,
      darknessLevel: 70,
      mysteryLevel: 60,
      selectedGenes: ['regression', 'reader', 'apocalypse'],
    },
  },
  {
    id: '4',
    mediaId: 4,
    title: 'The Beginning After The End',
    type: 'manhwa',
    coverImage: 'https://example.com/tbate.jpg',
    coordinates: { x: -30, y: -40, z: 5 },
    similarityScore: 0.78,
    year: 2016,
    genres: ['action', 'fantasy', 'adventure'],
    dna: {
      heroArchetype: 70,
      worldSetting: 85,
      powerSystem: 80,
      conflictType: 50,
      romanceLevel: 50,
      comedyLevel: 60,
      darknessLevel: 40,
      mysteryLevel: 40,
      selectedGenes: ['reincarnation', 'magic', 'king'],
    },
  },
  {
    id: '5',
    mediaId: 5,
    title: 'Return of the Legendary Spear Knight',
    type: 'manhwa',
    coverImage: 'https://example.com/spear-knight.jpg',
    coordinates: { x: 60, y: 40, z: 20 },
    similarityScore: 0.73,
    year: 2022,
    genres: ['action', 'fantasy'],
    dna: {
      heroArchetype: 75,
      worldSetting: 75,
      powerSystem: 65,
      conflictType: 65,
      romanceLevel: 25,
      comedyLevel: 35,
      darknessLevel: 55,
      mysteryLevel: 45,
      selectedGenes: ['regression', 'spear', 'knight'],
    },
  },
];

export const StarField = () => {
  const [results, setResults] = useAtom(searchResultsAtom);
  const [selectedStar, setSelectedStar] = useAtom(selectedStarAtom);
  const [isSearching] = useAtom(isSearchingAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Use mock data for now
  useEffect(() => {
    setResults(MOCK_STARS);
  }, [setResults]);

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
              className="absolute cursor-pointer"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: scale,
                x: `calc(50% + ${x}px)`,
                y: `calc(50% + ${y}px)`,
              }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
              style={{
                zIndex: Math.round(z),
                transform: `translateZ(${z}px)`,
              }}
              onClick={() => setSelectedStar(star)}
              whileHover={{ scale: scale * 1.2 }}
            >
              {/* Star Glow */}
              <div className="relative">
                <div 
                  className="absolute inset-0 rounded-full blur-xl animate-pulse"
                  style={{
                    background: `radial-gradient(circle, ${getStarColor(star.similarityScore)} 0%, transparent 70%)`,
                    width: '60px',
                    height: '60px',
                    left: '-20px',
                    top: '-20px',
                  }}
                />
                
                {/* Star Core */}
                <div 
                  className="w-5 h-5 rounded-full relative"
                  style={{
                    background: getStarColor(star.similarityScore),
                    boxShadow: `0 0 20px ${getStarColor(star.similarityScore)}`,
                  }}
                >
                  {/* Similarity Score Badge */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="text-[10px] font-bold text-white bg-black/50 px-1.5 py-0.5 rounded">
                      {(star.similarityScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Label */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs text-white/80 font-medium bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                    {star.title}
                  </span>
                </div>
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
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute right-4 top-4 bottom-4 w-80"
          >
            <GlassCard className="h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-bold text-white">{selectedStar.title}</h3>
                <button 
                  onClick={() => setSelectedStar(null)}
                  className="text-white/50 hover:text-white"
                >
                  ×
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Cover Placeholder */}
                <div className="aspect-[3/4] rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                  <LuStar className="w-16 h-16 text-white/20" />
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Type</span>
                    <NeonBadge color="purple" size="sm">{selectedStar.type}</NeonBadge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Year</span>
                    <span className="text-white">{selectedStar.year}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Match</span>
                    <span className="text-purple-400 font-bold">
                      {(selectedStar.similarityScore * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* DNA Visualization */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-white/80 flex items-center gap-2">
                    <LuDna className="w-4 h-4" />
                    Story DNA
                  </h4>
                  <div className="space-y-1">
                    {Object.entries(selectedStar.dna)
                      .filter(([key]) => key !== 'selectedGenes')
                      .map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-xs text-white/40 w-20">{translateDNAKey(key)}</span>
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                              style={{ width: `${value as number}%` }}
                            />
                          </div>
                          <span className="text-xs text-white/60 w-8">{value as number}%</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Genes */}
                <div className="flex flex-wrap gap-1">
                  {selectedStar.dna.selectedGenes.map((gene) => (
                    <span 
                      key={gene}
                      className="px-2 py-1 bg-purple-500/20 rounded text-xs text-purple-300"
                    >
                      {translateGene(gene)}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-4 space-y-2">
                  <button className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium flex items-center justify-center gap-2 transition-colors">
                    <LuExternalLink className="w-4 h-4" />
                    Read Now
                  </button>
                  <button className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium flex items-center justify-center gap-2 transition-colors">
                    <LuSparkles className="w-4 h-4" />
                    Add to Favorites
                  </button>
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
