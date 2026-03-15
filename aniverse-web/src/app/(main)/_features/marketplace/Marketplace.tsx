"use client"

import { GlassCard, GlassCardGradient } from "@/components/anyverse"
import { NeonBadge } from "@/components/anyverse/NeonBadge"
import { HolographicButton } from "@/components/anyverse/HolographicButton"
import { useAtom, useAtomValue } from "jotai"
import { anyCoinBalanceAtom, userSubscriptionAtom, SubscriptionTier } from "../../_atoms/anyverse.atoms"
import { motion } from "framer-motion"
import React, { useState } from "react"
import { 
    LuShoppingBag, 
    LuCoins, 
    LuSparkles, 
    LuMusic, 
    LuImage, 
    LuMic,
    LuSearch,
    LuFilter,
    LuTrendingUp,
    LuStar,
    LuClock,
    LuHeart,
    LuShoppingCart
} from "react-icons/lu"

// Asset types
type AssetCategory = "voices" | "prompts" | "avatars" | "themes" | "frames"
type AssetType = {
    id: string
    name: string
    description: string
    category: AssetCategory
    price: number
    author: string
    downloads: number
    rating: number
    imageUrl: string
    tags: string[]
}

// Mock marketplace data
const assets: AssetType[] = [
    {
        id: "1",
        name: "Sarah's Voice - Anime Voice",
        description: "Soft female voice perfect for romance characters",
        category: "voices",
        price: 500,
        author: "AnimeVoiceStudio",
        downloads: 1250,
        rating: 4.8,
        imageUrl: "/assets/voice-1.jpg",
        tags: ["female", "romance", "soft"],
    },
    {
        id: "2",
        name: "Cinematic Prompt",
        description: "Prompt for producing dramatic action scenes",
        category: "prompts",
        price: 150,
        author: "PromptMaster",
        downloads: 3400,
        rating: 4.9,
        imageUrl: "/assets/prompt-1.jpg",
        tags: ["cinematic", "action", "dramatic"],
    },
    {
        id: "3",
        name: "Digital Twin Avatar",
        description: "Avatar template in Korean Manhwa style",
        category: "avatars",
        price: 300,
        author: "ManhwaArtist",
        downloads: 890,
        rating: 4.7,
        imageUrl: "/assets/avatar-1.jpg",
        tags: ["manhwa", "digital twin", "korean"],
    },
    {
        id: "4",
        name: "Aeon Theme",
        description: "Moving purple gradient theme",
        category: "themes",
        price: 200,
        author: "ThemeCreator",
        downloads: 2100,
        rating: 4.6,
        imageUrl: "/assets/theme-1.jpg",
        tags: ["purple", "animated", "holographic"],
    },
    {
        id: "5",
        name: "Luxury Gold Frame",
        description: "Frame for decorating rare pages",
        category: "frames",
        price: 100,
        author: "FrameDesign",
        downloads: 5600,
        rating: 4.5,
        imageUrl: "/assets/frame-1.jpg",
        tags: ["gold", "premium", "rare"],
    },
    {
        id: "6",
        name: "Fierce Action Voice",
        description: "Powerful male voice for action scenes",
        category: "voices",
        price: 500,
        author: "VoicePro",
        downloads: 780,
        rating: 4.9,
        imageUrl: "/assets/voice-2.jpg",
        tags: ["male", "action", "powerful"],
    },
]

const categories: { id: AssetCategory; name: string; icon: React.ReactNode }[] = [
    { id: "voices", name: "Voices", icon: <LuMic className="w-5 h-5" /> },
    { id: "prompts", name: "Prompts", icon: <LuSparkles className="w-5 h-5" /> },
    { id: "avatars", name: "Avatars", icon: <LuImage className="w-5 h-5" /> },
    { id: "themes", name: "Themes", icon: <LuShoppingBag className="w-5 h-5" /> },
    { id: "frames", name: "Frames", icon: <LuStar className="w-5 h-5" /> },
]

function AssetCard({ asset, onBuy }: { asset: AssetType; onBuy: (asset: AssetType) => void }) {
    return (
        <GlassCard hover className="overflow-hidden">
            {/* Image placeholder */}
            <div className="aspect-square bg-gradient-to-br from-violet-600/20 to-pink-600/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                {asset.category === "voices" && <LuMic className="w-12 h-12 text-violet-400" />}
                    {asset.category === "prompts" && <LuSparkles className="w-12 h-12 text-pink-400" />}
                    {asset.category === "avatars" && <LuImage className="w-12 h-12 text-amber-400" />}
                    {asset.category === "themes" && <LuShoppingBag className="w-12 h-12 text-emerald-400" />}
                    {asset.category === "frames" && <LuStar className="w-12 h-12 text-gold-400" />}
                </div>
                
                {/* Category badge */}
                <div className="absolute top-2 left-2">
                    <NeonBadge color="purple" size="sm">
                        {categories.find(c => c.id === asset.category)?.name}
                    </NeonBadge>
                </div>
            </div>
            
            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-white mb-1 line-clamp-1">{asset.name}</h3>
                <p className="text-sm text-white/50 mb-3 line-clamp-2">{asset.description}</p>
                
                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-white/40 mb-3">
                    <div className="flex items-center gap-1">
                        <LuTrendingUp className="w-3 h-3" />
                        <span>{asset.downloads}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <LuStar className="w-3 h-3 text-amber-400" />
                        <span>{asset.rating}</span>
                    </div>
                </div>
                
                {/* Author */}
                <p className="text-xs text-white/30 mb-3">by {asset.author}</p>
                
                {/* Price & Buy */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <LuCoins className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-400 font-bold">{asset.price}</span>
                    </div>
                    <HolographicButton size="sm" onClick={() => onBuy(asset)}>
                        <LuShoppingCart className="w-3 h-3 mr-1" />
                        Buy
                    </HolographicButton>
                </div>
            </div>
        </GlassCard>
    )
}

export function Marketplace() {
    const [anyCoins, setAnyCoins] = useAtom(anyCoinBalanceAtom)
    const subscription = useAtomValue(userSubscriptionAtom)
    
    const [activeCategory, setActiveCategory] = useState<AssetCategory | "all">("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState<"popular" | "new" | "rating">("popular")

    // Filter assets
    const filteredAssets = assets
        .filter(asset => {
            const matchesCategory = activeCategory === "all" || asset.category === activeCategory
            const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            return matchesCategory && matchesSearch
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "popular": return b.downloads - a.downloads
                case "rating": return b.rating - a.rating
                case "new": return 0 // Would use date
                default: return 0
            }
        })

    const handleBuy = (asset: AssetType) => {
        if (anyCoins >= asset.price) {
            setAnyCoins(anyCoins - asset.price)
            // Would call API to complete purchase
        }
    }

    return (
        <div className="space-y-6">
            {/* Header with balance */}
            <GlassCard variant="medium" className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600">
                            <LuShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Anyverse Marketplace</h2>
                            <p className="text-sm text-white/50">Digital Assets Collection</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600/20 border border-amber-600/30">
                            <LuCoins className="w-5 h-5 text-amber-400" />
                            <span className="text-amber-400 font-bold text-lg">{anyCoins}</span>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <LuSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search the store..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/20"
                    />
                </div>
                
                {/* Sort */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSortBy("popular")}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                            sortBy === "popular" ? "border-violet-500 bg-violet-600/20 text-white" : "border-white/10 text-white/50"
                        }`}
                    >
                        <LuTrendingUp className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setSortBy("rating")}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                            sortBy === "rating" ? "border-violet-500 bg-violet-600/20 text-white" : "border-white/10 text-white/50"
                        }`}
                    >
                        <LuStar className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setSortBy("new")}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                            sortBy === "new" ? "border-violet-500 bg-violet-600/20 text-white" : "border-white/10 text-white/50"
                        }`}
                    >
                        <LuClock className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setActiveCategory("all")}
                    className={`px-4 py-2 rounded-xl border transition-all ${
                        activeCategory === "all"
                            ? "border-violet-500 bg-violet-600/20 text-white"
                            : "border-white/10 text-white/50 hover:border-white/20"
                    }`}
                >
                    All
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                            activeCategory === cat.id
                                ? "border-violet-500 bg-violet-600/20 text-white"
                                : "border-white/10 text-white/50 hover:border-white/20"
                        }`}
                    >
                        {cat.icon}
                        <span>{cat.name}</span>
                    </button>
                ))}
            </div>

            {/* Assets Grid */}
            {filteredAssets.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredAssets.map((asset) => (
                        <AssetCard key={asset.id} asset={asset} onBuy={handleBuy} />
                    ))}
                </div>
            ) : (
                <GlassCard variant="medium" className="p-12 text-center">
                    <LuShoppingBag className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                    <p className="text-white/50">Try searching with different words</p>
                </GlassCard>
            )}

            {/* Get More Coins CTA */}
            <GlassCardGradient gradientColors={["#8b5cf6", "#ec4899", "#f59e0b"]} className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Need more AnyCoins?</h3>
                        <p className="text-white/70">Buy extra balance and enjoy a larger collection of assets</p>
                    </div>
                    <HolographicButton>
                        <LuCoins className="w-4 h-4 mr-2" />
                        Buy Balance
                    </HolographicButton>
                </div>
            </GlassCardGradient>
        </div>
    )
}

export default Marketplace

