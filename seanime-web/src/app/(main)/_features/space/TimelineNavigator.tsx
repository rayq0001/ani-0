"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';
import { timelineYearRangeAtom, timelineSelectedWorkAtom } from '@/app/(main)/_atoms/space.atoms';
import { GlassCard } from '@/components/anyverse/GlassCard';
import { NeonBadge } from '@/components/anyverse/NeonBadge';
import { LuClock, LuArrowRight, LuArrowLeft, LuBook, LuTv, LuGamepad2 } from 'react-icons/lu';

// Mock timeline data
const TIMELINE_DATA = [
  {
    year: 2016,
    works: [
      {
        id: 'solo-leveling-novel',
        title: 'Solo Leveling Novel',
        type: 'novel',
        chapter: 1,
        relation: 'original',
        color: '#8B5CF6',
      },
    ],
  },
  {
    year: 2018,
    works: [
      {
        id: 'solo-leveling-manhwa',
        title: 'Solo Leveling Manhwa',
        type: 'manhwa',
        chapter: 1,
        relation: 'adaptation',
        color: '#10B981',
      },
    ],
  },
  {
    year: 2020,
    works: [
      {
        id: 'solo-leveling-game',
        title: 'Solo Leveling: ARISE',
        type: 'game',
        chapter: 1,
        relation: 'spinoff',
        color: '#F59E0B',
      },
    ],
  },
  {
    year: 2024,
    works: [
      {
        id: 'solo-leveling-anime-s1',
        title: 'Solo Leveling Anime S1',
        type: 'anime',
        chapter: 1,
        relation: 'adaptation',
        color: '#3B82F6',
      },
      {
        id: 'solo-leveling-ragnarok',
        title: 'Solo Leveling: Ragnarok',
        type: 'manhwa',
        chapter: 1,
        relation: 'sequel',
        color: '#EC4899',
      },
    ],
  },
];

const TYPE_ICONS = {
  novel: LuBook,
  manhwa: LuBook,
  manga: LuBook,
  anime: LuTv,
  game: LuGamepad2,
};

const TYPE_LABELS = {
  novel: 'رواية',
  manhwa: 'مانهوا',
  manga: 'مانجا',
  anime: 'أنمي',
  game: 'لعبة',
};

const RELATION_LABELS = {
  original: 'أصلي',
  adaptation: 'اقتباس',
  sequel: 'تتمة',
  spinoff: 'فرعي',
  prequel: 'ما قبل الأحداث',
};

export const TimelineNavigator = () => {
  const [yearRange, setYearRange] = useAtom(timelineYearRangeAtom);
  const [selectedWork, setSelectedWork] = useAtom(timelineSelectedWorkAtom);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const minYear = Math.min(...TIMELINE_DATA.map(d => d.year));
  const maxYear = Math.max(...TIMELINE_DATA.map(d => d.year));
  const yearSpan = maxYear - minYear;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <LuClock className="w-6 h-6 text-purple-400" />
            السفر عبر الزمن
          </h2>
          <p className="text-white/60">تتبع تطور الأعمال عبر السنوات والأبعاد المختلفة</p>
        </div>
        
        {/* Year Range Selector */}
        <div className="flex items-center gap-4 bg-black/40 px-4 py-2 rounded-full border border-white/10">
          <button 
            onClick={() => setYearRange(prev => ({ ...prev, from: Math.max(minYear, prev.from - 1) }))}
            className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white"
          >
            <LuArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-white font-mono">{yearRange.from} - {yearRange.to}</span>
          <button 
            onClick={() => setYearRange(prev => ({ ...prev, to: Math.min(maxYear, prev.to + 1) }))}
            className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white"
          >
            <LuArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="flex-1 relative overflow-hidden">
        {/* Timeline Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-blue-500/50 rounded-full" />

        {/* Year Nodes */}
        <div className="absolute inset-0 flex items-center justify-between px-12">
          {TIMELINE_DATA.map((data, index) => {
            const position = ((data.year - minYear) / yearSpan) * 100;
            const isInRange = data.year >= yearRange.from && data.year <= yearRange.to;
            
            return (
              <motion.div
                key={data.year}
                className="absolute"
                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isInRange ? 1 : 0.3, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Year Marker */}
                <motion.div
                  className="relative cursor-pointer"
                  onHoverStart={() => setHoveredYear(data.year)}
                  onHoverEnd={() => setHoveredYear(null)}
                  whileHover={{ scale: 1.2 }}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
                  
                  {/* Year Label */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="text-lg font-bold text-white">{data.year}</span>
                  </div>

                  {/* Works for this year */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    {data.works.map((work, workIndex) => {
                      const Icon = TYPE_ICONS[work.type as keyof typeof TYPE_ICONS] || LuBook;
                      return (
                        <motion.div
                          key={work.id}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + workIndex * 0.05 }}
                        >
                          <GlassCard
                            className="p-3 cursor-pointer hover:scale-105 transition-transform w-48"
                            style={{ borderColor: `${work.color}50` }}
                            onClick={() => setSelectedWork(work as any)}
                          >
                            <div className="flex items-start gap-3">
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${work.color}20` }}
                              >
                                <Icon className="w-5 h-5" style={{ color: work.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{work.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <NeonBadge 
                                    size="sm" 
                                    color="purple"
                                    style={{ backgroundColor: `${work.color}30`, fontSize: '10px' }}
                                  >
                                    {TYPE_LABELS[work.type as keyof typeof TYPE_LABELS]}
                                  </NeonBadge>
                                </div>
                              </div>
                            </div>
                            
                            {/* Relation Tag */}
                            <div className="mt-2 pt-2 border-t border-white/10">
                              <span className="text-xs text-white/50">
                                {RELATION_LABELS[work.relation as keyof typeof RELATION_LABELS]}
                              </span>
                            </div>
                          </GlassCard>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Connection Lines to Next Year */}
                  {index < TIMELINE_DATA.length - 1 && (
                    <svg 
                      className="absolute top-1/2 left-4 w-32 h-20 pointer-events-none"
                      style={{ transform: 'translateY(-50%)' }}
                    >
                      <path
                        d="M 0 40 Q 64 10, 128 40"
                        fill="none"
                        stroke="url(#timelineGradient)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        opacity="0.5"
                      />
                      <defs>
                        <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
                          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="1" />
                          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected Work Detail */}
      <AnimatePresence>
        {selectedWork && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="mt-6"
          >
            <GlassCard className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${(selectedWork as any).color}20` }}
                  >
                    {React.createElement(
                      TYPE_ICONS[(selectedWork as any).type as keyof typeof TYPE_ICONS] || LuBook,
                      { className: "w-8 h-8", style: { color: (selectedWork as any).color } }
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{(selectedWork as any).title}</h3>
                    <div className="flex items-center gap-3">
                      <NeonBadge color="purple">{(selectedWork as any).year}</NeonBadge>
                      <span className="text-white/60">
                        {TYPE_LABELS[(selectedWork as any).type as keyof typeof TYPE_LABELS]}
                      </span>
                      <span className="text-white/40">•</span>
                      <span className="text-white/60">
                        {RELATION_LABELS[(selectedWork as any).relation as keyof typeof RELATION_LABELS]}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedWork(null)}
                  className="text-white/40 hover:text-white"
                >
                  ×
                </button>
              </div>

              {/* Cross-Dimension Links */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-white/60 mb-3">الأبعاد المتاحة:</p>
                <div className="flex gap-3">
                  {Object.entries(TYPE_LABELS).map(([type, label]) => {
                    const Icon = TYPE_ICONS[type as keyof typeof TYPE_ICONS];
                    const isActive = type === (selectedWork as any).type;
                    return (
                      <button
                        key={type}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                          isActive 
                            ? 'bg-purple-500/30 border-purple-500/50 text-white' 
                            : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm text-white/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span>رواية</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>مانهوا</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>أنمي</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>لعبة</span>
        </div>
      </div>
    </div>
  );
};
