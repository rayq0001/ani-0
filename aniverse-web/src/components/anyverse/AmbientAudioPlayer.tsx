import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useAmbientAIAudio } from "../../api/hooks/anyverse.hooks"

interface AmbientAudioPlayerProps {
    chapterSample: string
    isReading: boolean
}

export const AmbientAudioPlayer: React.FC<AmbientAudioPlayerProps> = ({ chapterSample, isReading }) => {
    const { mutate, data: mood, isPending } = useAmbientAIAudio()
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null)

    // Trigger mood analysis when reading starts or sample changes significantly
    useEffect(() => {
        if (chapterSample && isReading) {
            mutate({ chapter_sample: chapterSample })
        }
    }, [chapterSample, isReading, mutate])

    // Apply CSS gradient to the document body when mood changes
    useEffect(() => {
        if (mood?.css_gradient && isReading) {
            const gradientString = mood.css_gradient.join(", ")
            // Smoothly transition body background
            document.body.style.transition = "background 3s ease-in-out"
            document.body.style.background = `linear-gradient(135deg, ${gradientString})`
            document.body.style.backgroundAttachment = "fixed"
        }

        return () => {
            // Cleanup on unmount
            document.body.style.background = ""
        }
    }, [mood, isReading])

    // Map audio tags to local or remote assets
    const getAudioSource = (tag: string) => {
        // In a real app, these would point to actual audio files.
        // Using placeholders for this demo.
        const audioMap: Record<string, string> = {
            "rain_heavy": "/audio/ambient/rain.mp3",
            "battle_drums": "/audio/ambient/drums.mp3",
            "tavern_lively": "/audio/ambient/tavern.mp3",
            "wind_howling": "/audio/ambient/wind.mp3",
            "magic_chimes": "/audio/ambient/magic.mp3",
            "silence_tense": "/audio/ambient/heartbeat.mp3"
        }
        return audioMap[tag] || "/audio/ambient/default_wind.mp3"
    }

    const togglePlay = () => {
        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play().catch(e => console.error("Audio playback failed", e))
        }
        setIsPlaying(!isPlaying)
    }

    if (!isReading) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 z-[999] flex items-center gap-4 bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
        >
            <button
                onClick={togglePlay}
                disabled={isPending || !mood}
                className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${
                    isPending 
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                        : isPlaying
                            ? "bg-purple-600/50 hover:bg-purple-500/60 border border-purple-400 text-white shadow-[0_0_15px_rgba(157,78,221,0.5)]"
                            : "bg-white/10 hover:bg-white/20 text-white"
                }`}
            >
                {isPending ? (
                    <div className="w-5 h-5 border-2 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                    <span className="text-xl">⏸</span>
                ) : (
                    <span className="text-xl">▶</span>
                )}
            </button>

            <div className="flex flex-col pr-4 min-w-[120px]">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-100 font-arabic tracking-wide">
                        {isPending ? "Sensing emotions..." : mood ? "Audio Mood" : "Scene Analysis"}
                    </span>
                    {isPlaying && (
                        <div className="flex items-end gap-[2px] h-3">
                            <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-purple-400 rounded-t-sm" />
                            <motion.div animate={{ height: [6, 10, 6] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1 bg-pink-400 rounded-t-sm" />
                            <motion.div animate={{ height: [3, 8, 3] }} transition={{ repeat: Infinity, duration: 0.9, delay: 0.4 }} className="w-1 bg-purple-300 rounded-t-sm" />
                        </div>
                    )}
                </div>
                {mood && (
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-purple-300 capitalize font-mono bg-purple-900/40 px-2 py-0.5 rounded-md border border-purple-500/20">
                            {mood.mood_category.replace("_", " ")}
                        </span>
                        <span className="text-xs text-gray-400">
                            (Intensity {mood.intensity}/10)
                        </span>
                    </div>
                )}
            </div>

            {/* Hidden Audio Element */}
            {mood && (
                <audio 
                    ref={audioRef}
                    src={getAudioSource(mood.audio_tag)}
                    loop
                    onEnded={() => setIsPlaying(false)}
                />
            )}
        </motion.div>
    )
}
