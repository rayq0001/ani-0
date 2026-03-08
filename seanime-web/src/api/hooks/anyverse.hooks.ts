import { useServerMutation, useServerQuery } from "@/api/client/requests"

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Smart Summary
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface SmartSummaryRequest {
    mediaId: number
    mangaTitle: string
    chaptersRead: number[]
    lastChapter: number
    lastReadAt: string
    language?: "en" | "ar"
    includeSpoilers?: boolean
}

export interface SmartSummary {
    id: string
    mediaId: number
    mangaTitle: string
    chapterRange: string
    summary: string
    arabicSummary: string
    keyEvents: string[]
    characters: string[]
    lastReadAt: string
    generatedAt: string
}

export function useGenerateSmartSummary() {
    return useServerMutation<SmartSummary, SmartSummaryRequest>({
        endpoint: "/api/v1/anyverse/summary",
        method: "POST",
        mutationKey: ["anyverse-summary"],
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Offline Downloads
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface DownloadItem {
    id: string
    mediaId: number
    mangaTitle: string
    chapter: number
    pageCount: number
    status: "pending" | "downloading" | "completed" | "error" | "paused"
    progress: number
    error?: string
    startedAt?: string
    completedAt?: string
    priority: number
}

export interface QueueDownloadRequest {
    mediaId: number
    mangaTitle: string
    chapter: number
    pageCount?: number
    priority?: number
}

export interface QueueNextChaptersRequest {
    mediaId: number
    mangaTitle: string
    currentChapter: number
    count: number
}

export function useQueueDownload() {
    return useServerMutation<DownloadItem, QueueDownloadRequest>({
        endpoint: "/api/v1/anyverse/offline/queue",
        method: "POST",
        mutationKey: ["anyverse-offline-queue"],
    })
}

export function useQueueNextChapters() {
    return useServerMutation<DownloadItem[], QueueNextChaptersRequest>({
        endpoint: "/api/v1/anyverse/offline/queue-next",
        method: "POST",
        mutationKey: ["anyverse-offline-queue-next"],
    })
}

export function useGetDownloadQueue() {
    return useServerQuery<DownloadItem[]>({
        endpoint: "/api/v1/anyverse/offline/queue",
        method: "GET",
        queryKey: ["anyverse-offline-queue"],
    })
}

export function useGetActiveDownloads() {
    return useServerQuery<DownloadItem[]>({
        endpoint: "/api/v1/anyverse/offline/active",
        method: "GET",
        queryKey: ["anyverse-offline-active"],
    })
}

export function useGetCompletedDownloads() {
    return useServerQuery<DownloadItem[]>({
        endpoint: "/api/v1/anyverse/offline/completed",
        method: "GET",
        queryKey: ["anyverse-offline-completed"],
    })
}

export function usePauseDownload() {
    return useServerMutation<boolean, { downloadId: string }>({
        endpoint: "/api/v1/anyverse/offline/pause",
        method: "POST",
        mutationKey: ["anyverse-offline-pause"],
    })
}

export function useResumeDownload() {
    return useServerMutation<boolean, { downloadId: string }>({
        endpoint: "/api/v1/anyverse/offline/resume",
        method: "POST",
        mutationKey: ["anyverse-offline-resume"],
    })
}

export function useCancelDownload() {
    return useServerMutation<boolean, { downloadId: string }>({
        endpoint: "/api/v1/anyverse/offline/cancel",
        method: "POST",
        mutationKey: ["anyverse-offline-cancel"],
    })
}

export function useClearCompletedDownloads() {
    return useServerMutation<boolean, void>({
        endpoint: "/api/v1/anyverse/offline/clear-completed",
        method: "POST",
        mutationKey: ["anyverse-offline-clear"],
    })
}

export interface DownloadStats {
    pending: number
    downloading: number
    completed: number
    error: number
    total: number
}

export function useGetDownloadStats() {
    return useServerQuery<DownloadStats>({
        endpoint: "/api/v1/anyverse/offline/stats",
        method: "GET",
        queryKey: ["anyverse-offline-stats"],
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Cultural Localization
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface CulturalLocalizationRequest {
    text: string
    targetDialect: "classical" | "saudi" | "egyptian" | "gulf" | "levantine" | "maghrebi"
    preserveContext?: boolean
}

export interface CulturalLocalizationResponse {
    original: string
    localized: string
    dialect: string
    culturalNotes: string[]
}

export function useCulturalLocalization() {
    return useServerMutation<CulturalLocalizationResponse, CulturalLocalizationRequest>({
        endpoint: "/api/v1/anyverse/culture/localize",
        method: "POST",
        mutationKey: ["anyverse-culture-localize"],
    })
}

export interface VoiceCustomizationRequest {
    text: string
    voiceType: "male_deep" | "female_soft" | "villain" | "robot" | "narrator"
    emotion?: "neutral" | "happy" | "sad" | "angry" | "excited"
    speed?: number
}

export interface VoiceCustomizationResponse {
    audioUrl: string
    duration: number
    voiceId: string
}

export function useVoiceCustomization() {
    return useServerMutation<VoiceCustomizationResponse, VoiceCustomizationRequest>({
        endpoint: "/api/v1/anyverse/culture/voice",
        method: "POST",
        mutationKey: ["anyverse-culture-voice"],
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AI Director
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface AIDirectorRequest {
    imageBase64: string
    currentPerspective: string
    targetPerspective: "first-person" | "third-person" | "aerial" | "cinematic"
    characterName?: string
    sceneDescription?: string
}

export interface AIDirectorResponse {
    generatedImage: string
    perspective: string
    processingTime: number
    alternativeAngles?: string[]
}

export function useAIDirector() {
    return useServerMutation<AIDirectorResponse, AIDirectorRequest>({
        endpoint: "/api/v1/anyverse/director/generate",
        method: "POST",
        mutationKey: ["anyverse-director"],
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Emotional OST
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface OSTGenerationRequest {
    mood: "action" | "tension" | "romance" | "calm" | "mystery" | "comedy" | "horror"
    keywords: string[]
    duration?: number
    tempo?: "fast" | "medium" | "slow"
    scrollSpeed?: number
}

export interface OSTGenerationResponse {
    audioUrl: string
    waveformData: number[]
    duration: number
    bpm: number
    key: string
    mood: string
}

export function useGenerateOST() {
    return useServerMutation<OSTGenerationResponse, OSTGenerationRequest>({
        endpoint: "/api/v1/anyverse/ost/generate",
        method: "POST",
        mutationKey: ["anyverse-ost-generate"],
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Subscription & Wallet
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface SubscriptionInfo {
    tier: "standard" | "pro" | "elite"
    expiresAt?: string
    features: string[]
    price: number
}

export function useGetSubscription() {
    return useServerQuery<SubscriptionInfo>({
        endpoint: "/api/v1/anyverse/subscription",
        method: "GET",
        queryKey: ["anyverse-subscription"],
    })
}

export interface UpgradeSubscriptionRequest {
    tier: "pro" | "elite"
    paymentMethod: "stripe" | "paypal" | "anycoin"
}

export function useUpgradeSubscription() {
    return useServerMutation<SubscriptionInfo, UpgradeSubscriptionRequest>({
        endpoint: "/api/v1/anyverse/subscription/upgrade",
        method: "POST",
        mutationKey: ["anyverse-subscription-upgrade"],
    })
}

export interface WalletBalance {
    anyCoins: number
    usdEquivalent: number
}

export function useGetWalletBalance() {
    return useServerQuery<WalletBalance>({
        endpoint: "/api/v1/anyverse/wallet/balance",
        method: "GET",
        queryKey: ["anyverse-wallet-balance"],
    })
}

export interface PurchaseCoinsRequest {
    packageId: string
    paymentMethod: "stripe" | "paypal"
}

export interface PurchaseCoinsResponse {
    anyCoins: number
    bonusCoins: number
    totalCoins: number
}

export function usePurchaseCoins() {
    return useServerMutation<PurchaseCoinsResponse, PurchaseCoinsRequest>({
        endpoint: "/api/v1/anyverse/wallet/purchase",
        method: "POST",
        mutationKey: ["anyverse-wallet-purchase"],
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Health Check
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface HealthStatus {
    status: "healthy" | "degraded" | "unhealthy"
    services: {
        gemini: boolean
        replicate: boolean
        suno: boolean
        elevenlabs: boolean
    }
    latency: {
        gemini: number
        replicate: number
        suno: number
        elevenlabs: number
    }
}

export function useGetHealthStatus() {
    return useServerQuery<HealthStatus>({
        endpoint: "/api/v1/anyverse/health",
        method: "GET",
        queryKey: ["anyverse-health"],
    })
}
