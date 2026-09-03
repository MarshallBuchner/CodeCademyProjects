"use client";

import { useEffect, useMemo } from "react";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import type { Coords } from "@/lib/types";
import "leaflet/dist/leaflet.css";

const amberIcon = L.divIcon({
  className: "moment-pin",
  html: `<div style="
    width:18px;height:18px;border-radius:999px;
    background:radial-gradient(circle at 30% 30%,#ffb067,#ff6a00);
    box-shadow:0 0 0 6px rgba(255,138,42,0.25),0 0 24px rgba(255,106,0,0.55);
    border:2px solid #1a1008;
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const lockIcon = L.divIcon({
  className: "moment-lock",
  html: `<div style="
    width:36px;height:36px;border-radius:999px;display:grid;place-items:center;
    background:#12131a;border:2px solid #ff8a2a;
    box-shadow:0 0 24px rgba(255,138,42,0.45);color:#ffb067;font-size:14px;
  ">🔒</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function Recenter({ center, zoom }: { center: Coords; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom ?? map.getZoom(), { animate: true });
  }, [center.lat, center.lng, map, zoom]);
  return null;
}

function MoveReporter({
  onMoved,
}: {
  onMoved: (coords: Coords) => void;
}) {
  useMapEvents({
    moveend(e) {
      const c = e.target.getCenter();
      onMoved({ lat: c.lat, lng: c.lng });
    },
  });
  return null;
}

const darkTiles =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

type PickMapProps = {
  center: Coords;
  className?: string;
  onCenterChange: (coords: Coords) => void;
};

/** Pan the map under a fixed center pin to choose a place */
export function PlacePickerMap({ center, className = "", onCenterChange }: PickMapProps) {
  return (
    <div className={`relative overflow-hidden rounded-[28px] border border-white/8 ${className}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={15}
        className="h-full w-full bg-[#0a0b10]"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url={darkTiles} attribution={attribution} />
        <Recenter center={center} />
        <MoveReporter onMoved={onCenterChange} />
      </MapContainer>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="relative -translate-y-3">
          <div className="h-4 w-4 rounded-full bg-accent shadow-[0_0_0_8px_rgba(255,138,42,0.22),0_0_28px_rgba(255,106,0,0.55)]" />
          <div className="mx-auto mt-0.5 h-3 w-0.5 bg-accent/80" />
        </div>
      </div>
    </div>
  );
}

type JourneyMapProps = {
  user?: Coords | null;
  target: Coords;
  className?: string;
  unlocked?: boolean;
};

export function JourneyMap({
  user,
  target,
  className = "",
  unlocked = false,
}: JourneyMapProps) {
  const center = user ?? target;
  const line = useMemo(() => {
    if (!user) return null;
    return [
      [user.lat, user.lng] as [number, number],
      [target.lat, target.lng] as [number, number],
    ];
  }, [user, target]);

  return (
    <div className={`overflow-hidden rounded-[28px] border border-white/8 ${className}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={14}
        className="h-full w-full bg-[#0a0b10]"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url={darkTiles} attribution={attribution} />
        <Recenter center={center} zoom={user ? 14 : 15} />
        <Circle
          center={[target.lat, target.lng]}
          radius={80}
          pathOptions={{
            color: "#ff8a2a",
            fillColor: "#ff8a2a",
            fillOpacity: 0.12,
            weight: 1,
          }}
        />
        {line && (
          <Polyline
            positions={line}
            pathOptions={{
              color: "#ff8a2a",
              dashArray: "6 10",
              weight: 3,
              opacity: 0.85,
            }}
          />
        )}
        {user && (
          <CircleMarker
            center={[user.lat, user.lng]}
            radius={7}
            pathOptions={{
              color: "#ffb067",
              fillColor: "#ff8a2a",
              fillOpacity: 1,
              weight: 2,
            }}
          />
        )}
        <Marker
          position={[target.lat, target.lng]}
          icon={unlocked ? amberIcon : lockIcon}
        />
      </MapContainer>
    </div>
  );
}

type MomentsMapProps = {
  user?: Coords | null;
  points: Array<{ id: string; coords: Coords; unlocked?: boolean }>;
  className?: string;
  onSelect?: (id: string) => void;
};

export function MomentsOverviewMap({
  user,
  points,
  className = "",
  onSelect,
}: MomentsMapProps) {
  const center = user ?? points[0]?.coords ?? { lat: 42.3149, lng: -83.0364 };

  return (
    <div className={`overflow-hidden rounded-[28px] border border-white/8 ${className}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={12}
        className="h-full w-full bg-[#0a0b10]"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url={darkTiles} attribution={attribution} />
        <Recenter center={center} zoom={12} />
        {user && (
          <CircleMarker
            center={[user.lat, user.lng]}
            radius={6}
            pathOptions={{ color: "#fff", fillColor: "#ff8a2a", fillOpacity: 1, weight: 2 }}
          />
        )}
        {points.map((p) => (
          <Marker
            key={p.id}
            position={[p.coords.lat, p.coords.lng]}
            icon={p.unlocked ? amberIcon : lockIcon}
            eventHandlers={{
              click: () => onSelect?.(p.id),
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
