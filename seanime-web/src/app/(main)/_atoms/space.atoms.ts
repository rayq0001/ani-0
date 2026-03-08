import { atom } from 'jotai';

// Space Mode State
export const spaceModeAtom = atom(false);

// DNA Filters State
export interface StoryDNA {
  heroArchetype: number;    // 0-100: Underdog to Chosen One
  worldSetting: number;     // 0-100: Real World to Otherworld
  powerSystem: number;      // 0-100: None to Technology
  conflictType: number;     // 0-100: Internal to Cosmic
  romanceLevel: number;     // 0-100: None to Central
  comedyLevel: number;      // 0-100: Serious to Comedy
  darknessLevel: number;    // 0-100: Light to Grimdark
  mysteryLevel: number;     // 0-100: Straightforward to Complex
  selectedGenes: string[];  // Story genes like "system", "leveling", etc.
}

// Alias for backward compatibility
export type DNAFilters = StoryDNA;

export const dnaFiltersAtom = atom<DNAFilters>({
  heroArchetype: 50,
  worldSetting: 50,
  powerSystem: 50,
  conflictType: 50,
  romanceLevel: 30,
  comedyLevel: 40,
  darknessLevel: 50,
  mysteryLevel: 50,
  selectedGenes: [],
});

// Emotional State
export interface EmotionState {
  type: 'excitement' | 'sadness' | 'anger' | 'fear' | 'joy' | 'surprise' | 'mystery';
  intensity: number; // 0.0 to 1.0
}

export const emotionalStateAtom = atom<EmotionState[]>([
  { type: 'excitement', intensity: 0.7 },
  { type: 'mystery', intensity: 0.5 },
]);

// Search Results
export interface StarNode {
  id: string;
  mediaId: number;
  title: string;
  type: string; // 'manga' | 'manhwa' | 'manhua' | 'anime' | 'novel'
  coverImage: string;
  coordinates: { x: number; y: number; z: number };
  similarityScore: number;
  year: number;
  genres: string[];
  dna: DNAFilters;
}

export const searchResultsAtom = atom<StarNode[]>([]);
export const selectedStarAtom = atom<StarNode | null>(null);
export const isSearchingAtom = atom(false);

// Galaxy Clusters
export interface GalaxyCluster {
  id: string;
  name: string; // Arabic name
  nameEn: string; // English name
  description: string;
  stars: StarNode[];
  centerCoordinates: { x: number; y: number; z: number };
  color: string;
}

export const galaxyClustersAtom = atom<GalaxyCluster[]>([
  {
    id: 'summoning',
    name: 'مجرة الاستدعاء',
    nameEn: 'Summoning Galaxy',
    description: 'أعمال تدور حول استدعاء الشياطين والمخلوقات',
    stars: [],
    centerCoordinates: { x: -50, y: 20, z: 10 },
    color: '#8B5CF6',
  },
  {
    id: 'shadow-heroes',
    name: 'مجرة أبطال الظل',
    nameEn: 'Shadow Heroes Galaxy',
    description: 'أبطال يعملون من الظلال',
    stars: [],
    centerCoordinates: { x: 30, y: -40, z: 20 },
    color: '#1F2937',
  },
  {
    id: 'time-regression',
    name: 'مجرة العودة بالزمن',
    nameEn: 'Time Regression Galaxy',
    description: 'العودة إلى الماضي لتغيير المستقبل',
    stars: [],
    centerCoordinates: { x: 60, y: 30, z: -10 },
    color: '#3B82F6',
  },
  {
    id: 'survival',
    name: 'مجرة النجاة',
    nameEn: 'Survival Galaxy',
    description: 'الصراع من أجل البقاء على قيد الحياة',
    stars: [],
    centerCoordinates: { x: -20, y: -30, z: 30 },
    color: '#EF4444',
  },
  {
    id: 'supernatural-romance',
    name: 'مجرة الرومانسية الخارقة',
    nameEn: 'Supernatural Romance Galaxy',
    description: 'حب يتجاوز الحدود البشرية',
    stars: [],
    centerCoordinates: { x: 40, y: 50, z: 15 },
    color: '#EC4899',
  },
]);

// Timeline State
export const timelineYearRangeAtom = atom<{ from: number; to: number }>({
  from: 2010,
  to: 2024,
});

export const timelineSelectedWorkAtom = atom<StarNode | null>(null);
