"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  CalendarCheck,
  ShieldCheck,
  ArrowRight,
  Star,
} from "@phosphor-icons/react";
import GroundCard from "@/components/GroundCard";
import FilterBar from "@/components/FilterBar";
import BookingModal from "@/components/BookingModal";
import InteractiveMap from "@/components/InteractiveMap";
import TournamentSection from "@/components/TournamentSection";
import MyBookingsSection from "@/components/MyBookingsSection";
import { Card, Button, EmptyState } from "@/components/ui";
import { MOCK_VENUES, getVenueDisplayImage } from "@/data/mockVenues";
import { GroundVenue, BookingDetails } from "@/types";
import { calculateDistanceKm, CITY_CENTERS } from "@/lib/geo";
import { formatPKR } from "@/lib/utils";

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState<string>("ALL");
  const [selectedSport, setSelectedSport] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeVenueForBooking, setActiveVenueForBooking] = useState<GroundVenue | null>(null);
  const [recentBookings, setRecentBookings] = useState<BookingDetails[]>([]);

  // Geolocation & Proximity Radius
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number | null>(null);
  const [geoFallbackNote, setGeoFallbackNote] = useState<string | null>(null);

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setSelectedRadiusKm(15);
          setGeoFallbackNote(null);
        },
        () => {
          setUserCoords(CITY_CENTERS.Karachi);
          setSelectedRadiusKm(15);
          setGeoFallbackNote("GPS unavailable — showing distance from Karachi center.");
        }
      );
    } else {
      setUserCoords(CITY_CENTERS.Karachi);
      setSelectedRadiusKm(15);
      setGeoFallbackNote("GPS unsupported — showing distance from Karachi center.");
    }
  };

  const resetFilters = () => {
    setSelectedCity("ALL");
    setSelectedSport("ALL");
    setSearchQuery("");
    setSelectedRadiusKm(null);
    setUserCoords(null);
    setGeoFallbackNote(null);
  };

  const hasActiveFilters =
    selectedCity !== "ALL" ||
    selectedSport !== "ALL" ||
    searchQuery.trim().length > 0 ||
    userCoords !== null;

  const filteredVenuesWithDistance = useMemo(() => {
    return MOCK_VENUES.map((venue) => {
      let distanceKm: number | undefined;
      if (userCoords) {
        distanceKm = calculateDistanceKm(userCoords.lat, userCoords.lng, venue.lat, venue.lng);
      }
      return { venue, distanceKm };
    })
      .filter(({ venue, distanceKm }) => {
        if (selectedCity !== "ALL" && venue.city !== selectedCity) return false;
        if (selectedSport !== "ALL" && !venue.pitches.some((p) => p.sportType === selectedSport)) {
          return false;
        }
        if (selectedRadiusKm && distanceKm !== undefined && distanceKm > selectedRadiusKm) {
          return false;
        }
        if (searchQuery.trim().length > 0) {
          const q = searchQuery.toLowerCase();
          const matchName = venue.name.toLowerCase().includes(q);
          const matchArea = venue.area.toLowerCase().includes(q);
          const matchCity = venue.city.toLowerCase().includes(q);
          const matchPitch = venue.pitches.some((p) => p.name.toLowerCase().includes(q));
          if (!matchName && !matchArea && !matchCity && !matchPitch) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.distanceKm !== undefined && b.distanceKm !== undefined) {
          return a.distanceKm - b.distanceKm;
        }
        return 0;
      });
  }, [selectedCity, selectedSport, searchQuery, userCoords, selectedRadiusKm]);

  const handleBookingConfirmed = (booking: BookingDetails) => {
    setRecentBookings([booking, ...recentBookings]);
  };

  const spotlightVenue = filteredVenuesWithDistance[0]?.venue || MOCK_VENUES[0];
  const spotlightPrice = Math.min(...spotlightVenue.pitches.map((p) => p.pricePerHour));
  const spotlightImg = getVenueDisplayImage(spotlightVenue, selectedSport);

  const HEADER_CITIES = [
    { id: "ALL", label: "All Cities" },
    { id: "Islamabad", label: "Islamabad" },
    { id: "Rawalpindi", label: "Rawalpindi" },
    { id: "Lahore", label: "Lahore" },
    { id: "Karachi", label: "Karachi" },
  ];

  return (
    <main className="space-y-10 pb-20">
      {/* 1. MOCKUP-INSPIRED ROUNDED EVERGREEN HEADER + SPOTLIGHT */}
      <section className="relative overflow-hidden pt-6 pb-8 sm:pt-10 sm:pb-12 rounded-b-[28px] sm:rounded-b-[36px] stadium-mesh-bg text-white shadow-lg">
        {/* Subtle Tactical Pitch Line-Art */}
        <svg
          className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-[0.09] text-[#C8A838] hidden lg:block"
          viewBox="0 0 500 500"
          fill="none"
          aria-hidden="true"
        >
          <rect x="40" y="30" width="430" height="440" rx="16" stroke="currentColor" strokeWidth="2" />
          <line x1="40" y1="250" x2="470" y2="250" stroke="currentColor" strokeWidth="2" />
          <circle cx="255" cy="250" r="64" stroke="currentColor" strokeWidth="2" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left: Greeting, Title & Live City Selector Pills */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between sm:justify-start gap-2.5 flex-wrap">
                <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#C8A838]">
                  KAMIL FC · {MOCK_VENUES.length} VERIFIED GROUNDS
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href="/caretaker"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white border border-white/15 transition-all"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C8A838]" weight="duotone" />
                    <span>Gate PIN</span>
                  </Link>
                  <Link
                    href="/caretaker/rush"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C8A838]/20 hover:bg-[#C8A838]/30 text-[11px] font-bold text-[#C8A838] border border-[#C8A838]/35 transition-all"
                  >
                    <span>Rush Queue</span>
                  </Link>
                </div>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight leading-[1.06]">
                Find Your Pitch.{" "}
                <span className="text-[#C8A838]">Book in 1 Tap.</span>
              </h1>

              {/* City Pills directly inside the green header (matches mockup) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
                {HEADER_CITIES.map((c) => {
                  const active = selectedCity === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCity(c.id)}
                      className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        active
                          ? "bg-[#C8A838] text-[#0E2A20] shadow-md"
                          : "bg-white/15 text-white hover:bg-white/25"
                      }`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Tonight's Visual Spotlight Card (matches mockup .hero) */}
            <div className="lg:col-span-5">
              <div
                onClick={() => setActiveVenueForBooking(spotlightVenue)}
                className="relative h-48 sm:h-52 rounded-2xl overflow-hidden border border-white/20 shadow-2xl cursor-pointer group"
              >
                <img
                  src={spotlightImg}
                  alt={spotlightVenue.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E2A20] via-[#0E2A20]/35 to-transparent" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-[#C8A838] text-[#0E2A20] text-[10px] font-extrabold uppercase tracking-wider shadow">
                    Tonight in {selectedCity === "ALL" ? spotlightVenue.city : selectedCity}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/95 text-[#0E2A20] text-[11px] font-bold flex items-center gap-1 shadow">
                    <Star className="w-3.5 h-3.5 text-[#C8A838]" weight="fill" />
                    {spotlightVenue.rating}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-lg font-extrabold text-white font-display truncate">
                      {spotlightVenue.name}
                    </h2>
                    <p className="text-xs text-white/80 flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#C8A838] shrink-0" weight="duotone" />
                      {spotlightVenue.area} · from {formatPKR(spotlightPrice)}/hr
                    </p>
                  </div>
                  <span className="px-3.5 py-2 rounded-full bg-[#C8A838] text-[#0E2A20] text-xs font-display font-extrabold flex items-center gap-1 shrink-0 shadow-md group-hover:bg-[#d8b848]">
                    Book <ArrowRight className="w-3.5 h-3.5" weight="bold" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VISUAL SPORT ICONS + GROUNDS GRID */}
      <section id="venues" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <FilterBar
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          selectedSport={selectedSport}
          onSelectSport={setSelectedSport}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onLocateUser={handleLocateUser}
          userCoordsLocated={!!userCoords}
          selectedRadiusKm={selectedRadiusKm}
          onSelectRadius={setSelectedRadiusKm}
        />

        <div className="flex items-center justify-between pt-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0E2A20] font-display">
            {selectedCity === "ALL" ? "All Verified Grounds" : `Grounds in ${selectedCity}`}
          </h2>
          <div className="flex items-center gap-2.5 text-xs text-[#5C6B64]">
            <span>
              <strong className="text-[#0E2A20]">{filteredVenuesWithDistance.length}</strong>{" "}
              {filteredVenuesWithDistance.length === 1 ? "ground" : "grounds"}
            </span>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={resetFilters} className="rounded-full">
                Clear
              </Button>
            )}
          </div>
        </div>

        {geoFallbackNote && (
          <p className="text-[11px] text-[#8D7216] font-semibold px-1">{geoFallbackNote}</p>
        )}

        {filteredVenuesWithDistance.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-1">
            {filteredVenuesWithDistance.map(({ venue, distanceKm }) => (
              <GroundCard
                key={venue.id}
                venue={venue}
                onSelectVenue={(v) => setActiveVenueForBooking(v)}
                userDistanceKm={distanceKm}
                selectedSport={selectedSport}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No grounds match your filter criteria"
            description="Try switching sports or clearing your city filter to see all available Pakistani venues."
            actionLabel="Reset All Filters"
            onAction={resetFilters}
          />
        )}
      </section>

      {/* 3. INTERACTIVE OPENSTREETMAP RADAR */}
      <section id="radar" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0E2A20] font-display flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#176B3A]" />
              Live Sports Ground Radar (Pakistan)
            </h2>
            <p className="text-xs text-[#5C6B64] mt-0.5">
              Explore ground locations in Karachi, Lahore, Islamabad, and Rawalpindi. Tap city pills on the map to jump instantly.
            </p>
          </div>
        </div>

        <InteractiveMap
          venues={filteredVenuesWithDistance.length > 0 ? filteredVenuesWithDistance.map((x) => x.venue) : MOCK_VENUES}
          onSelectVenue={(venue) => setActiveVenueForBooking(venue)}
        />
      </section>

      {/* 4. MY BOOKINGS & PASSES HUB */}
      <MyBookingsSection />

      {/* 5. GROUND PROTOCOL & CAPTAIN'S MATCHDAY FLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <Card className="p-6 sm:p-10 space-y-8">
          <div className="max-w-xl text-left space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#176B3A]">
              Matchday Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0E2A20] font-display tracking-tight">
              Built for Ground Realities in Pakistan
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6B64] leading-relaxed">
              Replacing lost WhatsApp diary entries, double-booked turf clashes, and midnight cash arguments under floodlights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#F4F5F3] border border-[#E6E7E5] p-6 rounded-2xl space-y-3">
              <div className="text-[11px] font-mono font-bold text-[#176B3A]">
                01 • ATOMIC SLOT HOLD
              </div>
              <h3 className="text-base font-display font-bold text-[#0E2A20]">15-Minute Slot Lock</h3>
              <p className="text-xs text-[#5C6B64] leading-relaxed">
                When you tap a slot, an atomic hold freezes it so no competing squad can hijack your pitch while confirming attendance.
              </p>
            </div>

            <div className="bg-[#F4F5F3] border border-[#E6E7E5] p-6 rounded-2xl space-y-3">
              <div className="text-[11px] font-mono font-bold text-[#176B3A]">
                02 • SQUAD SETTLEMENT
              </div>
              <h3 className="text-base font-display font-bold text-[#0E2A20]">JazzCash, Raast &amp; Split</h3>
              <p className="text-xs text-[#5C6B64] leading-relaxed">
                Auto-generates exact per-player shares so teammates transfer their share directly before kickoff.
              </p>
            </div>

            <div className="bg-[#F4F5F3] border border-[#E6E7E5] p-6 rounded-2xl space-y-3">
              <div className="text-[11px] font-mono font-bold text-[#8D7216]">
                03 • PITCH GATE PASS
              </div>
              <h3 className="text-base font-display font-bold text-[#0E2A20]">4-Digit Caretaker PIN</h3>
              <p className="text-xs text-[#5C6B64] leading-relaxed">
                Recite your numeric pass to the ground attendant under floodlights to reconcile cash dues and unlock pitch access.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* 6. TOURNAMENT AUTOMATION */}
      <TournamentSection />

      {/* BOOKING MODAL DRAWER */}
      {activeVenueForBooking && (
        <BookingModal
          venue={activeVenueForBooking}
          onClose={() => setActiveVenueForBooking(null)}
          onBookingConfirmed={handleBookingConfirmed}
        />
      )}
    </main>
  );
}
