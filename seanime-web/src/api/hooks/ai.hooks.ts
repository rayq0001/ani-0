import { useServerMutation, useServerQuery } from "@/api/client/requests"

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AI Settings
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface AISettings {
    geminiApiKey: string
    openaiApiKey: string
    replicateApiToken: string
    elevenlabsApiKey: string
    pineconeApiKey: string
    enableOcr: boolean
    enableChat: boolean
    enableRecap: boolean
    enableSearch: boolean
    enableUpscaling: boolean
    enableImageGeneration: boolean
    enableVideoGeneration: boolean
    enableMusicGeneration: boolean
    enableTts: boolean
    enableEmotion: boolean
    enableCulture: boolean
    targetLanguage: string
    defaultTranslator: string
}

export function useGetAISettings() {
    return useServerQuery<AISettings>({
        endpoint: "/api/v1/ai/settings",
        method: "GET",
        queryKey: ["ai-settings"],
        enabled: true,
    })
}

export function useUpdateAISettings() {
    return useServerMutation<boolean, AISettings>({
        endpoint: "/api/v1/ai/settings",
        method: "POST",
        mutationKey: ["ai-settings-update"],
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AI OCR & Translation
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface OCRTextBlock {
    original: string
    translated: string
}

export interface OCRResult {
    originalText: string
    translatedText: string
    textBlocks: OCRTextBlock[]
    pageNumber: number
}

export interface OCRPageVariables {
    imageBase64: string
    mimeType?: string
    pageNumber?: number
}

export function useOCRPage() {
    return useServerMutation<OCRResult, OCRPageVariables>({
        endpoint: "/api/v1/ai/ocr",
        method: "POST",
        mutationKey: ["ai-ocr"],
    })
}

export interface TranslateTextVariables {
    text: string
    sourceLang?: string
    targetLang?: string
}

export interface TranslateTextResult {
    original: string
    translated: string
    note?: string
}

export function useTranslateText() {
    return useServerMutation<TranslateTextResult, TranslateTextVariables>({
        endpoint: "/api/v1/ai/translate",
        method: "POST",
        mutationKey: ["ai-translate"],
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AI Chat / Concierge
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ChatMessage {
    role: "user" | "assistant"
    content: string
}

export interface ChatContext {
    mangaTitle?: string
    currentChapter?: number
    totalChapters?: number
    provider?: string
    mediaId?: number
}

export interface ChatRequest {
    message: string
    context?: ChatContext
    history?: ChatMessage[]
}

export interface ChatResponse {
    message: string
    error?: string
}

export function useAIChat() {
    return useServerMutation<ChatResponse, ChatRequest>({
        endpoint: "/api/v1/ai/chat",
        method: "POST",
        mutationKey: ["ai-chat"],
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AI Recap
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface RecapRequest {
    mangaTitle: string
    mediaId: number
    chaptersRead: number
    currentChapter: number
}

export interface RecapResponse {
    recap: string
    error?: string
}

export function useGenerateRecap() {
    return useServerMutation<RecapResponse, RecapRequest>({
        endpoint: "/api/v1/ai/recap",
        method: "POST",
        mutationKey: ["ai-recap"],
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AI Vibe Search
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface SearchRequest {
    query: string
}

export interface SearchResponse {
    results: string
    error?: string
}

export function useAISearch() {
    return useServerMutation<SearchResponse, SearchRequest>({
        endpoint: "/api/v1/ai/search",
        method: "POST",
        mutationKey: ["ai-search"],
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AI Lore Tree
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface LoreEntry {
    id: string
    name: string
    description: string
    firstSeen: string
    imageUrl: string
    relations: string[]
    abilities: string[]
    chapterData: Record<number, string>
}

export interface LoreTree {
    mangaId: number
    mangaTitle: string
    characters: LoreEntry[]
    locations: LoreEntry[]
    organizations: LoreEntry[]
    updatedAt: string
}

export interface GenerateLoreTreeVariables {
    mediaId: number
    title: string
    chapters: string
}

export function useGenerateLoreTree() {
    return useServerMutation<LoreTree, GenerateLoreTreeVariables>({
        endpoint: "/api/v1/ai/lore",
        method: "POST",
        mutationKey: ["ai-lore"],
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AI Image Upscaling
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface UpscaleImageVariables {
    imageBase64: string
    mimeType?: string
    scale?: number
}

export interface UpscaleImageResult {
    image: string
    mimeType: string
}

export function useUpscaleImage() {
    return useServerMutation<UpscaleImageResult, UpscaleImageVariables>({
        endpoint: "/api/v1/ai/upscale",
        method: "POST",
        mutationKey: ["ai-upscale"],
    })
}

