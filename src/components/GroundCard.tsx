"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Star,
  Calendar,
  ChevronRight,
  Flame,
  ExternalLink,
} from "lucide-react";
import { GroundVenue, SportType } from "@/types";
import { formatPKR } from "@/lib/utils";
import { getVenueDisplayImage, SPORT_IMAGES } from "@/data/mockVenues";

interface GroundCardProps {
  venue: GroundVenue;
  onSelectVenue: (venue: GroundVenue) => void;
  userDistanceKm?: number;
  selectedSport?: string;
}

export function getSportBadge(sportType: SportType) {
  switch (sportType) {
    case "FOOTBALL_11A_SIDE":
      return { label: "11-a-Side", bg: "bg-[#00C2A1]/15 text-[#00C2A1] border-[#00C2A1]/35" };
    case "FOOTBALL_7A_SIDE":
      return { label: "7-a-Side", bg: "bg-[#00E575]/15 text-[#00E575] border-[#00E575]/35" };
    case "FOOTBALL_5A_SIDE":
      return { label: "5-a-Side", bg: "bg-teal-500/15 text-teal-300 border-teal-500/35" };
    case "PADEL":
      return { label: "Padel Court", bg: "bg-[#FFB300]/15 text-[#FFB300] border-[#FFB300]/35" };
    case "CRICKET_TAPEBALL":
      return { label: "Tape-ball", bg: "bg-[#E94A10]/15 text-[#FF7A4D] border-[#E94A10]/35" };
    case "CRICKET_HARDBALL":
      return { label: "Hard-ball", bg: "bg-red-500/15 text-red-300 border-red-500/35" };
    case "BADMINTON":
      return { label: "Badminton", bg: "bg-cyan-500/15 text-cyan-300 border-cyan-500/35" };
    case "TABLE_TENNIS":
      return { label: "Table Tennis", bg: "bg-sky-500/15 text-sky-300 border-sky-500/35" };
    case "RUNNING_TRACK":
      return { label: "Track", bg: "bg-purple-500/15 text-purple-300 border-purple-500/35" };
    default:
      return { label: "Turf", bg: "bg-gray-500/15 text-gray-300 border-gray-500/35" };
  }
}

export default function GroundCard({
  venue,
  onSelectVenue,
  userDistanceKm,
  selectedSport,
}: GroundCardProps) {
  const lowestPrice = Math.min(...venue.pitches.map((p) => p.pricePerHour));
  const has11aSide = venue.pitches.some((p) => p.sportType === "FOOTBALL_11A_SIDE");
  const visiblePitches = venue.pitches.slice(0, 3);
  const extraPitchCount = venue.pitches.length - visiblePitches.length;
  const displayImg = getVenueDisplayImage(venue, selectedSport);
  const fallbackImg = SPORT_IMAGES[venue.pitches[0]?.sportType || "FOOTBALL_11A_SIDE"];

  return (
    <article className="group relative rounded-2xl bg-[#0C1611] border border-[#17261E] hover:border-[#00C2A1]/60 transition-all duration-300 overflow-hidden flex flex-col shadow-lg">
      {/* Top Status & Rating Pills */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
        {has11aSide ? (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#00C2A1] text-[#090D10] shadow-md flex items-center gap-1">
            <Flame className="w-3 h-3 fill-current" />
            11v11 Stadium
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#090D10]/85 backdrop-blur-md text-[#00E575] border border-[#1E3A2B]">
            Floodlit Arena
          </span>
        )}

        <div className="px-2.5 py-1 rounded-full bg-[#090D10]/85 backdrop-blur-md border border-[#17261E] text-xs font-bold text-white flex items-center gap-1">
          <Star className="w-3 h-3 text-[#FFB300] fill-[#FFB300]" />
          <span>{venue.rating}</span>
          <span className="text-gray-400 text-[10px] font-normal">({venue.reviewCount})</span>
        </div>
      </div>

      {/* Venue Photo Header */}
      <Link
        href={`/venue/${venue.slug}`}
        className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#090D10] block"
      >
        <img
          src={displayImg}
          alt={venue.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImg;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1611] via-[#0C1611]/30 to-transparent" />

        {/* Bottom-left Location + Distance Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-xs text-gray-200">
          <div className="flex items-center gap-1.5 font-medium truncate bg-[#090D10]/70 backdrop-blur-sm px-2.5 py-1 rounded-full border border-[#17261E]/80">
            <MapPin className="w-3.5 h-3.5 text-[#00C2A1] shrink-0" />
            <span className="truncate">
              {venue.area}, {venue.city}
            </span>
          </div>
          {userDistanceKm !== undefined && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#00C2A1]/20 text-[#00C2A1] border border-[#00C2A1]/40 shrink-0">
              {userDistanceKm} km
            </span>
          )}
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link href={`/venue/${venue.slug}`} className="block">
            <h3 className="text-lg font-bold text-white group-hover:text-[#00C2A1] transition-colors font-display flex items-center justify-between gap-2">
              <span className="truncate">{venue.name}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[#00C2A1]" />
            </h3>
          </Link>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {venue.tagline}
          </p>

          {/* Compact Pitch Format Pills */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {visiblePitches.map((pitch) => {
              const badge = getSportBadge(pitch.sportType);
              return (
                <span
                  key={pitch.id}
                  className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.bg}`}
                >
                  {badge.label}
                </span>
              );
            })}
            {extraPitchCount > 0 && (
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border bg-[#090D10] text-gray-400 border-[#17261E]">
                +{extraPitchCount} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Pill CTA */}
        <div className="pt-3.5 border-t border-[#17261E] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 block">
              From
            </span>
            <span className="text-base sm:text-lg font-extrabold text-[#00E575]">
              {formatPKR(lowestPrice)}
              <span className="text-xs text-gray-400 font-normal"> / hr</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelectVenue(venue)}
            className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#0F1D16] text-white hover:bg-[#00C2A1] hover:text-[#090D10] border border-[#1E3A2B] hover:border-[#00C2A1] transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5 text-[#00C2A1] group-hover:text-current" />
            <span>Book Pitch</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
