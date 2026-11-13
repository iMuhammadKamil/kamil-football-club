"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Star,
  CalendarCheck as Calendar,
  CaretRight as ChevronRight,
  Fire as Flame,
  ArrowSquareOut as ExternalLink,
} from "@phosphor-icons/react";
import { GroundVenue, SportType } from "@/types";
import { formatPKR } from "@/lib/utils";
import { getVenueDisplayImage, SPORT_IMAGES } from "@/data/mockVenues";
import { Card, Button } from "@/components/ui";

interface GroundCardProps {
  venue: GroundVenue;
  onSelectVenue: (venue: GroundVenue) => void;
  userDistanceKm?: number;
  selectedSport?: string;
}

export function getSportBadge(sportType: SportType) {
  switch (sportType) {
    case "FOOTBALL_11A_SIDE":
      return { label: "11-a-Side", bg: "bg-[#176B3A]/10 text-[#176B3A] border-[#176B3A]/20" };
    case "FOOTBALL_7A_SIDE":
      return { label: "7-a-Side", bg: "bg-[#176B3A]/10 text-[#176B3A] border-[#176B3A]/20" };
    case "FOOTBALL_5A_SIDE":
      return { label: "5-a-Side", bg: "bg-[#0E2A20]/10 text-[#0E2A20] border-[#0E2A20]/20" };
    case "PADEL":
      return { label: "Padel Court", bg: "bg-[#C8A838]/20 text-[#8D7216] border-[#C8A838]/35" };
    case "CRICKET_TAPEBALL":
      return { label: "Tape-ball", bg: "bg-[#E94A10]/10 text-[#E94A10] border-[#E94A10]/25" };
    case "CRICKET_HARDBALL":
      return { label: "Hard-ball", bg: "bg-red-50 text-red-700 border-red-200" };
    case "BADMINTON":
      return { label: "Badminton", bg: "bg-emerald-50 text-emerald-800 border-emerald-200" };
    case "TABLE_TENNIS":
      return { label: "Table Tennis", bg: "bg-amber-50 text-amber-800 border-amber-200" };
    case "RUNNING_TRACK":
      return { label: "Track", bg: "bg-slate-100 text-slate-700 border-slate-200" };
    default:
      return { label: "Turf", bg: "bg-[#F4F5F3] text-[#5C6B64] border-[#E6E7E5]" };
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
  const visiblePitches = venue.pitches.slice(0, 2);
  const extraPitchCount = venue.pitches.length - visiblePitches.length;
  const displayImg = getVenueDisplayImage(venue, selectedSport);
  const fallbackImg = SPORT_IMAGES[venue.pitches[0]?.sportType || "FOOTBALL_11A_SIDE"];

  const rushInfo =
    venue.reviewCount >= 150
      ? { label: "Peak Rush", cls: "bg-[#E94A10] text-white" }
      : venue.reviewCount >= 90
        ? { label: "Filling Fast", cls: "bg-[#C8A838] text-[#0E2A20]" }
        : { label: "Open Now", cls: "bg-white/95 text-[#176B3A] border border-[#E6E7E5]" };

  return (
    <Card interactive className="group relative overflow-hidden flex flex-col">
      {/* Top Status & Rating Pills */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5">
          {has11aSide && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#0E2A20] text-[#C8A838] shadow-sm flex items-center gap-1">
              <Flame className="w-3 h-3" weight="fill" />
              11v11
            </span>
          )}
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${rushInfo.cls}`}>
            {rushInfo.label}
          </span>
        </div>

        <div className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-[#E6E7E5] text-xs font-bold text-[#0E2A20] flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 text-[#C8A838]" weight="fill" />
          <span>{venue.rating}</span>
        </div>
      </div>

      {/* Venue Photo Header */}
      <Link
        href={`/venue/${venue.slug}`}
        className="relative h-44 w-full overflow-hidden bg-[#E6E7E5] block"
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E2A20]/70 via-transparent to-transparent" />

        {/* Bottom-left Location + Distance Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-semibold truncate bg-white/95 text-[#0E2A20] px-2.5 py-1 rounded-full shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#176B3A] shrink-0" weight="duotone" />
            <span className="truncate">
              {venue.area}, {venue.city}
            </span>
          </div>
          {userDistanceKm !== undefined && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#C8A838] text-[#0E2A20] shrink-0 shadow-sm">
              {userDistanceKm} km
            </span>
          )}
        </div>
      </Link>

      {/* Card Body — Minimal Text, Instant Action */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link href={`/venue/${venue.slug}`} className="block">
            <h3 className="text-base sm:text-lg font-bold text-[#0E2A20] group-hover:text-[#176B3A] transition-colors font-display flex items-center justify-between gap-2">
              <span className="truncate">{venue.name}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[#176B3A]" weight="bold" />
            </h3>
          </Link>

          {/* Compact Pitch Format Pills */}
          <div className="mt-2 flex flex-wrap gap-1.5">
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
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-[#F4F5F3] text-[#5C6B64] border-[#E6E7E5]">
                +{extraPitchCount}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Instant Book CTA */}
        <div className="pt-3 border-t border-[#E6E7E5] flex items-center justify-between gap-3">
          <div>
            <span className="text-base sm:text-lg font-display font-extrabold text-[#176B3A]">
              {formatPKR(lowestPrice)}
              <span className="text-xs text-[#5C6B64] font-normal"> / hr</span>
            </span>
          </div>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => onSelectVenue(venue)}
            className="rounded-full px-4 py-2"
          >
            <Calendar className="w-3.5 h-3.5" weight="duotone" />
            <span>Book</span>
            <ChevronRight className="w-3.5 h-3.5" weight="bold" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
