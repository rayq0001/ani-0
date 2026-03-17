"use client"

import { useComics, ComicsType } from "@/app/(main)/comics/_lib/useComics"
import { motion, AnimatePresence } from "framer-motion"
import React, { useState, useEffect } from "react"
import { 
    GiCrystalGrowth, 
    GiSamuraiHelmet, 
    GiSwordClash, 
    GiHearts, 
    GiStarSwirl,
    GiSmokeBomb,
    GiFire,
    GiTrophy,
    GiCrown,
    GiSparkles,
    GiBookshelf,
    GiTimeBomb
} from "react-icons/gi"
import { BiSearch, BiBookOpen, BiFilter, BiTrendingUp, BiStar, BiTime } from "react-icons/bi"
import { FiChevronRight, FiChevronLeft } from "react-icons/fi"
import { useThemeSettings } from "@/lib/theme/theme-hooks"
import { useRouter } from "@/lib/navigation"

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 12
        }
    }
}

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
        }
    }
}

export default function Page() {
    const router = useRouter()
    const themeSettings = useThemeSettings()
    const accentColor = themeSettings.accentColor || "#8B5CF6"
    
    const {
        entries,
        currentList,
        isLoading,
        currentType,
        setCurrentType,
        searchQuery,
        setSearchQuery,
        genres,
        selectedGenres,
        toggleGenre,
        clearFilters,
        hasComics,
        currentCount,
        totalCount,
        stats,
    } = useComics()

    const [featuredIndex, setFeaturedIndex] = useState(0)
    const [activeSection, setActiveSection] = useState<"trending" | "top" | "new" | "all">("all")
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    // Mouse parallax effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            })
        }
        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    const typeLabels: Record<ComicsType, { title: string; subtitle: string; color: string }> = {
        manga: { 
            title: "Manga", 
            subtitle: "Japanese Comics", 
            color: "#EF4444"
        },
        manhwa: { 
            title: "Manhwa", 
            subtitle: "Korean Comics", 
            color: "#3B82F6"
        },
        manhua: { 
            title: "Manhua", 
            subtitle: "Chinese Comics", 
            color: "#10B981"
        },
    }

    const currentLabel = typeLabels[currentType]

    // Use entries directly from the new API
    const filteredEntries = entries

    // Featured comics (first 5 from current list)
    const featuredComics = filteredEntries.slice(0, 5)

    // Auto-rotate featured
    useEffect(() => {
        if (featuredComics.length > 1) {
            const interval = setInterval(() => {
                setFeaturedIndex(prev => (prev + 1) % featuredComics.length)
            }, 5000)
            return () => clearInterval(interval)
        }
    }, [featuredComics.length])

    // Trending - by popularity (using score as proxy)
    const trendingComics = React.useMemo(() => {
        return [...filteredEntries]
            .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
            .slice(0, 12)
    }, [filteredEntries])

    // Top Rated - by mean score
    const topRatedComics = React.useMemo(() => {
        return [...filteredEntries]
            .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
            .slice(0, 12)
    }, [filteredEntries])

    // Newly Added - by ID (newest first)
    const newComics = React.useMemo(() => {
        return [...filteredEntries]
            .sort((a: any, b: any) => (b.id || 0) - (a.id || 0))
            .slice(0, 12)
    }, [filteredEntries])

    // Display based on active section
    const displayComics = React.useMemo(() => {
        switch (activeSection) {
            case "trending": return trendingComics
            case "top": return topRatedComics
            case "new": return newComics
            default: return filteredEntries
        }
    }, [activeSection, filteredEntries, trendingComics, topRatedComics, newComics])

    // Use currentCount from the hook
    const displayCount = currentCount

    // Genre icons
    const genreIcons: Record<string, { icon: any; color: string }> = {
        action: { icon: GiSwordClash, color: "#3B82F6" },
        adventure: { icon: GiStarSwirl, color: "#8B5CF6" },
        comedy: { icon: GiSparkles, color: "#F59E0B" },
        drama: { icon: GiHearts, color: "#EC4899" },
        fantasy: { icon: GiCrystalGrowth, color: "#10B981" },
        horror: { icon: GiSmokeBomb, color: "#6B7280" },
        mystery: { icon: GiTimeBomb, color: "#6366F1" },
        romance: { icon: GiHearts, color: "#F472B6" },
        "sci-fi": { icon: GiStarSwirl, color: "#06B6D4" },
        "slice of life": { icon: GiBookshelf, color: "#84CC16" },
        sports: { icon: GiTrophy, color: "#F97316" },
        supernatural: { icon: GiFire, color: "#DC2626" },
        thriller: { icon: GiCrown, color: "#7C3AED" },
    }

    const handleComicClick = (entry: any) => {
        router.push(`/manga/entry?id=${entry.mediaId}`)
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0a0a0f] selection:bg-purple-500/30">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                {/* Gradient Orbs */}
                <motion.div 
                    className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-3xl"
                    style={{
                        background: `radial-gradient(circle, ${currentLabel.color}40 0%, transparent 70%)`,
                        left: "10%",
                        top: "20%",
                    }}
                    animate={{
                        x: mousePosition.x * 2,
                        y: mousePosition.y * 2,
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div 
                    className="absolute w-[600px] h-[600px] rounded-full opacity-15 blur-3xl"
                    style={{
                        background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
                        right: "5%",
                        bottom: "10%",
                    }}
                    animate={{
                        x: -mousePosition.x * 2,
                        y: -mousePosition.y * 2,
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                />
                
                {/* Grid Pattern */}
                <div 
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(${accentColor}20 1px, transparent 1px), linear-gradient(90deg, ${accentColor}20 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                    }}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                {/* Header */}
                <motion.header 
                    className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/5"
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            {/* Logo & Title */}
                            <motion.div 
                                className="flex items-center gap-3"
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="relative">
                                    <GiBookshelf className="w-10 h-10" style={{ color: accentColor }} />
                                    <motion.div
                                        className="absolute inset-0 blur-xl"
                                        style={{ backgroundColor: accentColor }}
                                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Comics Library</h1>
                                <p className="text-xs text-white/50">Manga, Manhwa & Manhua</p>
                            </div>
                            </motion.div>

                            {/* Search */}
                            <div className="flex-1 max-w-xl w-full">
                                <div className="relative group">
                                    <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="text"
                                        placeholder="Search manga, manhwa, manhua..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Type Switcher */}
                            <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
                                {(Object.keys(typeLabels) as ComicsType[]).map((type) => {
                                    const label = typeLabels[type]
                                    const isActive = currentType === type
                                    return (
                                        <motion.button
                                            key={type}
                                            onClick={() => setCurrentType(type)}
                                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all relative overflow-hidden"
                                            style={{
                                                color: isActive ? "white" : "rgba(255,255,255,0.5)",
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    className="absolute inset-0"
                                                    style={{ backgroundColor: label.color }}
                                                    layoutId="activeType"
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                />
                                            )}
                                            <span className="relative z-10">{label.title}</span>
                                        </motion.button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </motion.header>

                {/* Hero Section - Featured Comic */}
                {featuredComics.length > 0 && (
                    <section className="relative px-4 sm:px-6 py-8 md:py-12">
                        <div className="max-w-7xl mx-auto">
                            <motion.div 
                                className="relative rounded-2xl overflow-hidden"
                                style={{
                                    background: `linear-gradient(135deg, ${currentLabel.color}20 0%, transparent 50%)`,
                                }}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-10">
                                    {/* Featured Image */}
                                    <motion.div 
                                        className="relative aspect-[3/4] md:aspect-[4/3] rounded-xl overflow-hidden"
                                        style={{
                                            boxShadow: `0 25px 50px -12px ${currentLabel.color}40`,
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                                <AnimatePresence mode="wait">
                                            <motion.div
                                                key={featuredIndex}
                                                className="absolute inset-0 bg-cover bg-center"
                                                style={{
                                                    backgroundImage: `url(${featuredComics[featuredIndex]?.bannerImage || featuredComics[featuredIndex]?.coverImage})`,
                                                }}
                                                initial={{ opacity: 0, scale: 1.1 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </AnimatePresence>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        
                                        {/* Featured Badge */}
                                        <div className="absolute top-4 left-4">
                                            <motion.div 
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                            >
                                                <GiCrown className="w-4 h-4 text-amber-400" />
                                                <span className="text-xs font-medium text-white">Featured</span>
                                            </motion.div>
                                        </div>
                                    </motion.div>

                                    {/* Featured Info */}
                                    <div className="flex flex-col justify-center space-y-4">
                                        <motion.div
                                            key={featuredIndex}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <span 
                                                    className="px-2 py-1 rounded text-xs font-medium"
                                                    style={{ 
                                                        backgroundColor: `${currentLabel.color}30`,
                                                        color: currentLabel.color 
                                                    }}
                                                >
                                                    {currentLabel.title}
                                                </span>
                                                <span className="text-white/40 text-sm">
                                                    {featuredComics[featuredIndex]?.year}
                                                </span>
                                            </div>
                                            
                                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                                {featuredComics[featuredIndex]?.title}
                                            </h2>
                                            
                                            <p className="text-white/60 text-sm md:text-base line-clamp-3 mb-4">
                                                {featuredComics[featuredIndex]?.description?.replace(/<[^>]*>/g, '')}
                                            </p>

                                            <div className="flex items-center gap-6 mb-6">
                                                <div className="flex items-center gap-2">
                                                    <BiStar className="w-5 h-5 text-amber-400" />
                                                    <span className="text-white font-semibold">
                                                        {featuredComics[featuredIndex]?.score || "N/A"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <BiTrendingUp className="w-5 h-5 text-emerald-400" />
                                                    <span className="text-white/60">
                                                        #{featuredComics[featuredIndex]?.mediaId || "N/A"} Popular
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <BiBookOpen className="w-5 h-5 text-blue-400" />
                                                    <span className="text-white/60">
                                                        {featuredComics[featuredIndex]?.chaptersRead || 0} / {featuredComics[featuredIndex]?.totalChapters || "??"} Ch
                                                    </span>
                                                </div>
                                            </div>

                                            <motion.button
                                                onClick={() => handleComicClick(featuredComics[featuredIndex])}
                                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all"
                                                style={{ backgroundColor: currentLabel.color }}
                                                whileHover={{ scale: 1.05, boxShadow: `0 10px 30px ${currentLabel.color}50` }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <span>Read Now</span>
                                                <FiChevronRight className="w-5 h-5" />
                                            </motion.button>
                                        </motion.div>

                                        {/* Navigation Dots */}
                                        <div className="flex gap-2 mt-4">
                                            {featuredComics.map((_: unknown, i: number) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setFeaturedIndex(i)}
                                                    className="h-1.5 rounded-full transition-all"
                                                    style={{
                                                        width: i === featuredIndex ? 32 : 8,
                                                        backgroundColor: i === featuredIndex ? currentLabel.color : "rgba(255,255,255,0.2)",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                )}

                {/* Section Tabs */}
                <section className="px-4 sm:px-6 py-6">
                    <div className="max-w-7xl mx-auto">
                        <motion.div 
                            className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {[
                                { id: "all", label: "All Comics", icon: GiBookshelf, count: displayCount },
                                { id: "trending", label: "Trending", icon: BiTrendingUp, count: trendingComics.length },
                                { id: "top", label: "Top Rated", icon: GiTrophy, count: topRatedComics.length },
                                { id: "new", label: "Newly Added", icon: BiTime, count: newComics.length },
                            ].map((section) => {
                                const Icon = section.icon
                                const isActive = activeSection === section.id
                                return (
                                    <motion.button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id as any)}
                                        className="flex items-center gap-2 px-4 py-3 rounded-xl border transition-all whitespace-nowrap"
                                        style={{
                                            backgroundColor: isActive ? `${currentLabel.color}20` : "rgba(255,255,255,0.03)",
                                            borderColor: isActive ? `${currentLabel.color}50` : "rgba(255,255,255,0.1)",
                                        }}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Icon 
                                            className="w-5 h-5" 
                                            style={{ color: isActive ? currentLabel.color : "rgba(255,255,255,0.5)" }}
                                        />
                                        <span className={isActive ? "text-white font-medium" : "text-white/60"}>
                                            {section.label}
                                        </span>
                                        <span 
                                            className="px-2 py-0.5 rounded-full text-xs"
                                            style={{
                                                backgroundColor: isActive ? `${currentLabel.color}30` : "rgba(255,255,255,0.1)",
                                                color: isActive ? currentLabel.color : "rgba(255,255,255,0.5)",
                                            }}
                                        >
                                            {section.count}
                                        </span>
                                    </motion.button>
                                )
                            })}
                        </motion.div>
                    </div>
                </section>

                {/* Genres */}
                <section className="px-4 sm:px-6 py-4">
                    <div className="max-w-7xl mx-auto">
                        <motion.div 
                            className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                                {genres.slice(0, 10).map((genre: string, index: number) => {
                                    const genreData = genreIcons[genre.toLowerCase()] || { icon: GiSparkles, color: accentColor }
                                    const Icon = genreData.icon
                                    const isSelected = selectedGenres?.includes(genre)
                                
                                return (
                                    <motion.button
                                        key={genre}
                                        onClick={() => toggleGenre(genre)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all whitespace-nowrap"
                                        style={{
                                            backgroundColor: isSelected ? `${genreData.color}20` : "rgba(255,255,255,0.03)",
                                            borderColor: isSelected ? `${genreData.color}50` : "rgba(255,255,255,0.1)",
                                        }}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Icon className="w-4 h-4" style={{ color: genreData.color }} />
                                        <span className={isSelected ? "text-white text-sm" : "text-white/60 text-sm"}>
                                            {genre}
                                        </span>
                                    </motion.button>
                                )
                            })}
                        </motion.div>
                    </div>
                </section>

                {/* Comics Grid */}
                <section className="px-4 sm:px-6 py-8">
                    <div className="max-w-7xl mx-auto">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <motion.div
                                    className="w-16 h-16 rounded-full border-4 border-t-transparent"
                                    style={{ borderColor: `${accentColor}40`, borderTopColor: accentColor }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <p className="mt-4 text-white/50">Loading comics...</p>
                            </div>
                        ) : displayComics.length > 0 ? (
                            <motion.div 
                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
                                layout
                            >
                                <AnimatePresence mode="popLayout">
                                    {displayComics.map((entry: any, index: number) => (
                                        <motion.div
                                            key={entry.id || index}
                                            layout
                                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                            transition={{ 
                                                delay: index * 0.03,
                                                type: "spring",
                                                stiffness: 100,
                                                damping: 15
                                            }}
                                            className="group relative"
                                        >
                                            <motion.div
                                                className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer"
                                                style={{
                                                    backgroundColor: "rgba(255,255,255,0.03)",
                                                }}
                                                whileHover={{ 
                                                    scale: 1.05, 
                                                    y: -8,
                                                    transition: { type: "spring", stiffness: 300, damping: 20 }
                                                }}
                                                onClick={() => handleComicClick(entry)}
                                            >
                                                {/* Cover Image */}
                                                <motion.div 
                                                    className="absolute inset-0 bg-cover bg-center"
                                                    style={{ 
                                                        backgroundImage: `url(${entry.coverImage})`,
                                                    }}
                                                    whileHover={{ scale: 1.1 }}
                                                    transition={{ duration: 0.4 }}
                                                />
                                                
                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                                                
                                                {/* Rank Badge for Top/Trending */}
                                                {index < 3 && (activeSection === "top" || activeSection === "trending") && (
                                                    <div className="absolute top-2 left-2 z-20">
                                                        <motion.div
                                                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                                                            style={{
                                                                background: index === 0 
                                                                    ? "linear-gradient(135deg, #FFD700, #FFA500)" 
                                                                    : index === 1 
                                                                        ? "linear-gradient(135deg, #C0C0C0, #A0A0A0)"
                                                                        : "linear-gradient(135deg, #CD7F32, #B87333)",
                                                                color: index === 0 ? "#000" : "#fff",
                                                            }}
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ delay: index * 0.1 }}
                                                        >
                                                            {index + 1}
                                                        </motion.div>
                                                    </div>
                                                )}

                                                {/* New Badge */}
                                                {activeSection === "new" && index < 3 && (
                                                    <div className="absolute top-2 left-2 z-20">
                                                        <motion.div
                                                            className="px-2 py-1 rounded-full text-xs font-bold bg-emerald-500/80 text-white"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                        >
                                                            NEW
                                                        </motion.div>
                                                    </div>
                                                )}
                                                
                                                {/* Content */}
                                                <div className="absolute inset-0 p-3 flex flex-col justify-end">
                                                    <h4 className="text-white font-semibold text-sm line-clamp-2 mb-1 group-hover:text-white transition-colors">
                                                        {entry.title}
                                                    </h4>
                                                    <div className="flex items-center justify-between text-xs text-white/60">
                                                        <span>Ch. {entry.chaptersRead || 0}</span>
                                                        {entry.score > 0 && (
                                                            <span className="flex items-center gap-1 text-amber-400">
                                                                <BiStar className="w-3 h-3" />
                                                                {entry.score}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Hover Glow */}
                                                <motion.div
                                                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                                    style={{
                                                        boxShadow: `inset 0 0 30px ${currentLabel.color}30, 0 10px 40px ${currentLabel.color}20`,
                                                    }}
                                                />
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <motion.div 
                                className="text-center py-20"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <GiBookshelf className="w-16 h-16 text-white/20 mx-auto mb-4" />
                                <p className="text-white/50 text-lg">No comics found</p>
                                <p className="text-white/30 text-sm mt-2">Try adjusting your filters or search query</p>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="px-6 py-8 border-t border-white/5 mt-12">
                    <div className="max-w-7xl mx-auto text-center">
                        <p className="text-white/20 text-sm">
                            Comics Library • Manga, Manhwa & Manhua Collection
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    )
}
