"use client";

import React, { useState } from "react";
import { Search, MapPin, Sparkles, Filter, Navigation, Compass } from "lucide-react";

interface FilterBarProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  selectedSport: string;
  onSelectSport: (sport: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onLocateUser?: () => void;
  userCoordsLocated?: boolean;
  selectedRadiusKm?: number | null;
  onSelectRadius?: (radius: number | null) => void;
}

const CITIES = [
  { id: "ALL", label: "All Pakistan" },
  { id: "Karachi", label: "Karachi" },
  { id: "Lahore", label: "Lahore" },
  { id: "Islamabad", label: "Islamabad" },
  { id: "Rawalpindi", label: "Rawalpindi" },
];

const SPORT_OPTIONS = [
  { id: "ALL", label: "All Sports" },
  { id: "FOOTBALL_11A_SIDE", label: "11-a-Side Football", highlight: true },
  { id: "FOOTBALL_7A_SIDE", label: "7-a-Side Turf" },
  { id: "FOOTBALL_5A_SIDE", label: "5-a-Side Futsal" },
  { id: "PADEL", label: "Padel Tennis" },
  { id: "CRICKET_TAPEBALL", label: "Tape-ball Cricket" },
  { id: "CRICKET_HARDBALL", label: "Hard-ball Cricket" },
  { id: "BADMINTON", label: "Badminton" },
  { id: "RUNNING_TRACK", label: "Running Track" },
];

const RADIUS_OPTIONS = [
  { label: "All Radius", value: null },
  { label: "< 5 km", value: 5 },
  { label: "< 15 km", value: 15 },
  { label: "< 30 km", value: 30 },
];

export default function FilterBar({
  selectedCity,
  onSelectCity,
  selectedSport,
  onSelectSport,
  searchQuery,
  onSearchChange,
  onLocateUser,
  userCoordsLocated,
  selectedRadiusKm,
  onSelectRadius,
}: FilterBarProps) {
  return (
    <div className="space-y-3.5">
      {/* Top Search & Geo-Locate Row */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search venue name, area (e.g. DHA Phase 6, Gulberg, F-7)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-card border border-dark-border text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-neon-green transition-all"
          />
        </div>

        {/* GPS Locate Me Button */}
        {onLocateUser && (
          <button
            onClick={onLocateUser}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 shrink-0 ${
              userCoordsLocated
                ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan glow-neon-cyan"
                : "bg-dark-card border-dark-border text-gray-300 hover:border-neon-cyan"
            }`}
          >
            <Compass className={`w-4 h-4 ${userCoordsLocated ? "animate-spin" : ""}`} />
            <span>{userCoordsLocated ? "GPS Active" : "Near Me"}</span>
          </button>
        )}

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CITIES.map((city) => {
            const active = selectedCity === city.id;
            return (
              <button
                key={city.id}
                onClick={() => onSelectCity(city.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  active
                    ? "bg-neon-green text-[#070A0F] border-neon-green glow-neon-green font-bold"
                    : "bg-dark-card text-gray-300 border-dark-border hover:border-gray-500"
                }`}
              >
                {city.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sport Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0 font-medium mr-1">
          <Filter className="w-3.5 h-3.5 text-neon-green" />
          Sport:
        </span>
        {SPORT_OPTIONS.map((sport) => {
          const active = selectedSport === sport.id;
          return (
            <button
              key={sport.id}
              onClick={() => onSelectSport(sport.id)}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                active
                  ? "bg-neon-cyan/20 text-neon-cyan border-neon-cyan font-bold glow-neon-cyan"
                  : sport.highlight
                  ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30 hover:border-emerald-400"
                  : "bg-dark-card/80 text-gray-400 border-dark-border hover:text-white hover:border-gray-500"
              }`}
            >
              {sport.highlight && <Sparkles className="w-3 h-3 text-neon-green" />}
              {sport.label}
            </button>
          );
        })}
      </div>

      {/* Proximity Radius Pills (when GPS or City selected) */}
      {onSelectRadius && userCoordsLocated && (
        <div className="flex items-center gap-2 pt-1 border-t border-dark-border/60 text-xs">
          <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
            <Navigation className="w-3 h-3 text-neon-cyan" /> Distance Radius:
          </span>
          <div className="flex gap-1.5">
            {RADIUS_OPTIONS.map((opt, i) => (
              <button
                key={i}
                onClick={() => onSelectRadius(opt.value)}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border transition-all ${
                  selectedRadiusKm === opt.value
                    ? "bg-neon-cyan text-dark border-neon-cyan font-bold"
                    : "bg-dark-elevated text-gray-400 border-dark-border hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
