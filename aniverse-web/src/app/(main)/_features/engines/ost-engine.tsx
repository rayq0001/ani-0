"use client"

import { GlassCard } from "@/components/anyverse"
import { NeonBadge } from "@/components/anyverse/NeonBadge"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { 
    ostEnabledAtom, 
    ostVolumeAtom, 
    currentMoodAtom,
    currentTrackAtom,
    localScrollSpeedAtom,
    isOSTAvailableAtom,
    Mood
} from "../../_atoms/anyverse.atoms"
import { motion, AnimatePresence } from "framer-motion"
import React, { useEffect, useRef, useState } from "react"
import { 
    LuMusic, 
    LuVolume2, 
    LuVolumeX,
    LuPlay, 
    LuPause, 
    LuHeart,
    LuActivity,
    LuSmile,
    LuUmbrella,
    LuGhost,
    LuLaugh,
    LuZap,
} from "react-icons/lu"

const moodIcons: Record<Mood, React.ReactNode> = {
    action: <LuZap className="w-4 h-4" />,
    tension: <LuActivity className="w-4 h-4" />,
    romance: <LuHeart className="w-4 h-4" />,
    calm: <Smile className="w-4 h-4" />,
    mystery: <LuGhost className="w-4 h-4" />,
    comedy: <LuLaugh className="w-4 h-4" />,
    horror: <LuUmbrella className="w-4 h-4" />,
}

const moodColors: Record<Mood, string> = {
    action: "#ef4444",
    tension: "#f97316",
    romance: "#ec4899",
    calm: "#10b981",
    mystery: "#6366f1",
    comedy: "#f59e0b",
    horror: "#7c3aed",
}

// Mock track data
const mockTracks: { id: string; title: string; artist: string; mood: Mood; bpm: number; duration: number }[] = [
    { id: "1", title: "Battlefield", artist: "Anyverse OST", mood: "action", bpm: 140, duration: 180 },
    { id: "2", title: "Tender Moments", artist: "Anyverse OST", mood: "romance", bpm: 80, duration: 200 },
    { id: "3", title: "Suspense", artist: "Anyverse OST", mood: "tension", bpm: 110, duration: 190 },
    { id: "4", title: "Peaceful Day", artist: "Anyverse OST", mood: "calm", bpm: 60, duration: 210 },
]

function Smile({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
    )
}

export function OSTEngine() {
    const [enabled, setEnabled] = useAtom(ostEnabledAtom)
    const [volume, setVolume] = useAtom(ostVolumeAtom)
    const [currentMood, setCurrentMood] = useAtom(currentMoodAtom)
    const [currentTrack, setCurrentTrack] = useAtom(currentTrackAtom)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [localSpeed, setLocalSpeed] = useState(0)
    const isAvailable = useAtomValue(isOSTAvailableAtom)
    
    const audioRef = useRef<HTMLAudioElement>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    // Simulate scroll speed detection
    useEffect(() => {
        const handleScroll = () => {
            // In production, this would calculate actual scroll speed
            const speed = Math.random() * 100
            setLocalSpeed(speed)
            
            // Auto-change mood based on scroll speed
            if (speed > 70) {
                setCurrentMood("action")
            } else if (speed > 40) {
                setCurrentMood("tension")
            }
        }
        
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [setCurrentMood])

    // Handle audio playback
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume
        }
    }, [volume, isMuted])

    useEffect(() => {
        if (enabled && isPlaying) {
            // Find track matching current mood
            const track = mockTracks.find(t => t.mood === currentMood) || mockTracks[0]
            setCurrentTrack(track)
        }
    }, [enabled, isPlaying, currentMood, setCurrentTrack])

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying)
    }

    const handleMoodChange = (mood: Mood) => {
        setCurrentMood(mood)
        const track = mockTracks.find(t => t.mood === mood)
        if (track) {
            setCurrentTrack(track)
        }
    }

    if (!isAvailable) {
        return (
            <GlassCard variant="medium" className="p-6">
                <div className="text-center">
                    <div className="inline-flex p-4 rounded-xl bg-emerald-600/20 mb-4">
                        <LuMusic className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Dynamic OST</h3>
                    <p className="text-sm text-white/50 mb-4">
                        Upgrade to Pro or Elite to unlock dynamic soundtrack
                    </p>
                    <NeonBadge color="green" variant="glow">
                        Pro Feature
                    </NeonBadge>
                </div>
            </GlassCard>
        )
    }

    return (
        <GlassCard 
            variant={enabled ? "holographic" : "medium"} 
            glow={enabled}
            glowColor="green"
            className="p-6"
        >
            {/* Hidden Audio Element */}
            <audio 
                ref={audioRef}
                src={currentTrack ? `/audio/${currentTrack.id}.mp3` : undefined}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onEnded={() => setIsPlaying(false)}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600">
                        <LuMusic className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Dynamic OST</h3>
                        <p className="text-sm text-white/50">AI-powered soundtrack</p>
                    </div>
                </div>
                <button
                    onClick={() => setEnabled(!enabled)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                        enabled ? "bg-emerald-600" : "bg-white/10"
                    }`}
                >
                    <motion.div
                        className="absolute top-1 w-4 h-4 bg-white rounded-full"
                        animate={{ left: enabled ? 28 : 4 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                </button>
            </div>

            <AnimatePresence mode="wait">
                {!enabled ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-8"
                    >
                        <p className="text-white/40">Enable Dynamic OST for AI-generated music</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Current Track Display */}
                        {currentTrack && (
                            <div className="mb-6">
                                <GlassCard variant="light" className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div 
                                            className="w-14 h-14 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: `${moodColors[currentMood]}30` }}
                                        >
                                            <LuMusic 
                                                className="w-6 h-6" 
                                                style={{ color: moodColors[currentMood] }} 
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-medium">{currentTrack.title}</h4>
                                            <p className="text-sm text-white/50">{currentTrack.artist}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <NeonBadge 
                                                    color={currentMood === "action" ? "red" : 
                                                          currentMood === "romance" ? "pink" :
                                                          currentMood === "tension" ? "gold" : "green"}
                                                    variant="glow"
                                                    size="sm"
                                                >
                                                    {currentMood.toUpperCase()} • {currentTrack.bpm} BPM
                                                </NeonBadge>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>
                        )}

                        {/* Playback Controls */}
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <button
                                onClick={handlePlayPause}
                                className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center hover:scale-105 transition-transform"
                            >
                                {isPlaying ? (
                                    <LuPause className="w-6 h-6 text-white" />
                                ) : (
                                    <LuPlay className="w-6 h-6 text-white ml-1" />
                                )}
                            </button>
                        </div>

                        {/* Volume Control */}
                        <div className="flex items-center gap-3 mb-6">
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="text-white/50 hover:text-white transition-colors"
                            >
                                {isMuted ? (
                                    <LuVolumeX className="w-5 h-5" />
                                ) : (
                                    <LuVolume2 className="w-5 h-5" />
                                )}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={isMuted ? 0 : volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="flex-1 h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                                    [&::-webkit-slider-thumb]:appearance-none
                                    [&::-webkit-slider-thumb]:w-4
                                    [&::-webkit-slider-thumb]:h-4
                                    [&::-webkit-slider-thumb]:rounded-full
                                    [&::-webkit-slider-thumb]:bg-emerald-500"
                            />
                            <span className="text-sm text-white/50 w-8">
                                {Math.round((isMuted ? 0 : volume) * 100)}%
                            </span>
                        </div>

                        {/* Mood Selection */}
                        <div>
                            <p className="text-sm text-white/50 mb-3">Mood Detection</p>
                            <div className="flex flex-wrap gap-2">
                                {(Object.keys(moodIcons) as Mood[]).map((mood) => (
                                    <button
                                        key={mood}
                                        onClick={() => handleMoodChange(mood)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                                            currentMood === mood
                                                ? "border-emerald-500 bg-emerald-600/20"
                                                : "border-white/10 bg-white/5 hover:border-white/20"
                                        }`}
                                    >
                                        <span style={{ color: moodColors[mood] }}>
                                            {moodIcons[mood]}
                                        </span>
                                        <span className={`text-sm capitalize ${
                                            currentMood === mood ? "text-white" : "text-white/50"
                                        }`}>
                                            {mood}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Scroll Speed Indicator */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-white/50">Scroll Speed</span>
                                <span className="text-sm text-emerald-400">
                                    {localSpeed > 70 ? "Fast" : localSpeed > 30 ? "Medium" : "Slow"}
                                </span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-emerald-600 to-teal-600"
                                    animate={{ width: `${Math.min(localSpeed, 100)}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    )
}

export default OSTEngine

