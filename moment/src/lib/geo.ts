import type { Coords } from "./types";

export type CoordsWithAccuracy = Coords & { accuracy?: number };

/** Haversine distance in meters */
export function distanceMeters(a: Coords, b: Coords): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function formatDistance(meters: number): string {
  if (!Number.isFinite(meters)) return "—";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function bearingDegrees(from: Coords, to: Coords): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const φ1 = toRad(from.lat);
  const φ2 = toRad(to.lat);
  const Δλ = toRad(to.lng - from.lng);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** Offset a point by meters north/east — useful for demo “nearby” pins */
export function offsetCoords(
  origin: Coords,
  northMeters: number,
  eastMeters: number,
): Coords {
  const dLat = northMeters / 111320;
  const dLng = eastMeters / (111320 * Math.cos((origin.lat * Math.PI) / 180));
  return { lat: origin.lat + dLat, lng: origin.lng + dLng };
}

function fromPosition(pos: GeolocationPosition): CoordsWithAccuracy {
  return {
    lat: pos.coords.latitude,
    lng: pos.coords.longitude,
    accuracy: pos.coords.accuracy,
  };
}

export async function getCurrentPosition(
  options?: PositionOptions,
): Promise<CoordsWithAccuracy> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not available"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(fromPosition(pos)),
      (err) => reject(err),
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 2000,
        ...options,
      },
    );
  });
}

/**
 * Continuous GPS updates. Prefer this over polling getCurrentPosition while
 * waiting to unlock — phones update faster while walking/driving.
 */
export function watchPosition(
  onUpdate: (coords: CoordsWithAccuracy) => void,
  onError?: (err: GeolocationPositionError | Error) => void,
  options?: PositionOptions,
): () => void {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    onError?.(new Error("Geolocation is not available"));
    return () => undefined;
  }

  const id = navigator.geolocation.watchPosition(
    (pos) => onUpdate(fromPosition(pos)),
    (err) => onError?.(err),
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 2000,
      ...options,
    },
  );

  return () => navigator.geolocation.clearWatch(id);
}

/**
 * Unlock if within radius, expanding slightly when GPS reports coarse accuracy
 * so a 100m-accurate fix near the pin still works.
 */
export function withinUnlockRadius(
  distance: number,
  radiusMeters: number,
  accuracyMeters?: number,
): boolean {
  const slack =
    accuracyMeters != null && Number.isFinite(accuracyMeters)
      ? Math.min(Math.max(accuracyMeters * 0.5, 0), 50)
      : 0;
  return distance <= radiusMeters + slack;
}
