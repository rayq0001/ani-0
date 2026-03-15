/**
 * Comics API Hooks
 * 
 * These hooks use the new /api/v1/comics endpoints instead of 
 * filtering manga collection locally.
 */

import { useServerQuery, useServerMutation } from "@/api/client/requests"

// Types matching the backend response
export interface ComicsEntry {
    id: number
    mediaId: number
    title: string
    coverImage: string
    bannerImage: string
    country: string
    chaptersRead: number
    totalChapters: number
    progress: number
    status: string
    score: number
    genres: string[]
    tags: string[]
    description: string
    year: number
    latestChapter?: {
        number: number
        title: string
        date: string
    }
    isFavourite: boolean
}

export interface ComicsList {
    type: string
    name: string
    entries: ComicsEntry[]
    count: number
}

export interface ComicsStats {
    totalManga: number
    totalManhwa: number
    totalManhua: number
    totalChapters: number
    chaptersRead: number
    averageScore: number
    completionRate: number
}

export interface ComicsCollection {
    manga: ComicsList
    manhwa: ComicsList
    manhua: ComicsList
    stats: ComicsStats
}

export type ComicsType = "manga" | "manhwa" | "manhua"

/**
 * Get full comics collection (manga, manhwa, manhua) with stats
 * Uses POST /api/v1/comics/collection
 */
export const useGetComicsCollection = (type?: ComicsType) => {
    return useServerQuery<ComicsCollection, { type?: string }>({
        endpoint: "/api/v1/comics/collection",
        method: "POST",
        data: { type: type || "" }, // empty string = all types
        queryKey: ["comics", "collection", type || "all"],
    })
}

/**
 * Get comics of a specific type only
 * Uses GET /api/v1/comics/{type}
 */
export const useGetComicsByType = (type: ComicsType) => {
    return useServerQuery<ComicsList>({
        endpoint: `/api/v1/comics/${type}`,
        method: "GET",
        queryKey: ["comics", type],
    })
}

/**
 * Get comics statistics
 * Uses GET /api/v1/comics/stats
 */
export const useGetComicsStats = () => {
    return useServerQuery<ComicsStats>({
        endpoint: "/api/v1/comics/stats",
        method: "GET",
        queryKey: ["comics", "stats"],
    })
}

/**
 * Hook to get all comics data at once
 * More efficient than separate calls
 */
export const useComicsData = () => {
    const { data: collection, isLoading: isLoadingCollection, refetch: refetchCollection } = useGetComicsCollection()
    const { data: stats, isLoading: isLoadingStats, refetch: refetchStats } = useGetComicsStats()

    const refetch = () => {
        refetchCollection()
        refetchStats()
    }

    return {
        // Individual lists
        manga: collection?.manga,
        manhwa: collection?.manhwa,
        manhua: collection?.manhua,
        
        // Stats
        stats: collection?.stats || stats,
        
        // Loading states
        isLoading: isLoadingCollection || isLoadingStats,
        
        // Refetch function
        refetch,
        
        // Helper to get list by type
        getListByType: (type: ComicsType) => {
            switch (type) {
                case "manga": return collection?.manga
                case "manhwa": return collection?.manhwa
                case "manhua": return collection?.manhua
                default: return undefined
            }
        },
        
        // Total count across all types
        totalCount: (collection?.manga?.count || 0) + 
                    (collection?.manhwa?.count || 0) + 
                    (collection?.manhua?.count || 0),
    }
}
