import { AL_MediaListStatus, Manga_Collection, Manga_CollectionList } from "@/api/generated/types"
import { useRefetchMangaChapterContainers } from "@/api/hooks/manga.hooks"
import { MediaCardLazyGrid } from "@/app/(main)/_features/media/_components/media-card-grid"
import { MediaEntryCard } from "@/app/(main)/_features/media/_components/media-entry-card"
import { MediaGenreSelector } from "@/app/(main)/_features/media/_components/media-genre-selector"
import { PluginWebviewSlot } from "@/app/(main)/_features/plugin/webview/plugin-webviews"
import { SeaCommandInjectableItem, useSeaCommandInject } from "@/app/(main)/_features/sea-command/use-inject"
import { seaCommand_compareMediaTitles } from "@/app/(main)/_features/sea-command/utils"
import { __mangaLibraryHeaderImageAtom, __mangaLibraryHeaderMangaAtom } from "@/app/(main)/manga/_components/library-header"
import { __mangaLibrary_paramsAtom, __mangaLibrary_paramsInputAtom } from "@/app/(main)/manga/_lib/handle-manga-collection"
import { LuffyError } from "@/components/shared/luffy-error"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { SeaLink } from "@/components/shared/sea-link"
import { TextGenerateEffect } from "@/components/shared/text-generate-effect"
import { Button, IconButton } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselDotButtons } from "@/components/ui/carousel"
import { cn } from "@/components/ui/core/styling"
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useDebounce } from "@/hooks/use-debounce"
import { useRouter } from "@/lib/navigation"
import { getMangaCollectionTitle } from "@/lib/server/utils"
import { ThemeLibraryScreenBannerType, useThemeSettings } from "@/lib/theme/theme-hooks"
import { useSetAtom } from "jotai"
import { useAtom, useAtomValue } from "jotai/react"
import { AnimatePresence, motion } from "motion/react"
import React, { memo } from "react"
import { BiDotsVertical } from "react-icons/bi"
import { LuBookOpenCheck, LuRefreshCcw, LuSparkles } from "react-icons/lu"
import { toast } from "sonner"
import { CommandItemMedia } from "../../_features/sea-command/_components/command-utils"

type MangaPremiumViewProps = {
    collection: Manga_Collection
    filteredCollection: Manga_Collection | undefined
    genres: string[]
    storedProviders: Record<string, string>
    hasManga: boolean
    showStatuses?: AL_MediaListStatus[]
    type?: "carousel" | "grid"
    withTitle?: boolean
}

/**
 * MangaPremiumView
 * A completely redesigned Manga Library view with the "Liquid Glass" Aniverse aesthetic.
 */
export function MangaPremiumView(props: MangaPremiumViewProps) {
    const {
        collection,
        filteredCollection,
        genres,
        storedProviders,
        hasManga,
        showStatuses,
        type = "grid",
        withTitle = true,
    } = props

    const [params] = useAtom(__mangaLibrary_paramsAtom)

    return (
        <div className="relative min-h-screen">
            {/* Background Decorative Element */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[100px]" />
            </div>

            <PageWrapper
                key="premium-lists"
                className="relative z-10 2xl:order-first pb-10 p-4 md:p-8"
            >
                <AnimatePresence mode="wait" initial={false}>
                    {!!collection && !hasManga && (
                        <LuffyError title="Explore - No Manga Found">
                            <div className="space-y-4">
                                <p className="text-[--muted]">
                                    Your library is currently empty. Start adding some featured titles.
                                </p>
                                <div className="pt-2">
                                    <SeaLink href="/discover?type=manga">
                                        <Button 
                                            intent="primary" 
                                            rounded 
                                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300"
                                        >
                                            Browse Manga
                                        </Button>
                                    </SeaLink>
                                </div>
                            </div>
                        </LuffyError>
                    )}

                    {!params.genre?.length ? (
                        <PremiumCollectionLists
                            key="lists"
                            collectionList={collection}
                            genres={genres}
                            storedProviders={storedProviders}
                            showStatuses={showStatuses}
                            type={type}
                            withTitle={withTitle}
                        />
                    ) : (
                        <PremiumFilteredCollectionLists
                            key="filtered-collection"
                            collectionList={filteredCollection}
                            genres={genres}
                            showStatuses={showStatuses}
                            type={type}
                        />
                    )}
                </AnimatePresence>

                <PluginWebviewSlot slot="manga-screen-bottom" />
            </PageWrapper>
        </div>
    )
}

function PremiumCollectionLists({ collectionList, genres, storedProviders, showStatuses, type, withTitle }: {
    collectionList: Manga_Collection | undefined
    genres: string[]
    storedProviders: Record<string, string>
    showStatuses?: AL_MediaListStatus[]
    type?: "carousel" | "grid"
    withTitle?: boolean
}) {
    const lists = collectionList?.lists?.filter(list => {
        if (!showStatuses) return true
        return list.type && showStatuses.includes(list.type)
    })

    return (
        <div className="space-y-12">
            {lists?.map((collection, idx) => {
                if (!collection.entries?.length) return null
                return (
                    <motion.div 
                        key={collection.type}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <PremiumCollectionListItem
                            list={collection}
                            storedProviders={storedProviders}
                            showStatuses={showStatuses}
                            type={type}
                            withTitle={withTitle}
                        />
                        {(collection.type === "CURRENT" && !!genres?.length) && (
                            <div className="mt-8">
                                <PremiumGenreSelector genres={genres} />
                            </div>
                        )}
                    </motion.div>
                )
            })}
        </div>
    )
}

function PremiumFilteredCollectionLists({ collectionList, genres, showStatuses, type }: {
    collectionList: Manga_Collection | undefined
    genres: string[]
    showStatuses?: AL_MediaListStatus[]
    type?: "carousel" | "grid"
}) {
    const entries = React.useMemo(() => {
        return collectionList?.lists?.flatMap(n => n.entries).filter(Boolean).filter(entry => {
            if (!showStatuses) return true
            return entry.listData?.status && showStatuses.includes(entry.listData.status)
        }) ?? []
    }, [collectionList, showStatuses])

    return (
        <div className="space-y-8">
            {!!genres?.length && (
                <div className="mt-8 flex justify-center">
                    <PremiumGenreSelector genres={genres} />
                </div>
            )}

            {type === "grid" ? (
                <MediaCardLazyGrid itemCount={entries?.length || 0}>
                    {entries.map(entry => (
                        <PremiumMediaCardWrapper key={entry.media?.id} entry={entry} />
                    ))}
                </MediaCardLazyGrid>
            ) : (
                <Carousel
                    className="w-full !mt-0"
                    gap="xl"
                    opts={{ align: "start", dragFree: true }}
                >
                    <CarouselDotButtons className="-top-2" />
                    <CarouselContent className="px-6">
                        {entries.map(entry => (
                            <PremiumMediaCardWrapper 
                                key={entry.media?.id} 
                                entry={entry} 
                                isCarousel 
                            />
                        ))}
                    </CarouselContent>
                </Carousel>
            )}
        </div>
    )
}

const PremiumCollectionListItem = memo(({ list, storedProviders, type, withTitle }: {
    list: Manga_CollectionList,
    storedProviders: Record<string, string>,
    showStatuses?: AL_MediaListStatus[],
    type?: "carousel" | "grid",
    withTitle?: boolean
}) => {
    const ts = useThemeSettings()
    const [currentHeaderImage, setCurrentHeaderImage] = useAtom(__mangaLibraryHeaderImageAtom)
    const headerManga = useAtomValue(__mangaLibraryHeaderMangaAtom)
    const [params, setParams] = useAtom(__mangaLibrary_paramsAtom)
    const router = useRouter()
    const { mutate: refetchMangaChapterContainers, isPending: isRefetching } = useRefetchMangaChapterContainers()
    const { inject, remove } = useSeaCommandInject()

    React.useEffect(() => {
        if (list.type === "CURRENT" && currentHeaderImage === null && list.entries?.[0]?.media?.bannerImage) {
            setCurrentHeaderImage(list.entries?.[0]?.media?.bannerImage)
        }
    }, [])

    React.useEffect(() => {
        if (list.type === "CURRENT" && list.entries?.length) {
            inject("currently-reading-manga", {
                items: list.entries.map(entry => ({
                    data: entry,
                    id: `manga-${entry.mediaId}`,
                    value: entry.media?.title?.userPreferred || "",
                    heading: "Currently Reading",
                    priority: 100,
                    render: () => <CommandItemMedia media={entry.media!} type="manga" />,
                    onSelect: () => router.push(`/manga/entry?id=${entry.mediaId}`),
                })),
                filter: ({ item, input }: any) => {
                    if (!input) return true
                    return seaCommand_compareMediaTitles((item.data as any)?.media?.title, input)
                },
                priority: 100,
            })
        }
        return () => remove("currently-reading-manga")
    }, [list.entries])

    const sectionTitle = list.type === "CURRENT" ? "Continue Reading" : getMangaCollectionTitle(list.type)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full" />
                    <h2 className="text-2xl font-bold tracking-tight text-white/90">
                        {sectionTitle}
                    </h2>
                    {list.type === "CURRENT" && (
                        <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full text-purple-400 text-xs font-medium animate-pulse">
                            <LuSparkles className="w-3 h-3" />
                            <span>New Updates</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {list.type === "CURRENT" && params.unreadOnly && (
                        <Button
                            intent="white-link"
                            size="xs"
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                            onClick={() => setParams(draft => { draft.unreadOnly = false })}
                        >
                            Show All
                        </Button>
                    )}

                    <DropdownMenu
                        trigger={
                            <IconButton
                                intent="white-basic"
                                size="sm"
                                className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors rounded-full"
                                icon={<BiDotsVertical className="text-white/60" />}
                            />
                        }
                    >
                        <DropdownMenuItem
                            onClick={() => {
                                if (isRefetching) return
                                toast.info("Updating sources...")
                                refetchMangaChapterContainers({ selectedProviderMap: storedProviders })
                            }}
                        >
                            <LuRefreshCcw className={cn("mr-2 h-4 w-4", isRefetching && "animate-spin")} />
                            {isRefetching ? "Updating..." : "Update Sources"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setParams(draft => { draft.unreadOnly = !draft.unreadOnly })}
                        >
                            <LuBookOpenCheck className="mr-2 h-4 w-4" />
                            {params.unreadOnly ? "Show All" : "Unread Chapters Only"}
                        </DropdownMenuItem>
                    </DropdownMenu>
                </div>
            </div>

            {(list.type === "CURRENT" && ts.libraryScreenBannerType === ThemeLibraryScreenBannerType.Dynamic && headerManga && withTitle) && (
                <TextGenerateEffect
                    words={headerManga?.title?.userPreferred || ""}
                    className="text-3xl lg:text-5xl font-black text-white/80 line-clamp-1 pb-2"
                />
            )}

            {type === "grid" ? (
                <MediaCardLazyGrid itemCount={list.entries?.length ?? 0}>
                    {list.entries?.map(entry => (
                        <div key={entry.media?.id} onMouseEnter={() => {
                            if (list.type === "CURRENT" && entry.media?.bannerImage) {
                                React.startTransition(() => setCurrentHeaderImage(entry.media?.bannerImage!))
                            }
                        }}>
                            <PremiumMediaCardWrapper entry={entry} />
                        </div>
                    ))}
                </MediaCardLazyGrid>
            ) : (
                <Carousel
                    className="w-full !mt-0"
                    gap="xl"
                    opts={{ align: "start", dragFree: true }}
                >
                    <CarouselDotButtons className="-top-2" />
                    <CarouselContent className="px-6">
                        {list.entries?.map(entry => (
                            <div
                                key={entry.media?.id}
                                className="relative basis-[200px] md:basis-[250px] mx-2 mt-8 mb-4"
                                onMouseEnter={() => {
                                    if (list.type === "CURRENT" && entry.media?.bannerImage) {
                                        React.startTransition(() => setCurrentHeaderImage(entry.media?.bannerImage!))
                                    }
                                }}
                            >
                                <PremiumMediaCardWrapper entry={entry} isCarousel />
                            </div>
                        ))}
                    </CarouselContent>
                </Carousel>
            )}
        </div>
    )
})

/**
 * PremiumMediaCardWrapper
 * Wraps the standard MediaEntryCard with a Liquid Glass effect.
 */
function PremiumMediaCardWrapper({ entry, isCarousel }: { entry: any, isCarousel?: boolean }) {
    return (
        <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
                "relative group rounded-2xl overflow-hidden",
                "bg-black/40 backdrop-blur-md border border-white/10",
                "shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
                "hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]",
                "transition-all duration-300"
            )}
        >
            {/* Internal Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <MediaEntryCard
                media={entry.media!}
                listData={entry.listData}
                showListDataButton
                withAudienceScore={false}
                type="manga"
                containerClassName="border-none bg-transparent shadow-none"
            />

            {/* Premium Overlay for "Current" status */}
            {entry.listData?.status === "CURRENT" && (
                <div className="absolute top-2 left-2 z-20">
                    <div className="bg-purple-600/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-purple-400/30">
                        Ongoing
                    </div>
                </div>
            )}
        </motion.div>
    )
}

function PremiumGenreSelector({ genres }: { genres: string[] }) {
    const [params, setParams] = useAtom(__mangaLibrary_paramsInputAtom)
    const setActualParams = useSetAtom(__mangaLibrary_paramsAtom)
    const debouncedParams = useDebounce(params, 200)

    React.useEffect(() => {
        setActualParams(params)
    }, [debouncedParams, setActualParams])

    if (!genres.length) return null

    return (
        <div className="max-w-full overflow-x-auto pb-4 no-scrollbar">
            <MediaGenreSelector
                className="bg-black/30 backdrop-blur-xl border border-white/10 p-1 rounded-2xl"
                items={genres.map(genre => ({
                    name: genre,
                    isCurrent: params!.genre?.includes(genre) ?? false,
                    onClick: () => setParams(draft => {
                        if (draft.genre?.includes(genre)) {
                            draft.genre = draft.genre?.filter(g => g !== genre)
                        } else {
                            draft.genre = [...(draft.genre || []), genre]
                        }
                    }),
                }))}
            />
        </div>
    )
}
