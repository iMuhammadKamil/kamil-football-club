"use client";

import React from "react";
import Link from "next/link";
import { 
  MapPin, 
  Star, 
  Calendar, 
  ShieldCheck, 
  ChevronRight, 
  Flame, 
  ExternalLink 
} from "lucide-react";
import { GroundVenue, Pitch, SportType } from "@/types";
import { formatPKR } from "@/lib/utils";

interface GroundCardProps {
  venue: GroundVenue;
  onSelectVenue: (venue: GroundVenue) => void;
  userDistanceKm?: number;
}

export function getSportBadge(sportType: SportType) {
  switch (sportType) {
    case "FOOTBALL_11A_SIDE":
      return { label: "11-a-Side Pitch", bg: "bg-emerald-500/20 text-neon-green border-emerald-500/40" };
    case "FOOTBALL_7A_SIDE":
      return { label: "7-a-Side Turf", bg: "bg-green-500/20 text-green-300 border-green-500/30" };
    case "FOOTBALL_5A_SIDE":
      return { label: "5-a-Side Cage", bg: "bg-teal-500/20 text-teal-300 border-teal-500/30" };
    case "PADEL":
      return { label: "Padel Court", bg: "bg-yellow-500/20 text-neon-yellow border-yellow-500/30" };
    case "CRICKET_TAPEBALL":
      return { label: "Tape-ball Net", bg: "bg-orange-500/20 text-neon-orange border-orange-500/30" };
    case "CRICKET_HARDBALL":
      return { label: "Hard-ball Turf", bg: "bg-red-500/20 text-red-300 border-red-500/30" };
    case "BADMINTON":
      return { label: "Badminton", bg: "bg-cyan-500/20 text-neon-cyan border-cyan-500/30" };
    case "RUNNING_TRACK":
      return { label: "Running Track", bg: "bg-purple-500/20 text-neon-purple border-purple-500/30" };
    default:
      return { label: "Turf", bg: "bg-gray-500/20 text-gray-300 border-gray-500/30" };
  }
}

export default function GroundCard({ venue, onSelectVenue, userDistanceKm }: GroundCardProps) {
  const lowestPrice = Math.min(...venue.pitches.map((p) => p.pricePerHour));
  const has11aSide = venue.pitches.some((p) => p.sportType === "FOOTBALL_11A_SIDE");

  return (
    <div className="group relative rounded-2xl bg-dark-card border border-dark-border hover:border-neon-green/60 transition-all duration-300 overflow-hidden flex flex-col hover:shadow-neon-green/10 hover:shadow-xl">
      {/* Featured Badge for 11-a-side */}
      {has11aSide && (
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-neon-green text-[#070A0F] shadow-lg flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 fill-current" />
          Full 11-a-Side Arena
        </div>
      )}

      {/* Rating badge */}
      <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-lg bg-[#070A0F]/80 backdrop-blur-md border border-dark-border text-xs font-bold text-white flex items-center gap-1">
        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
        <span>{venue.rating}</span>
        <span className="text-gray-400 text-[10px]">({venue.reviewCount})</span>
      </div>

      {/* Image container with link to /venue/[slug] */}
      <Link href={`/venue/${venue.slug}`} className="relative h-48 sm:h-52 w-full overflow-hidden bg-dark-elevated block">
        <img
          src={venue.featuredImg}
          alt={venue.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D131F] via-[#0D131F]/30 to-transparent" />

        {/* Location pill on image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-gray-200">
          <div className="flex items-center gap-1.5 font-medium truncate">
            <MapPin className="w-4 h-4 text-neon-green shrink-0" />
            <span className="truncate">{venue.area}, {venue.city}</span>
          </div>
          {userDistanceKm !== undefined && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40">
              {userDistanceKm} km away
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link href={`/venue/${venue.slug}`}>
            <h3 className="text-lg font-bold text-white group-hover:text-neon-green transition-colors font-display line-clamp-1 flex items-center justify-between">
              <span>{venue.name}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-neon-green" />
            </h3>
          </Link>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
            {venue.tagline}
          </p>

          {/* Pitches pills */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {venue.pitches.map((pitch) => {
              const badge = getSportBadge(pitch.sportType);
              return (
                <span
                  key={pitch.id}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${badge.bg}`}
                >
                  {pitch.name.split(" ")[0]} ({badge.label})
                </span>
              );
            })}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-dark-border/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 block">Starting from</span>
            <span className="text-base sm:text-lg font-extrabold text-neon-green">
              {formatPKR(lowestPrice)}
              <span className="text-xs text-gray-400 font-normal"> / hr</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelectVenue(venue)}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-dark-elevated text-white hover:bg-neon-green hover:text-[#070A0F] border border-dark-border hover:border-neon-green transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Calendar className="w-4 h-4 text-neon-green group-hover:text-current" />
              Book Slot
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
