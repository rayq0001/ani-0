"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { galaxyClustersAtom, selectedStarAtom } from '@/app/(main)/_atoms/space.atoms';
import { GlassCard } from '@/components/anyverse/GlassCard';
import { NeonBadge } from '@/components/anyverse/NeonBadge';
import { LuOrbit, LuArrowRight, LuSparkles } from 'react-icons/lu';

export const GalaxyClusters = () => {
  const [clusters] = useAtom(galaxyClustersAtom);
  const [selectedStar, setSelectedStar] = useAtom(selectedStarAtom);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <LuOrbit className="w-6 h-6 text-purple-400" />
          المجرات المتشابهة
        </h2>
        <p className="text-white/60">استكشف الأعمال المصنفة في مجموعات مجرية حسب النوع والتشابه</p>
      </div>

      {/* Galaxy Grid */}
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-20">
        {clusters.map((galaxy, index) => (
          <motion.div
            key={galaxy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard 
              className="h-full group cursor-pointer overflow-hidden relative"
              style={{ borderColor: `${galaxy.color}40` }}
            >
              {/* Galaxy Visual */}
              <div className="absolute inset-0 opacity-20">
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl"
                  style={{ background: `radial-gradient(circle, ${galaxy.color} 0%, transparent 70%)` }}
                />
                {/* Orbiting stars */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ 
                      background: galaxy.color,
                      top: '50%',
                      left: '50%',
                    }}
                    animate={{
                      x: Math.cos(i * 1.2) * 80,
                      y: Math.sin(i * 1.2) * 60,
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{galaxy.name}</h3>
                    <p className="text-sm text-white/50">{galaxy.nameEn}</p>
                  </div>
                  <NeonBadge 
                    color="purple" 
                    size="sm"
                    style={{ backgroundColor: `${galaxy.color}30`, borderColor: galaxy.color }}
                  >
                    {galaxy.stars.length || Math.floor(Math.random() * 50) + 20} عمل
                  </NeonBadge>
                </div>

                <p className="text-white/70 text-sm mb-6 flex-1">{galaxy.description}</p>

                {/* Preview Stars */}
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-10 rounded bg-white/10 flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${galaxy.color}20 0%, transparent 100%)`,
                      }}
                    />
                  ))}
                  <span className="text-xs text-white/40 mr-2">+المزيد</span>
                </div>

                {/* Enter Button */}
                <motion.button
                  className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-2 group-hover:gap-3 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>استكشف المجرة</span>
                  <LuArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        ))}

        {/* Create Custom Galaxy Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: clusters.length * 0.1 }}
        >
          <GlassCard className="h-full flex flex-col items-center justify-center p-6 border-dashed border-2 border-purple-500/30 hover:border-purple-500/60 cursor-pointer transition-colors">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
              <LuSparkles className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">مجرة مخصصة</h3>
            <p className="text-sm text-white/50 text-center mb-4">
              أنشئ مجموعتك الخاصة من الأعمال المفضلة
            </p>
            <button className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm transition-colors">
              إنشاء مجرة جديدة
            </button>
          </GlassCard>
        </motion.div>
      </div>

      {/* Featured Galaxy Banner */}
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard className="p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">✨ اكتشاف اليوم</h3>
              <p className="text-white/70">مجرة "أبطال النظام" - أعمال مشابهة لـ Solo Leveling بنسبة 85%</p>
            </div>
            <motion.button
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>استكشف الآن</span>
              <LuArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
