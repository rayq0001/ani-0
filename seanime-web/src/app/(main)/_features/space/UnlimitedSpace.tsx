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

export const UnlimitedSpace = () => {
    const [isOpen, setIsOpen] = useAtom(spaceModeAtom);
    const [activeView, setActiveView] = useState<'galaxy' | 'dna' | 'timeline' | 'visual'>('galaxy');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [setIsOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-[#0a0a0f] overflow-hidden"
            >
                {/* Animated Starfield Background */}
                <canvas 
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 50%, #000000 100%)' }}
                />

                {/* Nebula Effects */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-600/10 rounded-full blur-[80px] animate-pulse delay-500" />
                </div>

                {/* Header */}
                <motion.header 
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <motion.div 
                            className="flex items-center gap-3 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-purple-500/30"
                            whileHover={{ scale: 1.02 }}
                        >
                            <LuOrbit className="w-6 h-6 text-purple-400 animate-spin-slow" />
                            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                                الفضاء اللامحدود
                            </h1>
                            <NeonBadge color="purple" size="sm">Pro</NeonBadge>
                        </motion.div>

                        {/* Search Bar */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="ابحث في الكون..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-80 bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-full px-4 py-2 pr-10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60 transition-all"
                                dir="rtl"
                            />
                            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                        </div>
                    </div>

                    {/* View Switcher */}
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl p-1 rounded-full border border-purple-500/30">
                        {[
                            { id: 'galaxy', icon: LuOrbit, label: 'المجرات' },
                            { id: 'dna', icon: LuDna, label: 'الجينات' },
                            { id: 'timeline', icon: LuClock, label: 'الزمن' },
                            { id: 'visual', icon: LuImage, label: 'صورة' },
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

                    {/* Close Button */}
                    <motion.button
                        onClick={() => setIsOpen(false)}
                        className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
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
                                    <h3 className="text-xl font-bold text-white mb-2">البحث بالصور</h3>
                                    <p className="text-white/60 mb-6">ارفع صورة شخصية أو مشهد لإيجاد العمل الأصلي</p>
                                    <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-8 hover:border-purple-500/60 transition-colors cursor-pointer">
                                        <p className="text-purple-400">اسحب الصورة هنا أو انقر للاختيار</p>
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
                            التوقيع الشعوري
                        </span>
                        <div className="flex items-center gap-4">
                            {[
                                { label: 'حزن', color: 'bg-blue-500', value: 20 },
                                { label: 'حماس', color: 'bg-red-500', value: 80 },
                                { label: 'كوميديا', color: 'bg-yellow-500', value: 40 },
                                { label: 'غموض', color: 'bg-purple-500', value: 60 },
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
                        <p>اضغط ESC للخروج • اسحب للتنقل • اضغط على النجوم للتفاصيل</p>
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
            className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 
                      shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center text-white group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
                boxShadow: [
                    '0 0 20px rgba(139,92,246,0.4)',
                    '0 0 40px rgba(139,92,246,0.6)',
                    '0 0 20px rgba(139,92,246,0.4)'
                ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
        >
            <LuOrbit className="w-6 h-6 group-hover:animate-spin" />
            
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 px-3 py-1 rounded-lg text-xs text-white/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                الفضاء اللامحدود
            </div>
        </motion.button>
    );
};
