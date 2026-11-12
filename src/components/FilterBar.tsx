"use client";

import React from "react";
import { Search, Filter, Navigation, Compass, X } from "lucide-react";

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
  { id: "TABLE_TENNIS", label: "Table Tennis" },
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
    <div className="bg-[#0C1611] border border-[#17261E] rounded-2xl p-3.5 sm:p-4 space-y-3.5 shadow-lg">
      {/* Top Search & Geo-Locate Row */}
      <div className="flex flex-col lg:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search club, ground or sector (POPO FC, Smurfs FC, Vibrant, F-11, DHA 5, Clifton)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#090D10] border border-[#17261E] text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#00C2A1] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {onLocateUser && (
            <button
              type="button"
              onClick={onLocateUser}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 shrink-0 ${
                userCoordsLocated
                  ? "bg-[#00C2A1]/15 border-[#00C2A1]/50 text-[#00C2A1]"
                  : "bg-[#090D10] border-[#17261E] text-gray-300 hover:border-[#00C2A1]/40 hover:text-white"
              }`}
            >
              <Compass className={`w-4 h-4 ${userCoordsLocated ? "text-[#00C2A1]" : ""}`} />
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
                  type="button"
                  onClick={() => onSelectCity(city.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                    active
                      ? "bg-[#00C2A1] text-[#090D10] border-[#00C2A1] font-extrabold shadow-sm"
                      : "bg-[#090D10] text-gray-300 border-[#17261E] hover:border-[#00C2A1]/40 hover:text-white"
                  }`}
                >
                  {city.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sport Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-[#17261E]/70">
        <span className="text-xs text-gray-400 flex items-center gap-1.5 shrink-0 font-medium mr-1">
          <Filter className="w-3.5 h-3.5 text-[#00C2A1]" />
          Pitch:
        </span>
        {SPORT_OPTIONS.map((sport) => {
          const active = selectedSport === sport.id;
          return (
            <button
              key={sport.id}
              type="button"
              onClick={() => onSelectSport(sport.id)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                active
                  ? "bg-[#00C2A1]/15 text-[#00C2A1] border-[#00C2A1]/50 font-bold"
                  : sport.highlight
                  ? "bg-[#0F1D16] text-[#00E575] border-[#1E3A2B] hover:border-[#00E575]/50"
                  : "bg-[#090D10] text-gray-400 border-[#17261E] hover:text-white hover:border-[#1E3A2B]"
              }`}
            >
              {sport.label}
            </button>
          );
        })}
      </div>

      {/* Proximity Radius Pills */}
      {onSelectRadius && userCoordsLocated && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#17261E]/70 text-xs">
          <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
            <Navigation className="w-3 h-3 text-[#00C2A1]" /> Radius:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {RADIUS_OPTIONS.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSelectRadius(opt.value)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                  selectedRadiusKm === opt.value
                    ? "bg-[#00C2A1] text-[#090D10] border-[#00C2A1] font-bold"
                    : "bg-[#090D10] text-gray-400 border-[#17261E] hover:text-white"
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
