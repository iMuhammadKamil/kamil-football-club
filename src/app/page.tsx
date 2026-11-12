"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Activity,
} from "lucide-react";
import GroundCard from "@/components/GroundCard";
import FilterBar from "@/components/FilterBar";
import BookingModal from "@/components/BookingModal";
import InteractiveMap from "@/components/InteractiveMap";
import TournamentSection from "@/components/TournamentSection";
import MyBookingsSection from "@/components/MyBookingsSection";
import { MOCK_VENUES } from "@/data/mockVenues";
import { GroundVenue, BookingDetails } from "@/types";
import { calculateDistanceKm, CITY_CENTERS } from "@/lib/geo";

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

  return (
    <main className="space-y-14 pb-20">
      {/* 1. STADIUM-NIGHT PITCH HERO */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-[#17261E] stadium-mesh-bg">
        {/* Subtle Futbalr Pitch Marking Backdrop */}
        <svg
          className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-[0.06] text-[#00C2A1] hidden lg:block"
          viewBox="0 0 500 500"
          fill="none"
          aria-hidden="true"
        >
          <rect x="40" y="30" width="430" height="440" rx="16" stroke="currentColor" strokeWidth="2" />
          <line x1="40" y1="250" x2="470" y2="250" stroke="currentColor" strokeWidth="2" />
          <circle cx="255" cy="250" r="64" stroke="currentColor" strokeWidth="2" />
          <rect x="155" y="30" width="200" height="75" stroke="currentColor" strokeWidth="2" />
          <rect x="155" y="395" width="200" height="75" stroke="currentColor" strokeWidth="2" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Matchday Headline & Actions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0D1914] border border-[#1E3A2B] text-xs font-semibold text-[#00C2A1]">
                <span className="w-2 h-2 rounded-full bg-[#00E575] animate-pulse" />
                <span>{MOCK_VENUES.length} Verified Pakistani Venues Active</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white font-display tracking-tight leading-[1.08]">
                Your Game. Your Pitch.{" "}
                <span className="text-[#00C2A1]">Locked in 60 Seconds.</span>
              </h1>

              <p className="text-sm sm:text-base text-gray-300 max-w-xl leading-relaxed">
                Direct turf &amp; indoor court booking across real Pakistani grounds — 11-a-side stadiums, futsal pitches, glass padel courts, cricket nets, badminton halls, and ITTF table tennis arenas in Islamabad, Rawalpindi, Lahore, and Karachi.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#venues"
                  className="px-6 py-3 rounded-full bg-[#00C2A1] hover:bg-[#00E575] text-[#090D10] font-extrabold text-sm transition-all shadow-lg shadow-[#00C2A1]/15 active:scale-95 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Browse Available Pitches</span>
                </a>
                <a
                  href="#my-bookings"
                  className="px-5 py-3 rounded-full bg-[#0C1611] hover:bg-[#0D1914] text-white border border-[#1E3A2B] hover:border-[#00C2A1]/50 font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#00E575]" />
                  <span>My Match Passes</span>
                </a>
                <Link
                  href="/caretaker"
                  className="px-4 py-3 rounded-full bg-[#0C1611] hover:bg-[#0D1914] text-gray-300 hover:text-white border border-[#17261E] text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-[#00C2A1]" />
                  <span>Caretaker Gate PIN</span>
                </Link>
              </div>

              {/* Ground Standards Strip */}
              <div className="pt-4 border-t border-[#17261E] grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block text-[11px]">Stadium Standards</span>
                  <strong className="text-white font-semibold">FIFA Quality Turfs</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Settlement</span>
                  <strong className="text-white font-semibold">State Bank Raast QR</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Anti-Theft Lock</span>
                  <strong className="text-[#00C2A1] font-semibold">10-Minute Hold</strong>
                </div>
              </div>
            </div>

            {/* Right Column: Tonight's Matchday Telemetry Board */}
            <div className="lg:col-span-5">
              <div className="bg-[#0C1611] border border-[#17261E] rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#17261E] pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Activity className="w-4 h-4 text-[#00C2A1]" />
                    <span>Tonight&apos;s Matchday Status</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00C2A1]/15 text-[#00C2A1] border border-[#00C2A1]/30">
                    LIVE PITCHES
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-[#0D1914] border border-[#17261E] flex items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="font-bold text-white">POPO FC Ground (F-11/2)</div>
                      <div className="text-[11px] text-gray-400">Sector F-11/2, Islamabad • 7-a-Side Turf</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00E575]/15 text-[#00E575] border border-[#00E575]/35 shrink-0">
                      Open 21:00
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0D1914] border border-[#17261E] flex items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="font-bold text-white">Legends Arena (DHA Phase 5)</div>
                      <div className="text-[11px] text-gray-400">Khayaban-e-Mujahid, Karachi • Padel &amp; Futsal</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00C2A1]/15 text-[#00C2A1] border border-[#00C2A1]/35 shrink-0">
                      Open 20:00
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0D1914] border border-[#17261E] flex items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="font-bold text-white">Smurfs FC &amp; Vibrant Academy</div>
                      <div className="text-[11px] text-gray-400">F-10/3 Islamabad &amp; DHA 1 Rawalpindi • Floodlit</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E94A10]/20 text-[#FF7A4D] border border-[#E94A10]/40 shrink-0">
                      1 Slot Left
                    </span>
                  </div>
                </div>

                <div className="bg-[#090D10] p-3 rounded-xl border border-[#17261E] flex items-center justify-between text-xs text-gray-300">
                  <span className="text-[11px]">Match buffer policy</span>
                  <strong className="text-white">50m Play + 10m Changeover</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GROUND EXPLORER & BOOKING CARDS GRID (BOOKING-FIRST) */}
      <section id="venues" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#17261E] pb-4">
          <div>
            <span className="text-[#00C2A1] text-xs font-bold uppercase tracking-wider block">
              Direct Online Booking &amp; Facility Specs
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-0.5">
              Featured Arenas &amp; Multi-Court Grounds
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Select a ground to view pitch dimensions, surface specs, floodlight lux ratings, and live slot matrices.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>
              Showing <strong className="text-white">{filteredVenuesWithDistance.length}</strong>{" "}
              {filteredVenuesWithDistance.length === 1 ? "ground" : "grounds"}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="px-2.5 py-1 rounded-full bg-[#0C1611] border border-[#17261E] text-[#00C2A1] hover:border-[#00C2A1]/50 text-[11px] font-semibold"
              >
                Reset
              </button>
            )}
          </div>
        </div>

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

        {geoFallbackNote && (
          <p className="text-[11px] text-[#FFB300] px-1">{geoFallbackNote}</p>
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
          <div className="text-center py-14 bg-[#0C1611] rounded-2xl border border-[#17261E] space-y-3">
            <MapPin className="w-8 h-8 text-[#00C2A1] mx-auto" />
            <h3 className="text-base font-bold text-white">No grounds match your filter criteria</h3>
            <p className="text-xs text-gray-400">
              Try expanding your distance radius or switching sports to find available venues.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-5 py-2 rounded-full bg-[#00C2A1] hover:bg-[#00E575] text-[#090D10] text-xs font-extrabold transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* 3. INTERACTIVE OPENSTREETMAP RADAR */}
      <section id="radar" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#00C2A1]" />
              Live Sports Ground Radar (Pakistan)
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Explore ground locations in Karachi, Lahore, Islamabad, and Rawalpindi. Tap city pills on the map to jump instantly.
            </p>
          </div>
        </div>

        <InteractiveMap
          venues={MOCK_VENUES}
          onSelectVenue={(venue) => setActiveVenueForBooking(venue)}
        />
      </section>

      {/* 4. MY BOOKINGS & PASSES HUB */}
      <MyBookingsSection />

      {/* 5. GROUND PROTOCOL & CAPTAIN'S MATCHDAY FLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-[#0C1611] border border-[#17261E] rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="max-w-xl text-left space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#00C2A1]">
              Matchday Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
              Built for Ground Realities in Pakistan
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Replacing lost WhatsApp diary entries, double-booked turf clashes, and midnight cash arguments under floodlights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#0D1914] border border-[#17261E] p-6 rounded-2xl space-y-3">
              <div className="text-[11px] font-mono font-bold text-[#00C2A1]">
                01 • ATOMIC SLOT HOLD
              </div>
              <h3 className="text-base font-bold text-white">10-Minute Slot Lock</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                When you tap a slot, an atomic hold freezes it for 10 minutes so no competing squad can hijack your pitch while confirming attendance.
              </p>
            </div>

            <div className="bg-[#0D1914] border border-[#17261E] p-6 rounded-2xl space-y-3">
              <div className="text-[11px] font-mono font-bold text-[#00E575]">
                02 • SQUAD SETTLEMENT
              </div>
              <h3 className="text-base font-bold text-white">State Bank Raast Split</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Auto-generates exact per-player shares with your Raast IBAN so teammates transfer their share directly before kickoff.
              </p>
            </div>

            <div className="bg-[#0D1914] border border-[#17261E] p-6 rounded-2xl space-y-3">
              <div className="text-[11px] font-mono font-bold text-[#FFB300]">
                03 • PITCH GATE PASS
              </div>
              <h3 className="text-base font-bold text-white">4-Digit Caretaker PIN</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Recite your numeric pass to the ground attendant under floodlights to reconcile cash dues and unlock pitch access.
              </p>
            </div>
          </div>
        </div>
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
