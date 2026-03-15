import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

// ============================================================================
// Canvas Mode - 2D/3D Rendering
// ============================================================================

export type CanvasMode = "2d" | "3d"
export type Perspective = "first-person" | "third-person" | "aerial" | "dynamic"

export const canvasModeAtom = atomWithStorage<CanvasMode>("anyverse:canvasMode", "2d")
export const cameraPositionAtom = atom({ x: 0, y: 0, z: 5 })
export const currentPerspectiveAtom = atomWithStorage<Perspective>("anyverse:perspective", "third-person")
export const parallaxEnabledAtom = atomWithStorage("anyverse:parallax", true)

// ============================================================================
// OST Engine State - Emotional Soundtrack
// ============================================================================

export type Mood = "action" | "tension" | "romance" | "calm" | "mystery" | "comedy" | "horror" | "comedy"

export const ostEnabledAtom = atomWithStorage("anyverse:ostEnabled", true)
export const ostVolumeAtom = atomWithStorage("anyverse:ostVolume", 0.5)
export const currentMoodAtom = atom<Mood>("calm")
export const currentTrackAtom = atom<{
    id: string
    title: string
    artist: string
    duration: number
    mood: Mood
    bpm: number
} | null>(null)

export const scrollSpeedAtom = atom(0)
export const detectedKeywordsAtom = atom<string[]>([])
export const localScrollSpeedAtom = atom(0) // Local state for scroll speed

// ============================================================================
// Character Consciousness State
// ============================================================================

export type CharacterEmotion = "happy" | "angry" | "sad" | "neutral" | "excited" | "scared" | "determined"

export const activeCharacterAtom = atom<{
    id: string
    name: string
    mangaTitle: string
    avatarUrl: string
    personality: string[]
    currentChapter: number
} | null>(null)

export const characterMoodAtom = atom<CharacterEmotion>("neutral")
export const characterChatOpenAtom = atom(false)
export const characterTypingAtom = atom(false)

// ============================================================================
// AI Director State
// ============================================================================

export const aiDirectorEnabledAtom = atomWithStorage("anyverse:aiDirector", false)
export const generationProgressAtom = atom(0)
export const generatedImagesAtom = atom<string[]>([])
export const selectedPerspectiveAtom = atom<Perspective | null>(null)

// ============================================================================
// Subscription & Wallet State
// ============================================================================

export type SubscriptionTier = "standard" | "pro" | "elite"

export const userSubscriptionAtom = atomWithStorage<SubscriptionTier>("anyverse:subscription", "standard")
export const anyCoinBalanceAtom = atomWithStorage("anyverse:anyCoins", 0)
export const walletConnectedAtom = atom(false)

// Feature access check
export const canAccessFeatureAtom = atom((get) => (feature: string): boolean => {
    const tier = get(userSubscriptionAtom)
    
    // Feature matrix
    const standardFeatures = ["basic_reading", "ocr_translation"]
    const proFeatures = [...standardFeatures, "no_ads", "ai_concierge", "voice_dubbing", "dynamic_ost", "priority_support"]
    const eliteFeatures = [...proFeatures, "ai_director", "digital_twin", "unlimited_whatif", "character_chat"]
    
    switch (tier) {
        case "standard":
            return standardFeatures.includes(feature)
        case "pro":
            return proFeatures.includes(feature)
        case "elite":
            return eliteFeatures.includes(feature)
        default:
            return false
    }
})

// ============================================================================
// UI State
// ============================================================================

export const anyverseOverlayVisibleAtom = atom(false)
export const activePanelAtom = atom<"none" | "ost" | "character" | "director" | "wallet">("none")

// ============================================================================
// Anyverse Hub Configuration Atom
// ============================================================================

export interface AnyverseConfig {
    dialect: string
    voiceType: string
    perspective: string
    ostEnabled: boolean
    cultureEnabled: boolean
    ttsEnabled: boolean
}

export const anyverseAtom = atomWithStorage<AnyverseConfig>("anyverse:config", {
    dialect: "classical",
    voiceType: "male_deep",
    perspective: "normal",
    ostEnabled: true,
    cultureEnabled: true,
    ttsEnabled: true,
})

// ============================================================================
// Derived Atoms
// ============================================================================

// Check if 3D mode is available based on subscription
export const is3DAvailableAtom = atom((get) => {
    const canAccess = get(canAccessFeatureAtom)
    return canAccess("ai_director")
})

// Check if character chat is available
export const isCharacterChatAvailableAtom = atom((get) => {
    const canAccess = get(canAccessFeatureAtom)
    return canAccess("character_chat")
})

// Check if dynamic OST is available
export const isOSTAvailableAtom = atom((get) => {
    const tier = get(userSubscriptionAtom)
    return tier === "pro" || tier === "elite"
})

// Current mood color based on mood
export const moodColorAtom = atom((get) => {
    const mood = get(currentMoodAtom)
    const colors: Record<Mood, string> = {
        action: "#ef4444",
        tension: "#f97316",
        romance: "#ec4899",
        calm: "#10b981",
        mystery: "#6366f1",
        comedy: "#f59e0b",
        horror: "#7c3aed",
    }
    return colors[mood] || colors.calm
})

