export type MediaKind = "photo" | "video" | "note" | "voice";

export type Coords = {
  lat: number;
  lng: number;
};

export type MomentMedia = {
  kind: MediaKind;
  /** data URL for photo/video/voice; plain text for note */
  payload: string;
  durationSeconds?: number;
  mimeType?: string;
};

export type MomentRecord = {
  id: string;
  title: string;
  placeName: string;
  placeSubtitle?: string;
  coords: Coords;
  note: string;
  media: MomentMedia[];
  locationLocked: boolean;
  timeLocked: boolean;
  unlockAt?: string; // ISO
  /** Yearly family/return tradition — unlock next year at this place */
  annualTradition?: boolean;
  createdAt: string;
  unlockedAt?: string;
  saved: boolean;
};

export type DraftMoment = {
  title: string;
  placeName: string;
  placeSubtitle?: string;
  coords: Coords | null;
  note: string;
  media: MomentMedia[];
  locationLocked: boolean;
  timeLocked: boolean;
  unlockAt?: string;
  annualTradition?: boolean;
};

export type AppView =
  | "welcome"
  | "home"
  | "map"
  | "profile"
  | "drop-place"
  | "drop-record"
  | "drop-leave"
  | "locked"
  | "unlocked";

export const UNLOCK_RADIUS_METERS = 80;

export const emptyDraft = (): DraftMoment => ({
  title: "",
  placeName: "",
  placeSubtitle: "",
  coords: null,
  note: "",
  media: [],
  locationLocked: true,
  timeLocked: false,
  unlockAt: undefined,
  annualTradition: false,
});
