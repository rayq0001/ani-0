"use client"

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    LuSearch, 
    LuSparkles, 
    LuBookOpen, 
    LuTv, 
    LuFileText,
    LuArrowRight,
    LuRotateCcw,
    LuWand
} from 'react-icons/lu'

// Types for search results
interface PlanetContent {
    anime?: any
    manga?: any
    novel?: any
    aiStory?: string
}

export default function GalaxySearch() {
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [showPlanet, setShowPlanet] = useState(false)
    const [planetData, setPlanetData] = useState<PlanetContent | null>(null)
    const [selectedSatellite, setSelectedSatellite] = useState<'anime' | 'manga' | 'novel' | 'story'>('anime')

    // Generate stars for galaxy background
    const stars = Array.from({ length: 200 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        delay: Math.random() * 3
    }))

    // Nebula clouds
    const nebulae = [
        { id: 1, x: 20, y: 30, color: 'from-violet-600/30', size: 400 },
        { id: 2, x: 70, y: 60, color: 'from-purple-600/25', size: 350 },
        { id: 3, x: 50, y: 20, color: 'from-blue-600/20', size: 300 },
        { id: 4, x: 80, y: 80, color: 'from-pink-600/20', size: 250 },
    ]

    const handleSearch = useCallback(async () => {
        if (!searchQuery.trim()) return
        
        setIsSearching(true)
        
        // Simulate search delay and data fetching
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Mock data - in real implementation, this would come from API
        setPlanetData({
            anime: {
                title: searchQuery,
                image: '/api/placeholder/300/450',
                rating: 9.2,
                episodes: 1070,
                status: 'Ongoing',
                synopsis: 'قصة ملحمية عن قراصنة يبحثون عن كنز أسطوري'
            },
            manga: {
                title: searchQuery + ' (Manga)',
                chapters: 1100,
                status: 'Ongoing',
                image: '/api/placeholder/300/450'
            },
            novel: {
                title: searchQuery + ' (Novel)',
                chapters: 500,
                status: 'Completed',
                image: '/api/placeholder/300/450'
            },
            aiStory: `في عالم بعيد، حيث البحار تتصارع والأحلام تتحقق... 

كان هناك قرصان شاب يُدعى لوفي، يحلم بأن يصبح ملك القراصنة. في رحلته، التقى بأصدقاء أوفياء وواجه أعداءً أقوياء.

"الحرية هي أغلى شيء في العالم" - كان هذا شعاره دائماً.

في يوم من الأيام، اكتشف لوفي سراً قديماً يتعلق بتاريخ العالم المفقود، مما قاده إلى مغامرة جديدة مليئة بالمخاطر والاكتشافات...`
        })
        
        setShowPlanet(true)
        setIsSearching(false)
    }, [searchQuery])

    const resetSearch = () => {
        setShowPlanet(false)
        setPlanetData(null)
        setSearchQuery('')
        setSelectedSatellite('anime')
    }

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#000000]">
            {/* Galaxy Background */}
            <div className="absolute inset-0">
                {/* Animated Nebulae */}
                {nebulae.map((nebula) => (
                    <motion.div
                        key={nebula.id}
                        className={`absolute rounded-full bg-gradient-radial ${nebula.color} to-transparent blur-[100px]`}
                        style={{
                            left: `${nebula.x}%`,
                            top: `${nebula.y}%`,
                            width: nebula.size,
                            height: nebula.size,
                            transform: 'translate(-50%, -50%)'
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: 20 + nebula.id * 5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}

                {/* Stars */}
                {stars.map((star) => (
                    <motion.div
                        key={star.id}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: star.size,
                            height: star.size,
                            opacity: star.opacity
                        }}
                        animate={{
                            opacity: [star.opacity, star.opacity * 0.3, star.opacity],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 2 + star.delay,
                            repeat: Infinity,
                            delay: star.delay
                        }}
                    />
                ))}

                {/* Galaxy Center Glow */}
                <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-violet-500/20 via-purple-500/10 to-transparent blur-[80px]"
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 360]
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
                <AnimatePresence mode="wait">
                    {!showPlanet ? (
                        /* Galaxy View - Search Interface */
                        <motion.div
                            key="galaxy"
                            className="text-center w-full max-w-2xl"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.5, y: -100 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Title */}
                            <motion.h1 
                                className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                الفضاء{' '}
                                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    اللامحدود
                                </span>
                            </motion.h1>

                            <motion.p 
                                className="text-white/50 text-lg mb-12"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                اكتشف عوالم الأنمي والمانجا في مجرات بصرية
                            </motion.p>

                            {/* Search Box */}
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        placeholder="ابحث عن أنمي، مانجا، أو رواية..."
                                        className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-5 pr-14 text-white text-lg placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                                        dir="rtl"
                                    />
                                    <button
                                        onClick={handleSearch}
                                        disabled={isSearching || !searchQuery.trim()}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                                    >
                                        {isSearching ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            >
                                                <LuSparkles className="w-5 h-5" />
                                            </motion.div>
                                        ) : (
                                            <LuSearch className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>

                                {/* Quick Suggestions */}
                                <motion.div 
                                    className="flex flex-wrap items-center justify-center gap-2 mt-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <span className="text-white/30 text-sm">اقتراحات:</span>
                                    {['ون بيس', 'ناروتو', 'هجوم العمالقة', 'ديمون سلاير'].map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            onClick={() => {
                                                setSearchQuery(suggestion)
                                                handleSearch()
                                            }}
                                            className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 hover:text-white transition-all"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        /* Planet View - Results */
                        <motion.div
                            key="planet"
                            className="w-full max-w-6xl"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, type: "spring" }}
                        >
                            {/* Planet Header */}
                            <div className="flex items-center justify-between mb-8">
                                <motion.button
                                    onClick={resetSearch}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all"
                                    whileHover={{ x: -5 }}
                                >
                                    <LuRotateCcw className="w-4 h-4" />
                                    <span>العودة للمجرات</span>
                                </motion.button>

                                <div className="text-center">
                                    <h2 className="text-3xl font-bold text-white mb-1">
                                        كوكب {searchQuery}
                                    </h2>
                                    <p className="text-white/40 text-sm">استكشف المحتوى المرتبط</p>
                                </div>

                                <div className="w-32" />
                            </div>

                            {/* Planet Visualization */}
                            <div className="relative flex items-center justify-center mb-12">
                                {/* Orbit Rings */}
                                <motion.div
                                    className="absolute w-[500px] h-[500px] rounded-full border border-white/5"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                />
                                <motion.div
                                    className="absolute w-[400px] h-[400px] rounded-full border border-white/10"
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                />
                                <motion.div
                                    className="absolute w-[300px] h-[300px] rounded-full border border-white/5"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                />

                                {/* Central Planet */}
                                <motion.div
                                    className="relative w-48 h-48 rounded-full bg-gradient-to-br from-violet-500 via-purple-600 to-pink-500 shadow-2xl shadow-violet-500/50"
                                    animate={{
                                        boxShadow: [
                                            '0 0 60px rgba(139, 92, 246, 0.5)',
                                            '0 0 100px rgba(139, 92, 246, 0.8)',
                                            '0 0 60px rgba(139, 92, 246, 0.5)'
                                        ]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    {/* Planet Surface Texture */}
                                    <div className="absolute inset-0 rounded-full overflow-hidden opacity-30">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20" />
                                    </div>
                                    
                                    {/* Planet Label */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg drop-shadow-lg">
                                            {searchQuery}
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Satellites */}
                                {[
                                    { id: 'anime', icon: LuTv, label: 'الأنمي', color: 'from-blue-500 to-cyan-500', angle: 0 },
                                    { id: 'manga', icon: LuBookOpen, label: 'المانجا', color: 'from-violet-500 to-purple-500', angle: 90 },
                                    { id: 'novel', icon: LuFileText, label: 'الرواية', color: 'from-pink-500 to-rose-500', angle: 180 },
                                    { id: 'story', icon: LuWand, label: 'قصة AI', color: 'from-amber-500 to-orange-500', angle: 270 },
                                ].map((satellite, index) => {
                                    const Icon = satellite.icon
                                    const isSelected = selectedSatellite === satellite.id
                                    const radius = 200
                                    const x = Math.cos((satellite.angle * Math.PI) / 180) * radius
                                    const y = Math.sin((satellite.angle * Math.PI) / 180) * radius

                                    return (
                                        <motion.button
                                            key={satellite.id}
                                            className={`absolute w-16 h-16 rounded-full bg-gradient-to-r ${satellite.color} flex flex-col items-center justify-center gap-1 shadow-lg transition-all ${isSelected ? 'scale-125 z-20' : 'scale-100 opacity-70 hover:opacity-100'}`}
                                            style={{
                                                x,
                                                y,
                                            }}
                                            onClick={() => setSelectedSatellite(satellite.id as any)}
                                            whileHover={{ scale: isSelected ? 1.25 : 1.1 }}
                                            animate={{
                                                x: [x, x + 5, x],
                                                y: [y, y + 5, y],
                                            }}
                                            transition={{
                                                duration: 4 + index,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <Icon className="w-6 h-6 text-white" />
                                            <span className="text-[10px] text-white font-medium">{satellite.label}</span>
                                        </motion.button>
                                    )
                                })}
                            </div>

                            {/* Content Panel */}
                            <motion.div
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <AnimatePresence mode="wait">
                                    {selectedSatellite === 'anime' && planetData?.anime && (
                                        <motion.div
                                            key="anime"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="flex gap-6"
                                        >
                                            <div className="w-48 h-72 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                                                <LuTv className="w-16 h-16 text-white/20" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <h3 className="text-2xl font-bold text-white">{planetData.anime.title}</h3>
                                                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                                                        {planetData.anime.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-6 mb-4 text-white/60">
                                                    <span>⭐ {planetData.anime.rating}</span>
                                                    <span>📺 {planetData.anime.episodes} حلقة</span>
                                                </div>
                                                <p className="text-white/70 leading-relaxed mb-6">
                                                    {planetData.anime.synopsis}
                                                </p>
                                                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all">
                                                    مشاهدة الأنمي
                                                    <LuArrowRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {selectedSatellite === 'manga' && planetData?.manga && (
                                        <motion.div
                                            key="manga"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="flex gap-6"
                                        >
                                            <div className="w-48 h-72 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                                                <LuBookOpen className="w-16 h-16 text-white/20" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-white mb-4">{planetData.manga.title}</h3>
                                                <div className="flex items-center gap-6 mb-4 text-white/60">
                                                    <span>📖 {planetData.manga.chapters} فصل</span>
                                                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                                                        {planetData.manga.status}
                                                    </span>
                                                </div>
                                                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all">
                                                    قراءة المانجا
                                                    <LuArrowRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {selectedSatellite === 'novel' && planetData?.novel && (
                                        <motion.div
                                            key="novel"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="flex gap-6"
                                        >
                                            <div className="w-48 h-72 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-white/10 flex items-center justify-center">
                                                <LuFileText className="w-16 h-16 text-white/20" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-white mb-4">{planetData.novel.title}</h3>
                                                <div className="flex items-center gap-6 mb-4 text-white/60">
                                                    <span>📚 {planetData.novel.chapters} فصل</span>
                                                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                                                        {planetData.novel.status}
                                                    </span>
                                                </div>
                                                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all">
                                                    قراءة الرواية
                                                    <LuArrowRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {selectedSatellite === 'story' && planetData?.aiStory && (
                                        <motion.div
                                            key="story"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                        >
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                                                    <LuWand className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white">قصة أصلية بقلم AI</h3>
                                                    <p className="text-white/40 text-sm">مستوحاة من عالم {searchQuery}</p>
                                                </div>
                                            </div>
                                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                                <p className="text-white/80 leading-loose text-lg whitespace-pre-line">
                                                    {planetData.aiStory}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
