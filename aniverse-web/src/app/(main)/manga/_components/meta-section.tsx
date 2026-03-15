import { AL_MangaDetailsById_Media, Manga_Entry } from "@/api/generated/types"
import {
    AnimeEntryRankings,
    MediaEntryAudienceScore,
    MediaEntryGenresList,
} from "@/app/(main)/_features/media/_components/media-entry-metadata-components"
import {
    MediaPageHeader,
    MediaPageHeaderDetailsContainer,
    MediaPageHeaderEntryDetails,
} from "@/app/(main)/_features/media/_components/media-page-header-components"
import { MediaSyncTrackButton } from "@/app/(main)/_features/media/_containers/media-sync-track-button"
import { PluginWebviewSlot } from "@/app/(main)/_features/plugin/webview/plugin-webviews"
import { SeaLink } from "@/components/shared/sea-link"
import { IconButton } from "@/components/ui/button"
import { cn } from "@/components/ui/core/styling"
import { Tooltip } from "@/components/ui/tooltip"
import { getCustomSourceExtensionId, getCustomSourceMediaSiteUrl, isCustomSource } from "@/lib/server/utils"
import { ThemeMediaPageInfoBoxSize, useThemeSettings } from "@/lib/theme/theme-hooks"
import React from "react"
import { BiExtension } from "react-icons/bi"
import { LuExternalLink } from "react-icons/lu"
import { SiAnilist } from "react-icons/si"
import { PluginMangaPageButtons } from "../../_features/plugin/actions/plugin-actions"


export function MetaSection(props: { entry: Manga_Entry | undefined, details: AL_MangaDetailsById_Media | undefined }) {

    const { entry, details } = props
    const ts = useThemeSettings()

    if (!entry?.media) return null

    const Details = () => (
        <>
            <div
                className={cn(
                    "flex gap-2 flex-wrap items-center",
                    ts.mediaPageBannerInfoBoxSize === ThemeMediaPageInfoBoxSize.Fluid && "justify-center lg:justify-start lg:max-w-[65vw]",
                )}
            >
                <MediaEntryAudienceScore meanScore={entry.media?.meanScore} badgeClass="bg-transparent" />

                <MediaEntryGenresList genres={details?.genres} type="manga" />
            </div>

            <AnimeEntryRankings rankings={details?.rankings} />
        </>
    )

    return (
        <MediaPageHeader
            backgroundImage={entry.media?.bannerImage}
            coverImage={entry.media?.coverImage?.extraLarge}
        >

            <MediaPageHeaderDetailsContainer>

                <MediaPageHeaderEntryDetails
                    coverImage={entry.media?.coverImage?.extraLarge || entry.media?.coverImage?.large}
                    title={entry.media?.title?.userPreferred}
                    englishTitle={entry.media?.title?.english}
                    romajiTitle={entry.media?.title?.romaji}
                    startDate={entry.media?.startDate}
                    season={entry.media?.season}
                    color={entry.media?.coverImage?.color}
                    progressTotal={entry.media?.chapters}
                    status={entry.media?.status}
                    description={entry.media?.description}
                    listData={entry.listData}
                    media={entry.media}
                    type="manga"
                >
                    {ts.mediaPageBannerInfoBoxSize === ThemeMediaPageInfoBoxSize.Fluid && <Details />}
                </MediaPageHeaderEntryDetails>

                <PluginWebviewSlot slot="after-media-entry-details" />

                {ts.mediaPageBannerInfoBoxSize !== ThemeMediaPageInfoBoxSize.Fluid && <Details />}


                <div 
                    className="w-full flex flex-wrap gap-4 items-center p-4 rounded-2xl bg-black/20 backdrop-blur-md border border-white/5 shadow-xl transition-all duration-300 hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]" 
                    data-manga-meta-section-buttons-container
                >

                    {isCustomSource(entry.mediaId) && (
                        <Tooltip
                            trigger={<div>
                                <SeaLink href={`/custom-sources?provider=${getCustomSourceExtensionId(entry.media)}`}>
                                    <IconButton size="sm" intent="gray-outline" className="rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20" icon={<BiExtension className="text-lg" />} />
                                </SeaLink>
                            </div>}
                        >
                            Custom source
                        </Tooltip>
                    )}

                    {!isCustomSource(entry.mediaId) && <SeaLink href={`https://anilist.co/manga/${entry.mediaId}`} target="_blank">
                        <IconButton size="sm" intent="gray-outline" className="rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20" icon={<SiAnilist className="text-lg" />} />
                    </SeaLink>}

                    {isCustomSource(entry.mediaId) && !!getCustomSourceMediaSiteUrl(entry.media) && <Tooltip
                        trigger={<div>
                            <SeaLink href={getCustomSourceMediaSiteUrl(entry.media)!} target="_blank">
                                <IconButton size="sm" intent="gray-outline" className="rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20" icon={<LuExternalLink className="text-lg" />} />
                            </SeaLink>
                        </div>}
                    >
                        Open in website
                    </Tooltip>}

                    {ts.mediaPageBannerInfoBoxSize !== ThemeMediaPageInfoBoxSize.Fluid && <div className="flex-1 hidden lg:flex"></div>}

                    <div className="relative group">
                         <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                         <MediaSyncTrackButton mediaId={entry.mediaId} type="manga" size="md" className="relative" />
                    </div>

                    <PluginMangaPageButtons media={entry.media} />
                </div>

            </MediaPageHeaderDetailsContainer>
        </MediaPageHeader>

    )

}
