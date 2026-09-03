"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { distanceMeters, getCurrentPosition, offsetCoords } from "@/lib/geo";
import {
  hasSeenWelcome,
  loadMoments,
  markWelcomeSeen,
  saveMoments,
  uid,
} from "@/lib/storage";
import {
  emptyDraft,
  UNLOCK_RADIUS_METERS,
  type AppView,
  type Coords,
  type DraftMoment,
  type MomentRecord,
} from "@/lib/types";
import { oneYearFromNowIso } from "@/lib/time";

type MomentContextValue = {
  ready: boolean;
  view: AppView;
  setView: (v: AppView) => void;
  moments: MomentRecord[];
  draft: DraftMoment;
  setDraft: (patch: Partial<DraftMoment>) => void;
  resetDraft: () => void;
  activeMomentId: string | null;
  setActiveMomentId: (id: string | null) => void;
  activeMoment: MomentRecord | null;
  userCoords: Coords | null;
  locationError: string | null;
  refreshLocation: () => Promise<Coords | null>;
  startDrop: () => void;
  dropMoment: () => MomentRecord | null;
  openMoment: (id: string) => void;
  markUnlocked: (id: string) => void;
  saveMomentKeep: (id: string) => void;
  deleteMoment: (id: string) => void;
  dismissWelcome: () => void;
  seedDemo: () => Promise<void>;
  /** Demo: pretend you arrived at the active moment */
  simulateArrival: () => void;
  /** After unlocking an Annual Moment — start next year's chapter at the same place */
  continueTradition: (from: MomentRecord) => void;
  distanceToActive: number | null;
  canUnlockActive: boolean;
};

const MomentContext = createContext<MomentContextValue | null>(null);

export function MomentProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<AppView>("welcome");
  const [moments, setMoments] = useState<MomentRecord[]>([]);
  const [draft, setDraftState] = useState<DraftMoment>(emptyDraft());
  const [activeMomentId, setActiveMomentId] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<Coords | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadMoments();
    setMoments(stored);
    setView(hasSeenWelcome() ? "home" : "welcome");
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveMoments(moments);
  }, [moments, ready]);

  const setDraft = useCallback((patch: Partial<DraftMoment>) => {
    setDraftState((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetDraft = useCallback(() => setDraftState(emptyDraft()), []);

  const refreshLocation = useCallback(async () => {
    try {
      const coords = await getCurrentPosition();
      setUserCoords(coords);
      setLocationError(null);
      return coords;
    } catch (e) {
      const msg =
        e instanceof GeolocationPositionError
          ? e.code === 1
            ? "Location permission denied"
            : "Could not get your location"
          : "Could not get your location";
      setLocationError(msg);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!ready || view === "welcome") return;
    void refreshLocation();
    const id = window.setInterval(() => {
      void refreshLocation();
    }, 8000);
    return () => window.clearInterval(id);
  }, [ready, view, refreshLocation]);

  const activeMoment = useMemo(
    () => moments.find((m) => m.id === activeMomentId) ?? null,
    [moments, activeMomentId],
  );

  const distanceToActive = useMemo(() => {
    if (!activeMoment || !userCoords) return null;
    return distanceMeters(userCoords, activeMoment.coords);
  }, [activeMoment, userCoords]);

  const canUnlockActive = useMemo(() => {
    if (!activeMoment) return false;
    const now = Date.now();
    if (activeMoment.timeLocked && activeMoment.unlockAt) {
      if (now < new Date(activeMoment.unlockAt).getTime()) return false;
    }
    if (!activeMoment.locationLocked) return true;
    if (distanceToActive == null) return false;
    return distanceToActive <= UNLOCK_RADIUS_METERS;
  }, [activeMoment, distanceToActive]);

  const dismissWelcome = useCallback(() => {
    markWelcomeSeen();
    setView("home");
  }, []);

  const startDrop = useCallback(() => {
    setDraftState(emptyDraft());
    setView("drop-place");
    void refreshLocation().then((coords) => {
      if (coords) {
        setDraftState((d) => ({
          ...d,
          coords: d.coords ?? coords,
          placeName: d.placeName || "Current location",
          placeSubtitle: d.placeSubtitle || "Where you are right now",
        }));
      }
    });
  }, [refreshLocation]);

  const dropMoment = useCallback(() => {
    if (!draft.coords) return null;
    const record: MomentRecord = {
      id: uid(),
      title: draft.title.trim() || "Untitled Moment",
      placeName: draft.placeName.trim() || "Dropped place",
      placeSubtitle: draft.placeSubtitle?.trim() || undefined,
      coords: draft.coords,
      note: draft.note.trim(),
      media: draft.media,
      locationLocked: draft.locationLocked,
      timeLocked: draft.timeLocked,
      unlockAt: draft.timeLocked ? draft.unlockAt : undefined,
      annualTradition: draft.annualTradition || undefined,
      createdAt: new Date().toISOString(),
      saved: false,
    };
    setMoments((prev) => [record, ...prev]);
    resetDraft();
    setActiveMomentId(record.id);
    setView("locked");
    return record;
  }, [draft, resetDraft]);

  const openMoment = useCallback(
    (id: string) => {
      setActiveMomentId(id);
      const m = moments.find((x) => x.id === id);
      if (!m) return;
      if (m.unlockedAt) {
        setView("unlocked");
        return;
      }
      // Evaluate unlock with latest coords
      void refreshLocation().then((coords) => {
        const now = Date.now();
        let unlocked = !m.locationLocked;
        if (m.timeLocked && m.unlockAt && now < new Date(m.unlockAt).getTime()) {
          unlocked = false;
        } else if (m.locationLocked && coords) {
          unlocked = distanceMeters(coords, m.coords) <= UNLOCK_RADIUS_METERS;
        } else if (m.locationLocked) {
          unlocked = false;
        }
        setView(unlocked ? "unlocked" : "locked");
        if (unlocked && !m.unlockedAt) {
          setMoments((prev) =>
            prev.map((x) =>
              x.id === id
                ? { ...x, unlockedAt: new Date().toISOString() }
                : x,
            ),
          );
        }
      });
    },
    [moments, refreshLocation],
  );

  const markUnlocked = useCallback((id: string) => {
    setMoments((prev) =>
      prev.map((m) =>
        m.id === id && !m.unlockedAt
          ? { ...m, unlockedAt: new Date().toISOString() }
          : m,
      ),
    );
    setView("unlocked");
  }, []);

  const saveMomentKeep = useCallback((id: string) => {
    setMoments((prev) =>
      prev.map((m) => (m.id === id ? { ...m, saved: true } : m)),
    );
  }, []);

  const deleteMoment = useCallback((id: string) => {
    setMoments((prev) => prev.filter((m) => m.id !== id));
    setActiveMomentId(null);
    setView("home");
  }, []);

  const seedDemo = useCallback(async () => {
    const here =
      userCoords ??
      (await refreshLocation()) ?? { lat: 42.3149, lng: -83.0364 };
    const near = offsetCoords(here, 1800, 400);
    const far = offsetCoords(here, -3200, 900);
    const demo: MomentRecord[] = [
      {
        id: uid(),
        title: "Sunset promise",
        placeName: "Riverside Viewpoint",
        placeSubtitle: "123 River Rd",
        coords: near,
        note: "To: Future Me.\n\nIf you're reading this, you made it. Enjoy the view. Don't forget who you're doing this for.\n\nProud of you always. ❤️",
        media: [
          {
            kind: "note",
            payload:
              "To: Future Me.\n\nIf you're reading this, you made it. Enjoy the view.",
          },
        ],
        locationLocked: true,
        timeLocked: false,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        saved: false,
      },
      {
        id: uid(),
        title: "Letters to future me",
        placeName: "Harbor Pier",
        placeSubtitle: "East boardwalk",
        coords: far,
        note: "Come back when the season turns. Leave the rush behind for a minute.",
        media: [{ kind: "note", payload: "Come back when the season turns." }],
        locationLocked: true,
        timeLocked: false,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        saved: false,
      },
      {
        id: uid(),
        title: "Grateful here",
        placeName: "City Hall Steps",
        coords: offsetCoords(here, 50, -30),
        note: "You stood here nervous and hopeful. Remember that feeling.",
        media: [
          {
            kind: "note",
            payload: "You stood here nervous and hopeful. Remember that feeling.",
          },
        ],
        locationLocked: true,
        timeLocked: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        unlockedAt: new Date().toISOString(),
        saved: true,
      },
    ];
    setMoments(demo);
    markWelcomeSeen();
    setView("home");
  }, [refreshLocation, userCoords]);

  const simulateArrival = useCallback(() => {
    if (!activeMoment) return;
    setUserCoords({ ...activeMoment.coords });
    markUnlocked(activeMoment.id);
  }, [activeMoment, markUnlocked]);

  const continueTradition = useCallback((from: MomentRecord) => {
    setDraftState({
      ...emptyDraft(),
      title: "",
      placeName: from.placeName,
      placeSubtitle: from.placeSubtitle,
      coords: from.coords,
      locationLocked: true,
      timeLocked: true,
      annualTradition: true,
      unlockAt: oneYearFromNowIso(),
      note: "",
      media: [],
    });
    setView("drop-record");
  }, []);

  // Auto-unlock when walking into radius
  useEffect(() => {
    if (view !== "locked" || !activeMoment || !canUnlockActive) return;
    markUnlocked(activeMoment.id);
  }, [view, activeMoment, canUnlockActive, markUnlocked]);

  const value: MomentContextValue = {
    ready,
    view,
    setView,
    moments,
    draft,
    setDraft,
    resetDraft,
    activeMomentId,
    setActiveMomentId,
    activeMoment,
    userCoords,
    locationError,
    refreshLocation,
    startDrop,
    dropMoment,
    openMoment,
    markUnlocked,
    saveMomentKeep,
    deleteMoment,
    dismissWelcome,
    seedDemo,
    simulateArrival,
    continueTradition,
    distanceToActive,
    canUnlockActive,
  };

  return (
    <MomentContext.Provider value={value}>{children}</MomentContext.Provider>
  );
}

export function useMoment() {
  const ctx = useContext(MomentContext);
  if (!ctx) throw new Error("useMoment must be used within MomentProvider");
  return ctx;
}
