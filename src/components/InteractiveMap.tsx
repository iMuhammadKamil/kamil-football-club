"use client";

import React, { useEffect, useRef, useState } from "react";
import { GroundVenue } from "@/types";
import { Compass, CaretRight } from "@phosphor-icons/react";
import { formatPKR } from "@/lib/utils";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

interface InteractiveMapProps {
  venues: GroundVenue[];
  onSelectVenue: (venue: GroundVenue) => void;
}

const CITY_COORDINATES: { [key: string]: { coords: [number, number]; zoom: number } } = {
  Karachi: { coords: [24.8607, 67.0011], zoom: 12 },
  Lahore: { coords: [31.5204, 74.3587], zoom: 12 },
  Islamabad: { coords: [33.6844, 73.0479], zoom: 12 },
  Rawalpindi: { coords: [33.5651, 73.0169], zoom: 12 },
};

// Available clean tile providers (NO watermark, NO forced API key)
const TILE_LAYERS = {
  darkCanvas: {
    name: "Dark Canvas (Clean)",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; World Dark Gray Base',
    maxZoom: 16,
  },
  osm: {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  satellite: {
    name: "Satellite Imagery",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; High-Res Satellite',
    maxZoom: 18,
  },
};

export default function InteractiveMap({ venues, onSelectVenue }: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const [activeVenue, setActiveVenue] = useState<GroundVenue | null>(null);
  const [activeCityFilter, setActiveCityFilter] = useState<string>("ALL");
  const [selectedMapTheme, setSelectedMapTheme] = useState<"darkCanvas" | "osm" | "satellite">("osm");

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    let isMounted = true;

    if ((container as any)._leaflet_id) {
      (container as any)._leaflet_id = null;
    }

    import("leaflet").then((L) => {
      if (!isMounted || !container) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(container).setView([30.3753, 69.3451], 5);
      mapInstanceRef.current = map;

      // Check if user provided an optional custom Carto API key in .env
      const customCartoKey = process.env.NEXT_PUBLIC_CARTO_API_KEY;
      let activeTileConfig = TILE_LAYERS[selectedMapTheme];

      let tileUrl = activeTileConfig.url;
      let tileAttr = activeTileConfig.attribution;

      if (customCartoKey && selectedMapTheme === "darkCanvas") {
        tileUrl = `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?api_key=${customCartoKey}`;
        tileAttr = '&copy; <a href="https://carto.com/">CARTO</a>';
      }

      // Add clean, un-watermarked tile layer
      const tiles = L.tileLayer(tileUrl, {
        attribution: tileAttr,
        maxZoom: activeTileConfig.maxZoom,
      }).addTo(map);
      tileLayerRef.current = tiles;

      // Custom Neon Stadium Marker
      const createNeonIcon = (is11Side: boolean) =>
        L.divIcon({
          className: "custom-neon-marker",
          html: `
            <div style="
              background: ${is11Side ? "#00E575" : "#00C2A1"};
              width: 32px;
              height: 32px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 18px ${is11Side ? "rgba(0, 229, 117, 0.85)" : "rgba(0, 194, 161, 0.85)"};
              border: 2px solid #090D10;
              cursor: pointer;
            ">
              <div style="
                width: 10px;
                height: 10px;
                background: #090D10;
                border-radius: 50%;
                transform: rotate(45deg);
              "></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

      // Add pins for each venue
      venues.forEach((v) => {
        const has11aSide = v.pitches.some((p) => p.sportType === "FOOTBALL_11A_SIDE");
        const marker = L.marker([v.lat, v.lng], {
          icon: createNeonIcon(has11aSide),
        }).addTo(map);

        marker.on("click", () => {
          setActiveVenue(v);
          map.setView([v.lat, v.lng], 13, { animate: true });
        });
      });
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (container) {
        (container as any)._leaflet_id = null;
      }
    };
  }, [venues, selectedMapTheme]);

  const handleCityJump = (cityName: string) => {
    setActiveCityFilter(cityName);
    if (!mapInstanceRef.current) return;

    if (cityName === "ALL") {
      mapInstanceRef.current.setView([30.3753, 69.3451], 5, { animate: true });
    } else {
      const cityData = CITY_COORDINATES[cityName];
      if (cityData) {
        mapInstanceRef.current.setView(cityData.coords, cityData.zoom, { animate: true });
      }
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#E6E7E5] shadow-[0_2px_10px_rgba(14,42,32,0.06)] h-[440px] w-full bg-[#F4F5F3]">
      <div ref={mapContainerRef} className="h-full w-full z-10" />

      {/* Map Header Overlay & City Quick Jumps */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#E6E7E5] text-xs text-[#0E2A20] font-semibold flex items-center gap-2 shadow-sm">
            <Compass className="w-4 h-4 text-[#176B3A]" weight="duotone" />
            <span>Pakistan Sports Radar</span>
          </div>

          {/* Theme switcher: OSM vs Satellite vs Dark Canvas */}
          <div className="hidden sm:flex items-center bg-white/95 backdrop-blur-md p-1 rounded-xl border border-[#E6E7E5] text-[10px] text-[#5C6B64] shadow-sm">
            <button
              onClick={() => setSelectedMapTheme("osm")}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedMapTheme === "osm" ? "bg-[#176B3A] text-white" : "hover:text-[#0E2A20]"
              }`}
            >
              Street Map
            </button>
            <button
              onClick={() => setSelectedMapTheme("satellite")}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedMapTheme === "satellite" ? "bg-[#0E2A20] text-[#C8A838]" : "hover:text-[#0E2A20]"
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setSelectedMapTheme("darkCanvas")}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedMapTheme === "darkCanvas" ? "bg-[#C8A838] text-[#0E2A20]" : "hover:text-[#0E2A20]"
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* City Focus Buttons */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-[#E6E7E5] shadow-sm pointer-events-auto">
          {["ALL", "Karachi", "Lahore", "Islamabad", "Rawalpindi"].map((city) => (
            <button
              key={city}
              onClick={() => handleCityJump(city)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                activeCityFilter === city
                  ? "bg-[#176B3A] text-white shadow-sm"
                  : "text-[#5C6B64] hover:text-[#0E2A20] hover:bg-[#F4F5F3]"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Venue Floating Quick-Card */}
      {activeVenue && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-xs z-20 bg-white/95 backdrop-blur-md border border-[#176B3A]/40 p-4 rounded-2xl shadow-[0_8px_24px_rgba(14,42,32,0.14)] animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between text-[10px] text-[#176B3A] font-bold uppercase tracking-wider">
            <span>{activeVenue.city} • {activeVenue.area}</span>
            <button
              onClick={() => setActiveVenue(null)}
              className="text-[#5C6B64] hover:text-[#0E2A20] cursor-pointer"
            >
              ✕
            </button>
          </div>
          <h4 className="text-sm font-bold text-[#0E2A20] mt-1 font-display">
            {activeVenue.name}
          </h4>
          <p className="text-xs text-[#5C6B64] mt-0.5 line-clamp-1">
            {activeVenue.tagline}
          </p>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#E6E7E5]">
            <span className="text-xs font-display font-bold text-[#176B3A]">
              from {formatPKR(Math.min(...activeVenue.pitches.map((p) => p.pricePerHour)))}/hr
            </span>
            <button
              onClick={() => onSelectVenue(activeVenue)}
              className="px-3 py-1.5 rounded-lg bg-[#0E2A20] text-[#C8A838] text-xs font-display font-bold flex items-center gap-1 shadow-sm hover:bg-[#143B2D] cursor-pointer"
            >
              Book Slot <CaretRight className="w-3.5 h-3.5" weight="bold" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
