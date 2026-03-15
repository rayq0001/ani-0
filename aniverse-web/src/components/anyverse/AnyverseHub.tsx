"use client"

import React from 'react';
import { useAtom } from 'jotai';
import { anyverseAtom } from '@/app/(main)/_atoms/anyverse.atoms';
import { GlassCard } from './GlassCard';
import { HolographicButton } from './HolographicButton';
import { NeonBadge } from './NeonBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LuGlobe, 
    LuVolume2, 
    LuEye, 
    LuMusic, 
    LuSparkles,
    LuX,
    LuSettings2
} from 'react-icons/lu';

export const AnyverseHub = () => {
    const [config, setConfig] = useAtom(anyverseAtom);
    const [isOpen, setIsOpen] = React.useState(false);

    const dialects = [
        { id: 'classical', label: 'Classical Arabic', flag: '🇸🇦' },
        { id: 'saudi', label: 'Saudi', flag: '🇸🇦' },
        { id: 'egyptian', label: 'Egyptian', flag: '🇪🇬' },
        { id: 'gulf', label: 'Gulf', flag: '🇦🇪' },
        { id: 'levantine', label: 'Levantine', flag: '🇸🇾' },
        { id: 'maghrebi', label: 'Maghrebi', flag: '🇲🇦' },
    ];

    const voices = [
        { id: 'male_deep', label: 'Hero (Deep)', icon: '👨' },
        { id: 'female_soft', label: 'Heroine (Soft)', icon: '👩' },
        { id: 'villain', label: 'Villain (Grand)', icon: '🦹' },
        { id: 'robot', label: 'Robot (Future)', icon: '🤖' },
        { id: 'narrator', label: 'Narrator (Drama)', icon: '🎭' },
    ];

    const perspectives = [
        { id: 'normal', label: 'Normal', icon: LuEye },
        { id: 'fpv', label: 'Character View', icon: LuEye },
        { id: 'cinematic', label: 'Cinematic', icon: LuSparkles },
        { id: 'aerial', label: 'Aerial', icon: LuEye },
    ];

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-[9999] w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center text-white shadow-[0_0_40px_rgba(139,92,246,0.7)] backdrop-blur-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Rotating Edge */}
                <motion.div
                    className="absolute w-[200%] h-[200%] pointer-events-none mix-blend-screen opacity-80"
                    style={{
                        background: "conic-gradient(from 0deg, transparent 0 200deg, #8b5cf6 320deg, transparent 360deg)",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Inner dynamic breathing glow orb */}
                <motion.div
                    className="absolute inset-0 pointer-events-none mix-blend-screen"
                    style={{
                        background: "radial-gradient(circle at center, rgba(139,92,246,0.7) 0%, transparent 60%)"
                    }}
                    animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Inner glass layer - Translucent to let the inner glow out */}
                <div className="absolute inset-[2px] rounded-[14px] bg-[#0a0412]/40 backdrop-blur-md flex items-center justify-center shadow-[inset_0_0_35px_rgba(139,92,246,0.5)]">
                    {isOpen ? <LuX className="w-7 h-7 text-purple-300 drop-shadow-[0_0_8px_rgba(216,180,254,0.8)]" /> : <LuSparkles className="w-7 h-7 text-purple-300 drop-shadow-[0_0_8px_rgba(216,180,254,0.8)]" />}
                </div>
            </motion.button>

            {/* Hub Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed bottom-24 right-6 z-50"
                    >
                        <GlassCard className="w-80 p-5 border-purple-500/30 shadow-[0_0_50px_rgba(139,92,246,0.2)]">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                                    <LuSparkles className="w-5 h-5 text-violet-400" />
                                    Aniverse Ecosystem
                                </h3>
                                <NeonBadge color="purple">Pro</NeonBadge>
                            </div>
                            
                            <div className="space-y-5">
                                {/* 1. Cultural Localization (Dialects) */}
                                <section>
                                    <label className="text-xs text-gray-400 mb-2 block flex items-center gap-1">
                                        <LuGlobe className="w-3 h-3" />
                                        Culture & Dialect
                                    </label>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {dialects.map((d) => (
                                            <HolographicButton 
                                                key={d.id}
                                                size="sm"
                                                active={config.dialect === d.id}
                                                onClick={() => setConfig({...config, dialect: d.id})}
                                                className="text-[10px] py-1.5"
                                            >
                                                <span className="mr-1">{d.flag}</span>
                                                {d.label}
                                            </HolographicButton>
                                        ))}
                                    </div>
                                </section>

                                {/* 2. Voice Customization (AI Voices) */}
                                <section>
                                    <label className="text-xs text-gray-400 mb-2 block flex items-center gap-1">
                                        <LuVolume2 className="w-3 h-3" />
                                        Voice Tone
                                    </label>
                                    <select 
                                        className="w-full bg-black/40 border border-violet-500/30 text-white p-2.5 rounded-lg text-sm 
                                                   focus:outline-none focus:border-violet-500/60 transition-colors"
                                        value={config.voiceType}
                                        onChange={(e) => setConfig({...config, voiceType: e.target.value})}
                                    >
                                        {voices.map((v) => (
                                            <option key={v.id} value={v.id} className="bg-gray-900">
                                                {v.icon} {v.label}
                                            </option>
                                        ))}
                                    </select>
                                </section>

                                {/* 3. Cinematic Perspective (AI Director) */}
                                <section>
                                    <label className="text-xs text-gray-400 mb-2 block flex items-center gap-1">
                                        <LuEye className="w-3 h-3" />
                                        View Angle (3D)
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {perspectives.map((p) => {
                                            const Icon = p.icon;
                                            return (
                                                <button 
                                                    key={p.id}
                                                    className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all
                                                        ${config.perspective === p.id 
                                                            ? 'bg-violet-500/30 border border-violet-500 text-violet-300' 
                                                            : 'bg-black/30 border border-gray-700 text-gray-500 hover:border-gray-600'}`}
                                                    onClick={() => setConfig({...config, perspective: p.id})}
                                                >
                                                    <Icon className="w-3.5 h-3.5" />
                                                    {p.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </section>

                                {/* 4. Dynamic OST Toggle */}
                                <section className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <LuMusic className="w-4 h-4 text-pink-400" />
                                        <span className="text-sm text-gray-300">Interactive Music</span>
                                    </div>
                                    <button
                                        onClick={() => setConfig({...config, ostEnabled: !config.ostEnabled})}
                                        className={`w-10 h-5 rounded-full transition-colors relative
                                            ${config.ostEnabled ? 'bg-pink-500' : 'bg-gray-700'}`}
                                    >
                                        <motion.div 
                                            className="w-4 h-4 bg-white rounded-full absolute top-0.5"
                                            animate={{ left: config.ostEnabled ? '22px' : '2px' }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    </button>
                                </section>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

