"use client"

import { Manga_CollectionEntry } from "@/api/generated/types"
import { DiscoverPageHeader } from "@/app/(main)/discover/_components/discover-page-header"
import { __discord_pageTypeAtom } from "@/app/(main)/discover/_lib/discover.atoms"
import { MediaEntryCard } from "@/app/(main)/_features/media/_components/media-entry-card"
import { MediaEntryCardSkeleton } from "@/app/(main)/_features/media/_components/media-entry-card-skeleton"
import { __discover_randomTrendingAtom } from "@/app/(main)/discover/_containers/discover-trending"
import { useHandleMangaCollection } from "@/app/(main)/manga/_lib/handle-manga-collection"
import { Carousel, CarouselContent, CarouselDotButtons } from "@/components/ui/carousel"
import { useAtom, useSetAtom } from "jotai/react"
import { motion } from "motion/react"
import React from "react"

export function MangaDiscoveryView() {
    const { mangaCollection, mangaCollectionLoading } = useHandleMangaCollection()
    const [, setPageType] = useAtom(__discord_pageTypeAtom)
    const setRandomTrending = useSetAtom(__discover_randomTrendingAtom)

    // Force page type to manga for the header
    React.useEffect(() => {
        setPageType("manga")
        
        // Pick a random manga from the collection for the hero header if none set
        if (mangaCollection?.lists?.length) {
            const allEntries = mangaCollection.lists.flatMap(l => l.entries)
            if (allEntries.length > 0) {
                const randomEntry = allEntries[Math.floor(Math.random() * allEntries.length)]
                if (randomEntry?.media) {
                    setRandomTrending(randomEntry.media as any)
                }
            }
        }
    }, [mangaCollection])

    if (mangaCollectionLoading) {
        return (
            <div className="space-y-10 p-4 md:p-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-4">
                        <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />
                        <div className="flex gap-4 overflow-hidden">
                            {[...Array(5)].map((_, j) => (
                                <MediaEntryCardSkeleton key={j} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const sections = mangaCollection?.lists?.map(list => ({
        title: list?.status,
        entries: list?.entries
    })).filter(s => (s.entries?.length ?? 0) > 0)

    return (
        <div className="relative pb-20">
            <DiscoverPageHeader />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative z-[4] -mt-10 space-y-12 px-4 md:px-8"
            >
                {sections?.map((section) => (
                    <div key={section.title} className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                            <h2 className="text-2xl font-bold text-white/90 capitalize">
                                {section.title === "CURRENT" ? "Currently Reading" : 
                                 section.title === "PLANNING" ? "Plan to Read" : 
                                 section.title === "COMPLETED" ? "Completed" : 
                                 section.title === "DROPPED" ? "Dropped" : 
                                 section.title === "PAUSED" ? "Paused" : section.title}
                            </h2>
                        </div>

                        {section.entries && <Carousel
                            className="w-full max-w-full"
                            gap="xl"
                            opts={{
                                align: "start",
                                dragFree: true,
                            }}
                        >
                            <CarouselDotButtons flag={section.entries} />
                            <CarouselContent className="px-2">
                                {section.entries.map((entry: Manga_CollectionEntry) => (
                                    <MediaEntryCard
                                        key={entry.mediaId}
                                        media={entry.media!}
                                        containerClassName="basis-[180px] md:basis-[220px] transition-transform hover:scale-105"
                                        type="manga"
                                    />
                                ))}
                            </CarouselContent>
                        </Carousel>}
                    </div>
                ))}

                {(!sections || sections.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="text-6xl opacity-20">📚</div>
                        <h3 className="text-xl font-medium text-white/50">No manga in your library yet</h3>
                    </div>
                )}
            </motion.div>
        </div>
    )
}
