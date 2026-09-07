import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  if (!q || q.trim().length < 2) {
    return NextResponse.json([]);
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("q", q.trim());
  url.searchParams.set("limit", "8");
  url.searchParams.set("addressdetails", "1");
  // Soft CA bias — MOMENT ships for Windsor / Canada first.
  url.searchParams.set("countrycodes", "ca");

  const nearLat = searchParams.get("lat");
  const nearLng = searchParams.get("lng");
  if (nearLat && nearLng) {
    const lat = Number(nearLat);
    const lng = Number(nearLng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      // ~25km box — keep results local when GPS/map center is known.
      url.searchParams.set(
        "viewbox",
        `${lng - 0.3},${lat + 0.22},${lng + 0.3},${lat - 0.22}`,
      );
      url.searchParams.set("bounded", "1");
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent": "MOMENT-App/0.1 (cloud-agent preview)",
    },
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    return NextResponse.json([], { status: 502 });
  }

  return NextResponse.json(await res.json());
}
