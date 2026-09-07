import type { Coords } from "./types";
import { distanceMeters } from "./geo";

export type PlaceLookup = {
  name: string;
  subtitle: string;
  coords: Coords;
};

function parseReverse(
  data: {
    name?: string;
    display_name?: string;
    address?: Record<string, string>;
    lat?: string;
    lon?: string;
  },
  fallback: Coords,
): PlaceLookup {
  const a = data.address ?? {};
  const name =
    data.name ||
    a.amenity ||
    a.tourism ||
    a.leisure ||
    a.road ||
    a.neighbourhood ||
    a.suburb ||
    "Pinned place";
  const houseRoad = [a.house_number, a.road].filter(Boolean).join(" ");
  const subtitle = [
    houseRoad || a.road,
    a.city || a.town || a.village || a.county,
  ]
    .filter(Boolean)
    .join(", ");
  return {
    name,
    subtitle:
      subtitle ||
      data.display_name?.split(",").slice(1, 3).join(",").trim() ||
      "",
    coords: {
      lat: data.lat ? Number(data.lat) : fallback.lat,
      lng: data.lon ? Number(data.lon) : fallback.lng,
    },
  };
}

export async function reverseGeocode(coords: Coords): Promise<PlaceLookup> {
  try {
    const url = `/api/geocode/reverse?lat=${coords.lat}&lng=${coords.lng}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("geocode failed");
    const data = await res.json();
    return parseReverse(data, coords);
  } catch {
    return {
      name: "Pinned place",
      subtitle: `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`,
      coords,
    };
  }
}

/** "MicMac" → "Mic Mac" so OSM park names match better. */
export function expandPlaceQuery(query: string): string[] {
  const q = query.trim();
  if (q.length < 2) return [];
  const variants = new Set<string>([q]);
  const spaced = q.replace(/([a-z])([A-Z])/g, "$1 $2");
  if (spaced !== q) variants.add(spaced);
  // OSM lists Windsor’s park as "Mic Mac Park" (with a space).
  if (/micmac/i.test(q) && !/mic\s+mac/i.test(q)) {
    variants.add(q.replace(/micmac/gi, "Mic Mac"));
  }
  return [...variants];
}

type NominatimHit = {
  lat: string;
  lon: string;
  name?: string;
  display_name: string;
  address?: Record<string, string>;
};

function mapHit(item: NominatimHit): PlaceLookup {
  const a = item.address ?? {};
  const parts = item.display_name.split(",");
  const houseRoad = [a.house_number, a.road].filter(Boolean).join(" ");
  const subtitle =
    [houseRoad || a.suburb || a.neighbourhood, a.city || a.town || a.village || parts[1]]
      .filter(Boolean)
      .join(", ")
      .replace(/\s+,/g, ",") || parts.slice(1, 3).join(",").trim();

  return {
    name: item.name || houseRoad || parts[0] || "Place",
    subtitle,
    coords: { lat: Number(item.lat), lng: Number(item.lon) },
  };
}

async function fetchSearch(
  q: string,
  near?: Coords | null,
  opts?: { unbounded?: boolean },
): Promise<PlaceLookup[]> {
  const url = new URL("/api/geocode/search", window.location.origin);
  url.searchParams.set("q", q);
  if (near && !opts?.unbounded) {
    url.searchParams.set("lat", String(near.lat));
    url.searchParams.set("lng", String(near.lng));
  }
  const res = await fetch(url.toString());
  if (!res.ok) return [];
  const data = (await res.json()) as NominatimHit[];
  return data.map(mapHit);
}

export async function searchPlaces(
  query: string,
  near?: Coords | null,
): Promise<PlaceLookup[]> {
  const variants = expandPlaceQuery(query);
  if (variants.length === 0) return [];
  try {
    let batches = await Promise.all(variants.map((v) => fetchSearch(v, near)));
    // If the local box was too tight (or GPS was off), retry Canada-wide.
    if (near && batches.every((b) => b.length === 0)) {
      batches = await Promise.all(
        variants.map((v) => fetchSearch(v, near, { unbounded: true })),
      );
    }
    const seen = new Set<string>();
    const merged: PlaceLookup[] = [];
    for (const batch of batches) {
      for (const place of batch) {
        const key = `${place.coords.lat.toFixed(5)},${place.coords.lng.toFixed(5)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        merged.push(place);
      }
    }
    if (near) {
      merged.sort(
        (a, b) =>
          distanceMeters(near, a.coords) - distanceMeters(near, b.coords),
      );
    }
    return merged.slice(0, 8);
  } catch {
    return [];
  }
}
