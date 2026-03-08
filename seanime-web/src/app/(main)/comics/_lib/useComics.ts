"use client"

import { useComicsData, ComicsType, ComicsEntry } from "@/api/hooks/comics.hooks"
import { useRouter } from "@/lib/navigation"
import { useThemeSettings } from "@/lib/theme/theme-hooks"
import { atomWithImmer } from "jotai-immer"
import { useAtom } from "jotai/react"
import { atomWithStorage } from "jotai/utils"
import React from "react"

export type { ComicsType, ComicsEntry }

export const __comicsTypeAtom = atomWithStorage<ComicsType>("sea-comics-type", "manga")
export const __comicsSearchAtom = atomWithStorage("sea-comics-search", "")
export const __comicsGenreFilterAtom = atomWithImmer<string[]>([])

/**
 * Enhanced useComics hook using the new Comics API
 * 
 * This hook now uses /api/v1/comics/collection instead of 
 * filtering manga collection locally.
 */
export function useComics() {
    const router = useRouter()
    const { mangaLibraryCollectionDefaultSorting } = useThemeSettings()
    
    // Use the new Comics API
    const { 
        manga, 
        manhwa, 
        manhua, 
        stats, 
        isLoading, 
        refetch,
        getListByType,
        totalCount 
    } = useComicsData()

    const [currentType, setCurrentType] = useAtom(__comicsTypeAtom)
    const [searchQuery, setSearchQuery] = useAtom(__comicsSearchAtom)
    const [selectedGenres, setSelectedGenres] = useAtom(__comicsGenreFilterAtom)

    // Get current list based on type
    const currentList = React.useMemo(() => {
        return getListByType(currentType)
    }, [getListByType, currentType])

    // Filter by search query
    const filteredEntries = React.useMemo(() => {
        if (!currentList?.entries) return []
        if (!searchQuery) return currentList.entries

        const query = searchQuery.toLowerCase()
        return currentList.entries.filter(entry => {
            const title = entry.title?.toLowerCase() || ""
            return title.includes(query)
        })
    }, [currentList, searchQuery])

    // Filter by genres
    const genreFilteredEntries = React.useMemo(() => {
        if (selectedGenres.length === 0) return filteredEntries
        
        return filteredEntries.filter(entry => {
            return selectedGenres.some(genre => 
                entry.genres?.includes(genre)
            )
        })
    }, [filteredEntries, selectedGenres])

    // Sort entries
    const sortedEntries = React.useMemo(() => {
        const entries = [...genreFilteredEntries]
        
        switch (mangaLibraryCollectionDefaultSorting) {
            case "TITLE":
                return entries.sort((a, b) => a.title.localeCompare(b.title))
            case "SCORE":
                return entries.sort((a, b) => (b.score || 0) - (a.score || 0))
            case "PROGRESS":
                return entries.sort((a, b) => (b.progress || 0) - (a.progress || 0))
            case "CHAPTERS_READ":
                return entries.sort((a, b) => (b.chaptersRead || 0) - (a.chaptersRead || 0))
            default:
                return entries
        }
    }, [genreFilteredEntries, mangaLibraryCollectionDefaultSorting])

    // Get all genres for current type
    const genres = React.useMemo(() => {
        const genreSet = new Set<string>()
        currentList?.entries?.forEach(entry => {
            entry.genres?.forEach(g => genreSet.add(g))
        })
        return Array.from(genreSet).sort((a, b) => a.localeCompare(b))
    }, [currentList])

    // Get featured comic (first entry or random)
    const featuredComic = React.useMemo(() => {
        if (sortedEntries.length === 0) return null
        // Return first entry or a random one
        return sortedEntries[0]
    }, [sortedEntries])

    const hasComics = totalCount > 0
    const currentCount = currentList?.count || 0

    const toggleGenre = React.useCallback((genre: string) => {
        setSelectedGenres(draft => {
            if (draft.includes(genre)) {
                return draft.filter(g => g !== genre)
            } else {
                return [...draft, genre]
            }
        })
    }, [setSelectedGenres])

    const clearFilters = React.useCallback(() => {
        setSelectedGenres([])
        setSearchQuery("")
    }, [setSelectedGenres, setSearchQuery])

    return {
        // Data
        entries: sortedEntries,
        stats,
        currentList,
        
        // Loading state
        isLoading,
        
        // Type selection
        currentType,
        setCurrentType,
        
        // Search
        searchQuery,
        setSearchQuery,
        
        // Filters
        genres,
        selectedGenres,
        toggleGenre,
        clearFilters,
        
        // Featured
        featuredComic,
        
        // Counts
        hasComics,
        currentCount,
        totalCount,
        
        // Actions
        refetch,
    }
}

// Legacy hook for backward compatibility
// Uses the old manga collection approach
export function useComicsLegacy() {
    const router = useRouter()
    const [currentType, setCurrentType] = useAtom(__comicsTypeAtom)
    
    return {
        currentType,
        setCurrentType,
        isLoading: false,
        hasComics: false,
    }
}
