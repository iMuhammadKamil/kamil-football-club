"use client";

import React from "react";
import {
  MagnifyingGlass,
  NavigationArrow,
  Compass,
  X,
  SquaresFour,
  SoccerBall,
  TennisBall,
  PingPong,
  Cricket,
  SneakerMove,
} from "@phosphor-icons/react";
import { Chip, Input } from "@/components/ui";

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

const SPORT_OPTIONS = [
  { id: "ALL", label: "All", Icon: SquaresFour },
  { id: "FOOTBALL_11A_SIDE", label: "11v11", Icon: SoccerBall },
  { id: "FOOTBALL_7A_SIDE", label: "7v7 Turf", Icon: SoccerBall },
  { id: "FOOTBALL_5A_SIDE", label: "Futsal", Icon: SoccerBall },
  { id: "PADEL", label: "Padel", Icon: TennisBall },
  { id: "CRICKET_TAPEBALL", label: "Tape-ball", Icon: Cricket },
  { id: "CRICKET_HARDBALL", label: "Cricket", Icon: Cricket },
  { id: "BADMINTON", label: "Badminton", Icon: TennisBall },
  { id: "TABLE_TENNIS", label: "Ping Pong", Icon: PingPong },
  { id: "RUNNING_TRACK", label: "Track", Icon: SneakerMove },
];

const RADIUS_OPTIONS = [
  { label: "All", value: null },
  { label: "< 5 km", value: 5 },
  { label: "< 15 km", value: 15 },
  { label: "< 30 km", value: 30 },
];

export default function FilterBar({
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
    <div className="space-y-4">
      {/* Visual Sport Icon Tile Strip (Mockup .sports) */}
      <div className="flex items-start gap-3 sm:gap-4 overflow-x-auto pb-1 scrollbar-none">
        {SPORT_OPTIONS.map((sport) => {
          const Icon = sport.Icon;
          const active = selectedSport === sport.id;
          return (
            <button
              key={sport.id}
              type="button"
              onClick={() => onSelectSport(sport.id)}
              className="flex-none w-[64px] text-center group cursor-pointer focus:outline-none"
            >
              <div
                className={`w-[54px] h-[54px] mx-auto mb-1.5 rounded-2xl border flex items-center justify-center transition-all ${
                  active
                    ? "bg-[#176B3A] border-[#176B3A] text-[#C8A838] shadow-md scale-[1.03]"
                    : "bg-white border-[#E6E7E5] text-[#176B3A] shadow-[0_2px_10px_rgba(14,42,32,0.06)] group-hover:border-[#176B3A]/45"
                }`}
              >
                <Icon weight="duotone" className="w-6 h-6" />
              </div>
              <span
                className={`block text-[11px] font-bold leading-tight truncate ${
                  active ? "text-[#0E2A20]" : "text-[#5C6B64] group-hover:text-[#0E2A20]"
                }`}
              >
                {sport.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Compact Single-Line Search + Near Me Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <MagnifyingGlass
            weight="duotone"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#176B3A]"
          />
          <Input
            type="text"
            placeholder="Search club, sector, or ground..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-9 bg-white shadow-[0_2px_10px_rgba(14,42,32,0.04)]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C6B64] hover:text-[#0E2A20] cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {onLocateUser && (
          <Chip
            type="button"
            active={Boolean(userCoordsLocated)}
            tone="forest"
            onClick={onLocateUser}
            className="rounded-xl py-2.5 shrink-0"
          >
            <Compass weight="duotone" className="w-4 h-4" />
            <span className="hidden sm:inline">{userCoordsLocated ? "GPS On" : "Near Me"}</span>
          </Chip>
        )}
      </div>

      {/* Proximity Radius Pills (only when GPS active) */}
      {onSelectRadius && userCoordsLocated && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] text-[#5C6B64] flex items-center gap-1 font-semibold mr-1">
            <NavigationArrow weight="duotone" className="w-3.5 h-3.5 text-[#176B3A]" /> Radius:
          </span>
          {RADIUS_OPTIONS.map((opt, i) => (
            <Chip
              key={i}
              type="button"
              active={selectedRadiusKm === opt.value}
              tone="gold"
              onClick={() => onSelectRadius(opt.value)}
              className="py-1 px-2.5 text-[11px]"
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}
