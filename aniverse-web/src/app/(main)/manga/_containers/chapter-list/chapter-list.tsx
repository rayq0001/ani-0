import { AL_MangaDetailsById_Media, HibikeManga_ChapterDetails, Manga_Entry, Manga_MediaDownloadData } from "@/api/generated/types"
import { useEmptyMangaEntryCache } from "@/api/hooks/manga.hooks"
import { SeaCommandInjectableItem, useSeaCommandInject } from "@/app/(main)/_features/sea-command/use-inject"
import { ChapterListBulkActions } from "@/app/(main)/manga/_containers/chapter-list/_components/chapter-list-bulk-actions"
import { DownloadedChapterList, manga_downloadedChapterContainerAtom } from "@/app/(main)/manga/_containers/chapter-list/downloaded-chapter-list"
import { MangaManualMappingModal } from "@/app/(main)/manga/_containers/chapter-list/manga-manual-mapping-modal"
import { ChapterReaderDrawer } from "@/app/(main)/manga/_containers/chapter-reader/chapter-reader-drawer"
import { __manga_selectedChapterAtom } from "@/app/(main)/manga/_lib/handle-chapter-reader"
import { useHandleMangaChapters } from "@/app/(main)/manga/_lib/handle-manga-chapters"
import { useHandleDownloadMangaChapter } from "@/app/(main)/manga/_lib/handle-manga-downloads"
import { getChapterNumberFromChapter, useMangaChapterListRowSelection, useMangaDownloadDataUtils } from "@/app/(main)/manga/_lib/handle-manga-utils"
import { LANGUAGES_LIST } from "@/app/(main)/manga/_lib/language-map"
import { monochromeCheckboxClasses } from "@/components/shared/classnames"
import { ConfirmationDialog, useConfirmationDialog } from "@/components/shared/confirmation-dialog"
import { LuffyError } from "@/components/shared/luffy-error"
import { Alert } from "@/components/ui/alert"
import { Button, IconButton } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataGrid, defineDataGridColumns } from "@/components/ui/datagrid"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Select } from "@/components/ui/select"
import { useAtom, useSetAtom } from "jotai/react"
import React from "react"
import { ErrorBoundary } from "react-error-boundary"
import { FaRedo } from "react-icons/fa"
import { GiOpenBook } from "react-icons/gi"
import { IoBookOutline, IoLibrary } from "react-icons/io5"
import { LuDownload } from "react-icons/lu"
import { LuSearch } from "react-icons/lu"
import { MdOutlineOfflinePin } from "react-icons/md"

type ChapterListProps = {
    mediaId: string | null
    entry: Manga_Entry
    details: AL_MangaDetailsById_Media | undefined
    downloadData: Manga_MediaDownloadData | undefined
    downloadDataLoading: boolean
}

export function ChapterList(props: ChapterListProps) {

    const {
        mediaId,
        entry,
        details,
        downloadData,
        downloadDataLoading,
        ...rest
    } = props

    /**
     * Find chapter container
     */
    const {
        selectedExtension,
        providerExtensionsLoading,
        // Selected provider
        providerOptions, // For dropdown
        selectedProvider, // Current provider (id)
        setSelectedProvider,
        // Filters
        selectedFilters,
        setSelectedLanguage,
        setSelectedScanlator,
        languageOptions,
        scanlatorOptions,
        // Chapters
        chapterContainer,
        chapterContainerLoading,
        chapterContainerError,
    } = useHandleMangaChapters(mediaId)


    // Keep track of chapter numbers as integers
    // This is used to filter the chapters
    // [id]: number
    const chapterIdToNumbersMap = React.useMemo(() => {
        const map = new Map<string, number>()

        for (const chapter of chapterContainer?.chapters ?? []) {
            map.set(chapter.id, getChapterNumberFromChapter(chapter.chapter))
        }

        return map
    }, [chapterContainer?.chapters])

    const [showUnreadChapter, setShowUnreadChapter] = React.useState(false)
    const [showDownloadedChapters, setShowDownloadedChapters] = React.useState(false)

    /**
     * Set selected chapter
     */
    const setSelectedChapter = useSetAtom(__manga_selectedChapterAtom)
    /**
     * Clear manga cache
     */
    const { mutate: clearMangaCache, isPending: isClearingMangaCache } = useEmptyMangaEntryCache()
    /**
     * Download chapter
     */
    const { downloadChapters, isSendingDownloadRequest } = useHandleDownloadMangaChapter(mediaId)
    /**
     * Download data utils
     */
    const {
        isChapterQueued,
        isChapterDownloaded,
        isChapterLocal,
    } = useMangaDownloadDataUtils(downloadData, downloadDataLoading)

    const { inject, remove } = useSeaCommandInject()

    /**
     * Function to filter unread chapters
     */
    const retainUnreadChapters = React.useCallback((chapter: HibikeManga_ChapterDetails) => {
        if (!entry.listData || !chapterIdToNumbersMap.has(chapter.id) || !entry.listData?.progress) return true

        const chapterNumber = chapterIdToNumbersMap.get(chapter.id)
        return !!chapterNumber && chapterNumber > entry.listData?.progress
    }, [chapterIdToNumbersMap, chapterContainer, entry])

    const confirmReloadSource = useConfirmationDialog({
        title: "Reload sources",
        actionIntent: "primary",
        actionText: "Reload",
        description: "This action will empty the cache for this manga and fetch the latest data from the selected source.",
        onConfirm: () => {
            if (mediaId) {
                clearMangaCache({ mediaId: Number(mediaId) })
            }
        },
    })

    /**
     * Chapter columns
     */
    const columns = React.useMemo(() => defineDataGridColumns<HibikeManga_ChapterDetails>(() => [
        {
            accessorKey: "title",
            header: "Name",
            size: 90,
        },
        ...(selectedExtension?.settings?.supportsMultiScanlator ? [{
            id: "scanlator",
            header: "Scanlator",
            size: 30,
            accessorFn: (row: any) => row.scanlator,
            enableSorting: true,
            cell: ({ getValue }: any) => <span className="text-sm text-[--muted]">{getValue()}</span>,
        }] : []),
        ...(selectedExtension?.settings?.supportsMultiLanguage ? [{
            id: "language",
            header: "Language",
            size: 40,
            accessorFn: (row: any) => LANGUAGES_LIST[row.language]?.nativeName || row.language,
            enableSorting: true,
            cell: ({ getValue }: any) => <span className="text-sm text-[--muted]">{getValue()}</span>,
        }] : []),
        {
            id: "number",
            header: "Number",
            size: 10,
            enableSorting: true,
            accessorFn: (row) => {
                return chapterIdToNumbersMap.get(row.id)
            },
        },
        {
            id: "_actions",
            size: 10,
            enableSorting: false,
            enableGlobalFilter: false,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-end gap-2 items-center w-full">
                        {(!isChapterLocal(row.original) && !isChapterDownloaded(row.original) && !isChapterQueued(row.original)) && <IconButton
                            intent="gray-basic"
                            size="sm"
                            disabled={isSendingDownloadRequest}
                            onClick={() => downloadChapters([row.original])}
                            icon={<LuDownload className="text-xl" />}
                            className="opacity-50 hover:opacity-100"
                        />}
                        {isChapterQueued(row.original) && <p className="text-[--muted]">Queued</p>}
                        {isChapterDownloaded(row.original) && <p className="text-[--green] px-1"><MdOutlineOfflinePin className="text-2xl" /></p>}
                        <IconButton
                            intent="gray-subtle"
                            size="md"
                            onClick={() => setSelectedChapter({
                                chapterId: row.original.id,
                                chapterNumber: row.original.chapter,
                                provider: row.original.provider,
                                mediaId: Number(mediaId),
                            })}
                            icon={<GiOpenBook />}
                        />
                    </div>
                )
            },
        },
    ]), [chapterIdToNumbersMap, selectedExtension, isSendingDownloadRequest, isChapterDownloaded, downloadData, mediaId])

    const unreadChapters = React.useMemo(() => chapterContainer?.chapters?.filter(ch => retainUnreadChapters(ch)) ?? [], [chapterContainer, entry])
    const allChapters = React.useMemo(() => chapterContainer?.chapters?.toReversed() ?? [], [chapterContainer])

    /**
     * Set "showUnreadChapter" state if there are unread chapters
     */
    React.useLayoutEffect(() => {
        setShowUnreadChapter(!!unreadChapters.length)
    }, [unreadChapters?.length])

    /**
     * Filter chapters based on state
     */
    const chapters = React.useMemo(() => {
        let d = showUnreadChapter ? unreadChapters : allChapters
        if (showDownloadedChapters) {
            d = d.filter(ch => isChapterDownloaded(ch) || isChapterQueued(ch))
        }
        return d
    }, [
        showUnreadChapter, unreadChapters, allChapters, showDownloadedChapters, downloadData, selectedExtension,
    ])

    const {
        rowSelectedChapters,
        onRowSelectionChange,
        rowSelection,
        setRowSelection,
        resetRowSelection,
        // setSelectedChapters,
    } = useMangaChapterListRowSelection()

    React.useEffect(() => {
        resetRowSelection()
    }, [])

    // Inject chapter list command
    React.useEffect(() => {
        if (!chapterContainer?.chapters?.length) return

        const nextChapter = unreadChapters[0]
        const upcomingChapters = unreadChapters.slice(0, 10)

        const commandItems: SeaCommandInjectableItem[] = [
            // Next chapter
            ...(nextChapter ? [{
                data: nextChapter,
                id: `next-chapter-${nextChapter.id}`,
                value: `${nextChapter.chapter}`,
                heading: "Next Chapter",
                priority: 2,
                render: () => (
                    <div className="flex gap-1 items-center w-full">
                        <p className="max-w-[70%] truncate">Chapter {nextChapter.chapter}</p>
                        {nextChapter.scanlator && (
                            <p className="text-[--muted]">({nextChapter.scanlator})</p>
                        )}
                    </div>
                ),
                onSelect: ({ ctx }) => {
                    setSelectedChapter({
                        chapterId: nextChapter.id,
                        chapterNumber: nextChapter.chapter,
                        provider: nextChapter.provider,
                        mediaId: Number(mediaId),
                    })
                    ctx.close()
                },
            } as SeaCommandInjectableItem] : []),
            // Upcoming chapters
            ...upcomingChapters.map(chapter => ({
                data: chapter,
                id: `chapter-${chapter.id}`,
                value: `${chapter.chapter}`,
                heading: "Upcoming Chapters",
                priority: 1,
                render: () => (
                    <div className="flex gap-1 items-center w-full">
                        <p className="max-w-[70%] truncate">Chapter {chapter.chapter}</p>
                        {chapter.scanlator && (
                            <p className="text-[--muted]">({chapter.scanlator})</p>
                        )}
                    </div>
                ),
                onSelect: ({ ctx }) => {
                    setSelectedChapter({
                        chapterId: chapter.id,
                        chapterNumber: chapter.chapter,
                        provider: chapter.provider,
                        mediaId: Number(mediaId),
                    })
                    ctx.close()
                },
            } as SeaCommandInjectableItem)),
        ]

        inject("manga-chapters", {
            items: commandItems,
            filter: ({ item, input }) => {
                if (!input) return true
                return item.value.toLowerCase().includes(input.toLowerCase()) ||
                    (item.data.title?.toLowerCase() || "").includes(input.toLowerCase())
            },
            priority: 100,
        })

        return () => remove("manga-chapters")
    }, [chapterContainer?.chapters, unreadChapters, mediaId])

    const [downloadedChapterContainer] = useAtom(manga_downloadedChapterContainerAtom)

    console.log({ scanlatorOptions, languageOptions, selectedFilters })

    if (providerExtensionsLoading) return <LoadingSpinner />

    return (
        <div
            className="space-y-4"
            data-chapter-list-container
            data-selected-filters={JSON.stringify(selectedFilters)}
            data-selected-provider={JSON.stringify(selectedProvider)}
        >

            <div data-chapter-list-header-container className="flex flex-wrap gap-2 items-center">
                <Select
                    fieldClass="w-fit"
                    options={providerOptions}
                    value={selectedProvider || ""}
                    onValueChange={v => setSelectedProvider({
                        mId: mediaId,
                        provider: v,
                    })}
                    leftAddon="Source"
                    size="sm"
                    disabled={isClearingMangaCache}
                />

                <Button
                    leftIcon={<FaRedo />}
                    intent="gray-outline"
                    onClick={() => confirmReloadSource.open()}
                    loading={isClearingMangaCache}
                    size="sm"
                >
                    Reload sources
                </Button>

                <MangaManualMappingModal entry={entry}>
                    <Button
                        leftIcon={<LuSearch className="text-lg" />}
                        intent="gray-outline"
                        size="sm"
                    >
                        Manual match
                    </Button>
                </MangaManualMappingModal>
            </div>

            <ErrorBoundary
                fallbackRender={({ error }) => <Alert
                    intent="alert"
                    title="Client side error"
                    description={`Could not load chapter filters. Please contact the extension developer: "${error}"`}
                />}
            >
                {(selectedExtension?.settings?.supportsMultiLanguage || selectedExtension?.settings?.supportsMultiScanlator) && (
                    <div data-chapter-list-header-filters-container className="flex gap-2 items-center">
                        {selectedExtension?.settings?.supportsMultiScanlator && (
                            <>
                                <Select
                                    fieldClass="w-64"
                                    options={scanlatorOptions}
                                    placeholder="All"
                                    value={selectedFilters.scanlators[0] || ""}
                                    onValueChange={v => setSelectedScanlator({
                                        mId: mediaId,
                                        scanlators: [v],
                                    })}
                                    leftAddon="Scanlator"
                                    // intent="filled"
                                    // size="sm"
                                />
                            </>
                        )}
                        {selectedExtension?.settings?.supportsMultiLanguage && (
                            <Select
                                fieldClass="w-64"
                                options={languageOptions}
                                placeholder="All"
                                value={selectedFilters.language}
                                onValueChange={v => setSelectedLanguage({
                                    mId: mediaId,
                                    language: v,
                                })}
                                leftAddon="Language"
                                // intent="filled"
                                // size="sm"
                            />
                        )}
                    </div>
                )}
            </ErrorBoundary>

            {(chapterContainerLoading || isClearingMangaCache) ? (
                <div className="flex justify-center p-20 bg-black/20 backdrop-blur-md rounded-3xl border border-white/5">
                    <LoadingSpinner />
                </div>
            ) : (
                chapterContainerError ? <LuffyError title="No chapters found">
                    <MangaManualMappingModal entry={entry}>
                        <Button
                            leftIcon={<LuSearch className="text-lg" />}
                            intent="primary"
                            rounded
                            size="md"
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/20"
                        >
                            Manual match
                        </Button>
                    </MangaManualMappingModal>
                </LuffyError> : (
                    <>

                        {chapterContainer?.chapters?.length === 0 && (
                            <LuffyError title="No chapters found"><p>Try another source</p></LuffyError>
                        )}

                        {!!chapterContainer?.chapters?.length && (
                            <div className="relative">
                                {/* Glowing backdrop for chapter list */}
                                <div className="absolute -inset-2 bg-gradient-to-br from-purple-500/5 to-transparent rounded-[2.5rem] blur-2xl pointer-events-none" />
                                
                                <div data-chapter-list-header-container className="flex gap-4 items-center w-full pb-4 px-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                        <h2 className="text-2xl font-bold text-white/90">Chapters</h2>
                                    </div>
                                    <div className="flex flex-1"></div>
                                    <div>
                                        {!!unreadChapters?.length && (
                                            <div className="relative group">
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
                                                <Button
                                                    intent="white"
                                                    rounded
                                                    leftIcon={<IoBookOutline />}
                                                    disabled={!unreadChapters?.length || (!!entry.listData?.progress && parseInt(unreadChapters[0].chapter) !== entry.listData?.progress + 1)}
                                                    onClick={() => {
                                                        setSelectedChapter({
                                                            chapterId: unreadChapters[0].id,
                                                            chapterNumber: unreadChapters[0].chapter,
                                                            provider: unreadChapters[0].provider,
                                                            mediaId: Number(mediaId),
                                                        })
                                                    }}
                                                    className="relative bg-white text-black hover:scale-105 transition-transform"
                                                >
                                                    {!!entry.listData?.progress ? "Continue reading" : "Start reading"}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div data-chapter-list-bulk-actions-container className="space-y-6 rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden">
                                    {/* Glass Shine Effect */}
                                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                                    <div data-chapter-list-bulk-actions-checkboxes-container className="flex flex-wrap items-center gap-6 pb-2">
                                        <Checkbox
                                            label="Show unread"
                                            value={showUnreadChapter}
                                            onValueChange={v => setShowUnreadChapter(v as boolean)}
                                            fieldClass="w-fit scale-110"
                                            {...monochromeCheckboxClasses}
                                        />
                                        {selectedProvider !== "local-manga" && <Checkbox
                                            label={<span className="flex gap-2 items-center"><IoLibrary className="text-purple-400" /> Downloaded</span>}
                                            value={showDownloadedChapters}
                                            onValueChange={v => setShowDownloadedChapters(v as boolean)}
                                            fieldClass="w-fit scale-110"
                                            {...monochromeCheckboxClasses}
                                        />}
                                    </div>

                                    <div className="border-t border-white/5 pt-4">
                                        <ChapterListBulkActions
                                            rowSelectedChapters={rowSelectedChapters}
                                            onDownloadSelected={chapters => {
                                                downloadChapters(chapters)
                                                resetRowSelection()
                                            }}
                                        />
                                    </div>

                                    <div className="relative rounded-2xl overflow-hidden border border-white/5">
                                        <DataGrid<HibikeManga_ChapterDetails>
                                            columns={columns}
                                            data={chapters}
                                            rowCount={chapters.length}
                                            isLoading={chapterContainerLoading}
                                            rowSelectionPrimaryKey="id"
                                            enableRowSelection={row => (!isChapterDownloaded(row.original) && !isChapterQueued(row.original))}
                                            initialState={{
                                                pagination: {
                                                    pageIndex: 0,
                                                    pageSize: 10,
                                                },
                                            }}
                                            state={{
                                                rowSelection,
                                            }}
                                            hideColumns={[
                                                {
                                                    below: 800,
                                                    hide: ["number"],
                                                },
                                                {
                                                    below: 600,
                                                    hide: ["scanlator", "language"],
                                                },
                                            ]}
                                            onRowSelect={onRowSelectionChange}
                                            onRowSelectionChange={setRowSelection}
                                            className="premium-datagrid"
                                            tableClass="table-fixed lg:table-fixed border-collapse"
                                            tableBodyClass="border-0 bg-transparent"
                                            tdClass="border-white/5 p-4 first:pl-6 last:pr-6"
                                            trClass="hover:bg-white/5 transition-colors group/row border-b border-white/5 last:border-0"
                                            thClass="bg-white/5 text-purple-400/80 font-bold uppercase tracking-wider text-xs p-4 first:pl-6 last:pr-6 border-b border-white/10"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                    </>
                )
            )}

            {(chapterContainer || downloadedChapterContainer) && <ChapterReaderDrawer
                entry={entry}
                chapterContainer={chapterContainer || downloadedChapterContainer!}
                chapterIdToNumbersMap={chapterIdToNumbersMap}
            />}

            <DownloadedChapterList
                entry={entry}
                data={downloadData}
            />

            <ConfirmationDialog {...confirmReloadSource} />
        </div>
    )
}

