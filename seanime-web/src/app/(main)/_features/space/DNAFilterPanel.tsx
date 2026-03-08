"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { dnaFiltersAtom, selectedStarAtom } from '@/app/(main)/_atoms/space.atoms';
import { GlassCard } from '@/components/anyverse/GlassCard';
import { HolographicButton } from '@/components/anyverse/HolographicButton';
import { LuDna, LuSparkles, LuRotateCcw } from 'react-icons/lu';

// Story Genes - Trope/Element Library
const STORY_GENES = [
  { id: 'system', label: 'نظام', icon: '⚙️', color: 'blue' },
  { id: 'leveling', label: 'تصنيف', icon: '📈', color: 'green' },
  { id: 'shadow-monarch', label: 'ملك الظل', icon: '👑', color: 'purple' },
  { id: 'dungeons', label: 'زنزانات', icon: '🏰', color: 'red' },
  { id: 'summoning', label: 'استدعاء', icon: '🔮', color: 'indigo' },
  { id: 'regression', label: 'عودة زمنية', icon: '⏰', color: 'cyan' },
  { id: 'tower', label: 'برج', icon: '🗼', color: 'orange' },
  { id: 'reincarnation', label: 'تناسخ', icon: '✨', color: 'pink' },
  { id: 'betrayal', label: 'خيانة', icon: '🗡️', color: 'red' },
  { id: 'guild', label: 'نقابة', icon: '🏛️', color: 'yellow' },
  { id: 'academy', label: 'أكاديمية', icon: '🎓', color: 'blue' },
  { id: 'romance', label: 'رومانسية', icon: '💕', color: 'pink' },
  { id: 'comedy', label: 'كوميديا', icon: '😄', color: 'yellow' },
  { id: 'dark', label: 'مظلم', icon: '🌑', color: 'gray' },
  { id: 'politics', label: 'سياسة', icon: '⚖️', color: 'purple' },
  { id: 'war', label: 'حرب', icon: '⚔️', color: 'red' },
];

export const DNAFilterPanel = () => {
  const [filters, setFilters] = useAtom(dnaFiltersAtom);
  const [selectedGenes, setSelectedGenes] = React.useState<string[]>([]);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleSliderChange = (key: keyof typeof filters, value: number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleGene = (geneId: string) => {
    setSelectedGenes((prev) =>
      prev.includes(geneId)
        ? prev.filter((g) => g !== geneId)
        : [...prev, geneId]
    );
  };

  const handleBigBang = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      // In production, this would call the cosmic search API
    }, 2000);
  };

  const resetFilters = () => {
    setFilters({
      heroArchetype: 50,
      worldSetting: 50,
      powerSystem: 50,
      conflictType: 50,
      romanceLevel: 30,
      comedyLevel: 40,
      darknessLevel: 50,
      mysteryLevel: 50,
      selectedGenes: [],
    });
    setSelectedGenes([]);
  };

  const sliders = [
    {
      key: 'heroArchetype',
      label: 'بطل العمل',
      leftLabel: 'ضعيف',
      rightLabel: 'مختار',
      color: 'from-blue-500 to-purple-500',
    },
    {
      key: 'worldSetting',
      label: 'عالم القصة',
      leftLabel: 'واقعي',
      rightLabel: 'خيالي',
      color: 'from-green-500 to-teal-500',
    },
    {
      key: 'powerSystem',
      label: 'نظام القوة',
      leftLabel: 'بدون',
      rightLabel: 'تقني',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      key: 'conflictType',
      label: 'نوع الصراع',
      leftLabel: 'داخلي',
      rightLabel: 'كوني',
      color: 'from-red-500 to-pink-500',
    },
    {
      key: 'romanceLevel',
      label: 'الرومانسية',
      leftLabel: 'بدون',
      rightLabel: 'مركزية',
      color: 'from-pink-500 to-rose-500',
    },
    {
      key: 'comedyLevel',
      label: 'الكوميديا',
      leftLabel: 'جاد',
      rightLabel: 'هزلي',
      color: 'from-yellow-400 to-amber-500',
    },
    {
      key: 'darknessLevel',
      label: 'الظلامية',
      leftLabel: 'مشرق',
      rightLabel: 'مظلم',
      color: 'from-gray-400 to-gray-800',
    },
    {
      key: 'mysteryLevel',
      label: 'الغموض',
      leftLabel: 'واضح',
      rightLabel: 'معقد',
      color: 'from-indigo-400 to-violet-600',
    },
  ];

  return (
    <GlassCard className="w-96 h-full flex flex-col overflow-hidden border-purple-500/30">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LuDna className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white">فلترة الجينات</h2>
        </div>
        <button
          onClick={resetFilters}
          className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          title="إعادة تعيين"
        >
          <LuRotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* DNA Sliders */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white/60 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            الحمض النووي للقصة
          </h3>
          
          {sliders.map((slider) => (
            <div key={slider.key} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40">{slider.leftLabel}</span>
                <span className="text-white font-medium">{slider.label}</span>
                <span className="text-white/40">{slider.rightLabel}</span>
              </div>
              
              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute h-full bg-gradient-to-r ${slider.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${filters[slider.key as keyof typeof filters]}%` }}
                  transition={{ type: "spring", stiffness: 100 }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters[slider.key as keyof typeof filters]}
                  onChange={(e) => handleSliderChange(slider.key as keyof typeof filters, parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              
              {/* Value indicator */}
              <div className="flex justify-center">
                <span className="text-xs text-purple-400 font-mono">
                  {filters[slider.key as keyof typeof filters]}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Story Genes */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white/60 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500" />
            الجينات القصصية
          </h3>
          
          <div className="grid grid-cols-4 gap-2">
            {STORY_GENES.map((gene) => {
              const isSelected = selectedGenes.includes(gene.id);
              return (
                <motion.button
                  key={gene.id}
                  onClick={() => toggleGene(gene.id)}
                  className={`p-2 rounded-lg border transition-all ${
                    isSelected
                      ? `bg-${gene.color}-500/30 border-${gene.color}-500/50 shadow-[0_0_10px_rgba(var(--color-${gene.color}),0.3)]`
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-2xl mb-1">{gene.icon}</div>
                  <div className={`text-[10px] ${isSelected ? 'text-white' : 'text-white/60'}`}>
                    {gene.label}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected Summary */}
        {selectedGenes.length > 0 && (
          <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
            <p className="text-xs text-purple-300 mb-2">الجينات المختارة:</p>
            <div className="flex flex-wrap gap-1">
              {selectedGenes.map((geneId) => {
                const gene = STORY_GENES.find((g) => g.id === geneId);
                return (
                  <span
                    key={geneId}
                    className="px-2 py-1 bg-purple-500/20 rounded text-xs text-white flex items-center gap-1"
                  >
                    {gene?.icon} {gene?.label}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Big Bang Button */}
      <div className="p-4 border-t border-white/10">
        <motion.button
          onClick={handleBigBang}
          disabled={isGenerating}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isGenerating ? (
            <>
              <motion.div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>جاري توليد الانفجار العظيم...</span>
            </>
          ) : (
            <>
              <LuSparkles className="w-5 h-5" />
              <span>انفجار عظيم! 🌌</span>
            </>
          )}
        </motion.button>
        
        <p className="text-center text-xs text-white/40 mt-2">
          سيتم إنشاء فضاء كوني مخصص بناءً على اختياراتك
        </p>
      </div>
    </GlassCard>
  );
};
