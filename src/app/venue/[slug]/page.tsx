"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { 
  MapPin, 
  Star, 
  Calendar, 
  ShieldCheck, 
  ArrowLeft, 
  Flame, 
  Zap, 
  Clock, 
  Layers, 
  CheckCircle2
} from "lucide-react";
import { MOCK_VENUES, SPORT_IMAGES } from "@/data/mockVenues";
import { formatPKR } from "@/lib/utils";
import BookingModal from "@/components/BookingModal";
import WeeklySlotMatrix from "@/components/WeeklySlotMatrix";
import { getSportBadge } from "@/components/GroundCard";
import { Pitch, TimeSlot, BookingDetails } from "@/types";

export default function VenueDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const venue = MOCK_VENUES.find((v) => v.slug === slug);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Pre-selected pitch and slot from matrix or cards
  const [preSelectedPitch, setPreSelectedPitch] = useState<Pitch | undefined>(undefined);
  const [preSelectedSlot, setPreSelectedSlot] = useState<TimeSlot | undefined>(undefined);

  if (!venue) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Venue not found</h2>
        <Link href="/" className="text-xs text-neon-green hover:underline">
          Return to All Arenas
        </Link>
      </div>
    );
  }

  const lowestPrice = Math.min(...venue.pitches.map((p) => p.pricePerHour));
  const has11aSide = venue.pitches.some((p) => p.sportType === "FOOTBALL_11A_SIDE");
  const fallbackImg = SPORT_IMAGES[venue.pitches[0]?.sportType || "FOOTBALL_11A_SIDE"];

  const handleSlotSelectedFromMatrix = (pitch: Pitch, slot: TimeSlot) => {
    setPreSelectedPitch(pitch);
    setPreSelectedSlot(slot);
    setBookingModalOpen(true);
  };

  const handleOpenPitchBooking = (pitch: Pitch) => {
    setPreSelectedPitch(pitch);
    setPreSelectedSlot(undefined);
    setBookingModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#090D10] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <Link href="/" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Grounds
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green font-bold text-[10px]">
              {venue.city} • Verified Facility
            </span>
          </div>
        </div>

        {/* Gallery & Header Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="relative h-[320px] sm:h-[420px] w-full rounded-2xl overflow-hidden border border-dark-border bg-dark-card shadow-2xl">
              <img
                src={venue.images[activeImageIndex] || venue.featuredImg}
                alt={venue.name}
                className="w-full h-full object-cover transition-all duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackImg;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090D10] via-transparent to-transparent opacity-80" />

              {has11aSide && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-neon-cyan text-dark font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                  <Flame className="w-4 h-4 fill-current" />
                  FIFA Standard 11-a-Side Stadium
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                    {venue.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-300 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-neon-cyan shrink-0" />
                    {venue.address}
                  </p>
                </div>
              </div>
            </div>

            {venue.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {venue.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border transition-all ${
                      activeImageIndex === idx ? "border-neon-cyan scale-105" : "border-dark-border opacity-60"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${venue.name} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackImg;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Pricing starts at</span>
                <div className="flex items-center gap-1 text-xs font-bold text-yellow-400">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <span>{venue.rating}</span>
                  <span className="text-gray-400 font-normal">({venue.reviewCount} reviews)</span>
                </div>
              </div>

              <div>
                <span className="text-3xl font-extrabold text-neon-green">
                  {formatPKR(lowestPrice)}
                </span>
                <span className="text-xs text-gray-400"> / hour</span>
              </div>

              <div className="bg-dark-elevated p-4 rounded-xl border border-dark-border space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-neon-yellow" /> Generator Backup:
                  </span>
                  <strong className="text-white">200kVA Heavy Diesel</strong>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neon-cyan" /> Operating Hours:
                  </span>
                  <strong className="text-white">06:00 AM – 03:00 AM</strong>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-neon-green" /> Slot Security:
                  </span>
                  <strong className="text-neon-green">10m Atomic Hold</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setPreSelectedPitch(undefined);
                setPreSelectedSlot(undefined);
                setBookingModalOpen(true);
              }}
              className="w-full py-4 rounded-xl bg-neon-green text-dark font-extrabold text-sm flex items-center justify-center gap-2 glow-neon-green shadow-xl hover:bg-neon-green/90 transition-all active:scale-95"
            >
              <Calendar className="w-5 h-5" />
              Book Time Slot Now
            </button>
          </div>
        </div>

        {/* WEEKLY SLOT MATRIX WITH SURGES */}
        <WeeklySlotMatrix
          venue={venue}
          onSlotSelected={handleSlotSelectedFromMatrix}
        />

        {/* Pitches Showcase Table */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-white font-display flex items-center gap-2">
            <Layers className="w-5 h-5 text-neon-green" />
            Available Courts & Pitches ({venue.pitches.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {venue.pitches.map((pitch) => {
              const badge = getSportBadge(pitch.sportType);
              const is11Side = pitch.sportType === "FOOTBALL_11A_SIDE";
              const pitchImg = SPORT_IMAGES[pitch.sportType];
              return (
                <div
                  key={pitch.id}
                  className={`rounded-2xl border overflow-hidden transition-all ${
                    is11Side
                      ? "bg-dark-card border-neon-cyan/50 shadow-lg"
                      : "bg-dark-card border-dark-border hover:border-[#00C2A1]/40"
                  }`}
                >
                  <div className="relative h-36 w-full overflow-hidden bg-[#090D10]">
                    <img
                      src={pitchImg}
                      alt={pitch.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C1611] via-[#0C1611]/20 to-transparent" />
                    <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-white font-display">
                        {pitch.name}
                      </h3>
                      <div className="text-right shrink-0">
                        <span className="text-base font-extrabold text-neon-green">
                          {formatPKR(pitch.pricePerHour)}
                        </span>
                        <span className="text-[10px] text-gray-400 block">/ hour</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-dark-border/60 text-xs text-gray-300 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Dimensions:</span>
                        <span className="font-semibold text-white">{pitch.dimensions || "Standard"}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-gray-400 shrink-0">Surface Spec:</span>
                        <span className="font-semibold text-white text-right">{pitch.surfaceType}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenPitchBooking(pitch)}
                      className="w-full mt-4 py-2.5 rounded-full bg-dark-elevated hover:bg-neon-cyan hover:text-dark text-white text-xs font-bold border border-dark-border hover:border-neon-cyan transition-all"
                    >
                      Select Pitch & View Slots
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Amenities Grid */}
        <div className="bg-dark-card border border-dark-border p-6 rounded-2xl space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Venue Amenities & Facilities
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {venue.amenities.map((amenity, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-dark-elevated border border-dark-border text-center text-xs text-gray-300 font-medium"
              >
                {amenity}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Drawer */}
      {bookingModalOpen && (
        <BookingModal
          venue={venue}
          initialPitch={preSelectedPitch}
          initialSlot={preSelectedSlot}
          onClose={() => {
            setBookingModalOpen(false);
            setPreSelectedPitch(undefined);
            setPreSelectedSlot(undefined);
          }}
          onBookingConfirmed={(b) => {
            // Keep modal open so the captain sees the full confirmation ticket and 4-digit PIN!
          }}
        />
      )}
    </main>
  );
}
