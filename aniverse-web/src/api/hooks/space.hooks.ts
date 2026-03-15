import { useServerMutation, useServerQuery } from "@/api/client/requests"
import type { StarNode, StoryDNA, EmotionState } from '@/app/(main)/_atoms/space.atoms';

// Types
export interface CosmicSearchRequest {
  query: string;
  dnaFilters: StoryDNA;
  emotionalState: EmotionState[];
  yearRange: { from: number; to: number };
  includeDimensions: string[];
  excludeGenres: string[];
  minSimilarity: number;
  maxResults: number;
}

export interface CosmicSearchResponse {
  results: StarNode[];
  total: number;
  queryTime: number;
}

export interface GalaxyCluster {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  stars: StarNode[];
  centerCoordinates: { x: number; y: number; z: number };
  color: string;
}

export interface TimelineEntry {
  year: number;
  works: {
    id: string;
    title: string;
    type: string;
    chapter: number;
    relation: string;
    color: string;
  }[];
}

// Hooks
export function useCosmicSearch() {
  return useServerMutation<CosmicSearchResponse, CosmicSearchRequest>({
    endpoint: "/api/v1/anyverse/cosmic-search",
    method: "POST",
    mutationKey: ["cosmic-search"],
  })
}

export function useGalaxyClusters() {
  return useServerQuery<GalaxyCluster[]>({
    endpoint: "/api/v1/anyverse/galaxy-clusters",
    method: "GET",
    queryKey: ["galaxy-clusters"],
    enabled: true,
  })
}

export function useSimilarGalaxies(mediaId: number | null) {
  return useServerQuery<StarNode[]>({
    endpoint: mediaId ? `/api/v1/anyverse/similar-galaxies/${mediaId}` : "",
    method: "GET",
    queryKey: ["similar-galaxies", mediaId],
    enabled: !!mediaId,
  })
}

export function useTimeline(mediaId: number | null) {
  return useServerQuery<TimelineEntry[]>({
    endpoint: mediaId ? `/api/v1/anyverse/timeline/${mediaId}` : "",
    method: "GET",
    queryKey: ["timeline", mediaId],
    enabled: !!mediaId,
  })
}

export interface VisualSearchResult {
  results: StarNode[];
}

export function useVisualSearch() {
  return useServerMutation<VisualSearchResult, FormData>({
    endpoint: "/api/v1/anyverse/visual-search",
    method: "POST",
    mutationKey: ["visual-search"],
  })
}

export function useEmotionalSignatureSearch() {
  return useServerMutation<CosmicSearchResponse, { emotions: EmotionState[] }>({
    endpoint: "/api/v1/anyverse/emotional-search",
    method: "POST",
    mutationKey: ["emotional-search"],
  })
}
