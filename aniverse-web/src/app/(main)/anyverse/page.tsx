"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { AnyverseHub } from '@/components/anyverse/AnyverseHub'
import { GlassCard } from '@/components/anyverse/GlassCard'
import { HolographicButton } from '@/components/anyverse/HolographicButton'
import { NeonBadge } from '@/components/anyverse/NeonBadge'
import { 
    LuGlobe, 
    LuVolume2, 
    LuEye, 
    LuMusic, 
    LuSparkles,
    LuSettings2,
    LuBrain,
    LuWand,
    LuPalette,
    LuMonitor,
    LuZap,
    LuRocket,
    LuStar
} from 'react-icons/lu'

export default function AnyversePage() {
    const [activeTab, setActiveTab] = React.useState<'localization' | 'voice' | 'visual' | 'ost'>('localization')

    const features = [
        {
            id: 'localization',
            title: 'Cultural Localization',
            description: 'Custom anime experience based on your culture',
            icon: LuGlobe,
            color: 'from-blue-500 via-cyan-500 to-teal-500',
            items: [
                { flag: '🇸🇦', label: 'Modern Standard', desc: 'Modern Standard Arabic' },
                { flag: '🇸🇦', label: 'Saudi', desc: 'Saudi Dialect' },
                { flag: '🇪🇬', label: 'Egyptian', desc: 'Egyptian Dialect' },
                { flag: '🇦🇪', label: 'Khaliji', desc: 'Khaliji Dialect' },
                { flag: '🇸🇾', label: 'Shami', desc: 'Levantine Dialect' },
                { flag: '🇲🇦', label: 'Maghrebi', desc: 'Maghrebi Dialect' },
            ]
        },
        {
            id: 'voice',
            title: 'Smart Voices',
            description: 'Characters that speak in your favorite dialect',
            icon: LuVolume2,
            color: 'from-violet-500 via-purple-500 to-fuchsia-500',
            items: [
                { icon: '👨', label: 'Hero', desc: 'Deep and powerful voice' },
                { icon: '👩', label: 'Heroine', desc: 'Soft and gentle voice' },
                { icon: '🦹', label: 'Villain', desc: 'Grand and mysterious voice' },
                { icon: '🤖', label: 'Robot', desc: 'Futuristic voice' },
                { icon: '🎭', label: 'Narrator', desc: 'Dramatic voice' },
            ]
        },
        {
            id: 'visual',
            title: 'Cinematic Perspective',
            description: 'Control the 3D viewing angle',
            icon: LuEye,
            color: 'from-pink-500 via-rose-500 to-red-500',
            items: [
                { icon: '👁️', label: 'Normal', desc: 'Viewer perspective' },
                { icon: '🎮', label: 'FPV', desc: 'Character perspective' },
                { icon: '🎬', label: 'Cinematic', desc: 'Professional angles' },
                { icon: '🚁', label: 'Aerial', desc: 'Top-down perspective' },
            ]
        },
        {
            id: 'ost',
            title: 'Interactive Music',
            description: 'Music that changes based on emotions',
            icon: LuMusic,
            color: 'from-amber-500 via-orange-500 to-yellow-500',
            items: [
                { icon: '🎵', label: 'Sad', desc: 'For emotional scenes' },
                { icon: '🥁', label: 'Action', desc: 'For battle scenes' },
                { icon: '🎹', label: 'Calm', desc: 'For romantic moments' },
                { icon: '🎸', label: 'Suspense', desc: 'For mystery and thrill' },
            ]
        },
    ]

    const activeFeature = features.find(f => f.id === activeTab) || features[0]

    return (
        <div className="min-h-screen bg-[#000000] relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                {/* Primary Purple Orb */}
                <motion.div 
                    className="absolute w-[900px] h-[900px] rounded-full opacity-30 blur-[150px]"
                    style={{
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
                        right: '-10%',
                        top: '-10%',
                    }}
                    animate={{
                        x: [0, -50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Secondary Purple Orb */}
                <motion.div 
                    className="absolute w-[700px] h-[700px] rounded-full opacity-25 blur-[120px]"
                    style={{
                        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, transparent 70%)',
                        left: '-5%',
                        bottom: '10%',
                    }}
                    animate={{
                        x: [0, 40, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.15, 1],
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Accent Cyan Orb */}
                <motion.div 
                    className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]"
                    style={{
                        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
                        left: '50%',
                        top: '50%',
                    }}
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -30, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Grid Pattern */}
                <div 
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            {/* Hero Section */}
            <section className="relative z-10 overflow-hidden">
                <div className="relative container mx-auto px-4 py-20 max-w-6xl">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-500/10 border border-violet-500/30 mb-8 backdrop-blur-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                                <LuSparkles className="w-4 h-4 text-violet-400" />
                            </motion.div>
                            <span className="text-sm text-violet-300 font-medium">Anyverse Ecosystem</span>
                        </motion.div>

                        <motion.h1 
                            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Anyverse{' '}
                            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Ecosystem
                            </span>
                        </motion.h1>

                        <motion.p 
                            className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            Smart Arabic Anime Platform with advanced AI technologies
                        </motion.p>

                        <motion.div
                            className="flex items-center justify-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <motion.button
                                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white font-medium shadow-lg shadow-violet-500/25"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <LuRocket className="w-5 h-5" />
                                Start Journey
                            </motion.button>
                            <motion.button
                                className="flex items-center gap-2 px-8 py-3 rounded-xl border border-white/20 text-white/80 font-medium hover:border-white/40 hover:text-white transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <LuStar className="w-5 h-5" />
                                Explore Features
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-1 space-y-3">
                        {features.map((feature) => {
                            const Icon = feature.icon
                            const isActive = activeTab === feature.id
                            
                            return (
                                <motion.button
                                    key={feature.id}
                                    onClick={() => setActiveTab(feature.id as any)}
                                    className={`w-full p-4 rounded-xl text-left transition-all ${
                                        isActive 
                                            ? 'bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/50' 
                                            : 'bg-gray-800/30 border border-gray-700/30 hover:border-gray-600'
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>
                                                {feature.title}
                                            </h3>
                                            <p className="text-xs text-gray-500">{feature.description}</p>
                                        </div>
                                    </div>
                                </motion.button>
                            )
                        })}
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <GlassCard className="p-6 h-full">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${activeFeature.color} flex items-center justify-center`}>
                                        <activeFeature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{activeFeature.title}</h2>
                                        <p className="text-gray-400">{activeFeature.description}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {activeFeature.items.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <HolographicButton
                                            active={index === 0}
                                            className="w-full h-full p-4 flex flex-col items-center text-center gap-2"
                                        >
                                            <span className="text-2xl">{(item as any).flag || (item as any).icon}</span>
                                            <div>
                                                <p className="font-semibold text-white">{item.label}</p>
                                                <p className="text-xs text-gray-400">{item.desc}</p>
                                            </div>
                                        </HolographicButton>
                                    </motion.div>
                                ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: LuBrain, label: 'AI Models', value: '5+' },
                        { icon: LuGlobe, label: 'Dialects', value: '6' },
                        { icon: LuWand, label: 'Effects', value: '50+' },
                        { icon: LuZap, label: 'Response', value: '<100ms' },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="text-center p-4 rounded-xl bg-gray-800/30 border border-gray-700/30"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <stat.icon className="w-6 h-6 text-violet-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-xs text-gray-500">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-8 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <GlassCard
                        variant="holographic"
                        glow
                        className="p-8 text-center"
                    >
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Ready for the new Experience?
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                            Start your journey in the world of anime with advanced AI technologies
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <HolographicButton active className="px-8 py-3">
                                <LuSettings2 className="w-5 h-5 mr-2" />
                                Enable Anyverse
                            </HolographicButton>
                            <button className="px-8 py-3 rounded-lg border border-gray-600 text-gray-300 hover:border-gray-500 transition-colors">
                                Learn More
                            </button>
                        </div>
                    </GlassCard>
                </motion.div>
            </section>
        </div>
    )
}
