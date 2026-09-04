import type { Coords } from "./types";

export type PlaceLookup = {
  name: string;
  subtitle: string;
  coords: Coords;
};

function parseReverse(data: {
  name?: string;
  display_name?: string;
  address?: Record<string, string>;
  lat?: string;
  lon?: string;
}, fallback: Coords): PlaceLookup {
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
  const subtitle = [a.road, a.city || a.town || a.village || a.county]
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

export async function searchPlaces(
  query: string,
  near?: Coords | null,
): Promise<PlaceLookup[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  try {
    const url = new URL("/api/geocode/search", window.location.origin);
    url.searchParams.set("q", q);
    if (near) {
      url.searchParams.set("lat", String(near.lat));
      url.searchParams.set("lng", String(near.lng));
    }
    const res = await fetch(url.toString());
    if (!res.ok) return [];
    const data = (await res.json()) as Array<{
      lat: string;
      lon: string;
      name?: string;
      display_name: string;
    }>;
    return data.map((item) => {
      const parts = item.display_name.split(",");
      return {
        name: item.name || parts[0] || "Place",
        subtitle: parts.slice(1, 3).join(",").trim(),
        coords: { lat: Number(item.lat), lng: Number(item.lon) },
      };
    });
  } catch {
    return [];
  }
}
