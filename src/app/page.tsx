"use client";

import React, { useState, useMemo } from "react";
import { 
  Flame, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Users, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Trophy,
  Activity,
  Layers,
  Compass
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
import Link from "next/link";

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState<string>("ALL");
  const [selectedSport, setSelectedSport] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeVenueForBooking, setActiveVenueForBooking] = useState<GroundVenue | null>(null);
  const [recentBookings, setRecentBookings] = useState<BookingDetails[]>([]);

  // Geolocation & Proximity Radius
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number | null>(null);

  // Trigger browser GPS or fall back to city center
  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setSelectedRadiusKm(15);
        },
        (err) => {
          // Fallback to Karachi center for demonstration if permission denied
          setUserCoords(CITY_CENTERS.Karachi);
          setSelectedRadiusKm(15);
          alert("GPS permission not granted. Defaulting to Karachi coordinates for demonstration.");
        }
      );
    } else {
      setUserCoords(CITY_CENTERS.Karachi);
      setSelectedRadiusKm(15);
    }
  };

  // Filter & Distance Sorting
  const filteredVenuesWithDistance = useMemo(() => {
    return MOCK_VENUES.map((venue) => {
      let distanceKm: number | undefined;
      if (userCoords) {
        distanceKm = calculateDistanceKm(userCoords.lat, userCoords.lng, venue.lat, venue.lng);
      }
      return { venue, distanceKm };
    }).filter(({ venue, distanceKm }) => {
      // City filter
      if (selectedCity !== "ALL" && venue.city !== selectedCity) {
        return false;
      }

      // Sport filter
      if (selectedSport !== "ALL") {
        const hasSport = venue.pitches.some((p) => p.sportType === selectedSport);
        if (!hasSport) return false;
      }

      // Radius filter
      if (selectedRadiusKm && distanceKm !== undefined && distanceKm > selectedRadiusKm) {
        return false;
      }

      // Search query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchName = venue.name.toLowerCase().includes(q);
        const matchArea = venue.area.toLowerCase().includes(q);
        const matchCity = venue.city.toLowerCase().includes(q);
        const matchPitch = venue.pitches.some((p) => p.name.toLowerCase().includes(q));
        if (!matchName && !matchArea && !matchCity && !matchPitch) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
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
    <main className="space-y-16 pb-20">
      {/* 1. HERO SECTION: ASYMMETRIC STADIUM FIXTURE & EDITORIAL HEADLINE */}
      <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 border-b border-[#17261E] stadium-mesh-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Direct Matchday Statement & Actions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12231A] border border-[#1E3A2B] text-xs font-semibold text-[#00E575]">
                <span className="w-2 h-2 rounded-full bg-[#00E575] animate-pulse" />
                <span>32 Floodlit Grounds Active Tonight</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white font-display tracking-tight leading-[1.1]">
                The floodlights are on. <br />
                Lock your pitch in 60 seconds.
              </h1>

              <p className="text-sm sm:text-base text-gray-300 max-w-xl leading-relaxed">
                Direct turf booking for full 11-a-side stadiums, 7-a-side futsal cages, glass padel courts, and floodlit tape-ball nets in Karachi, Lahore, and Islamabad. No WhatsApp delays, no double-bookings.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#venues"
                  className="px-6 py-3 rounded-xl bg-[#00E575] hover:bg-[#00c966] text-[#090D10] font-extrabold text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Browse Available Pitches</span>
                </a>
                <a
                  href="#my-bookings"
                  className="px-5 py-3 rounded-xl bg-[#0C1611] hover:bg-[#12231A] text-white border border-[#1E3A2B] font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#00E575]" />
                  <span>My Match Passes</span>
                </a>
                <Link
                  href="/caretaker"
                  className="px-4 py-3 rounded-xl bg-[#0C1611] hover:bg-[#12231A] text-gray-300 hover:text-white border border-[#1E2C22] text-xs font-medium transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-neon-cyan" />
                  <span>Caretaker Gate PIN</span>
                </Link>
              </div>

              {/* Direct Ground Specifications Preview */}
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
                  <strong className="text-[#00E575] font-semibold">10-Minute Hold</strong>
                </div>
              </div>
            </div>

            {/* Right Column: Live Pitch Telemetry & Stadium Board */}
            <div className="lg:col-span-5">
              <div className="bg-[#0A130F] border border-[#1C2E24] rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#17261E] pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Activity className="w-4 h-4 text-[#00E575]" />
                    <span>Tonight&apos;s Matchday Status</span>
                  </div>
                  <span className="text-[11px] text-gray-400">Live Telemetry</span>
                </div>

                {/* Live Stadium List */}
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-[#0F1D16] border border-[#1B2F23] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">Kamil FC Complex (11v11)</div>
                      <div className="text-[11px] text-gray-400">DHA Phase 6, Karachi • 500-Lux Lights</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00E575]/20 text-[#00E575] border border-[#00E575]/40">
                      Open 21:00
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0F1D16] border border-[#1B2F23] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">Legends Sports Arena (Gulberg)</div>
                      <div className="text-[11px] text-gray-400">Gulberg III, Lahore • Tapeball Cage 1</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00E575]/20 text-[#00E575] border border-[#00E575]/40">
                      Open 20:00
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0F1D16] border border-[#1B2F23] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">Capital Padel Club (WPT Spec)</div>
                      <div className="text-[11px] text-gray-400">Sector F-7, Islamabad • Glass Court</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      1 Slot Left
                    </span>
                  </div>
                </div>

                <div className="bg-[#070D0A] p-3 rounded-xl border border-[#17261E] flex items-center justify-between text-xs text-gray-300">
                  <span className="text-[11px]">Match buffer policy:</span>
                  <strong className="text-white">50m Play + 10m Changeover</strong>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE OPENSTREETMAP SECTION WITH CITY JUMPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display flex items-center gap-2">
              <MapPin className="w-5 h-5 text-neon-green" />
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

      {/* 2.5 MY BOOKINGS & PASSES HUB */}
      <MyBookingsSection />

      {/* 3. GROUND EXPLORER & BOOKING CATALOG */}
      <section id="venues" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-dark-border pb-4">
          <div>
            <span className="text-neon-green text-xs font-bold uppercase tracking-wider block">
              Direct Online Booking & Facility Deep Dives
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-0.5">
              Featured Arenas & Multi-Court Grounds
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Click any card to explore court dimensions, surface specs, floodlight lux ratings, and live slot matrices.
            </p>
          </div>
          <div className="text-xs text-gray-400">
            Showing <strong className="text-white">{filteredVenuesWithDistance.length}</strong> venues
          </div>
        </div>

        {/* Filter Bar with GPS Near Me and Distance Radius */}
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

        {/* Venues Grid */}
        {filteredVenuesWithDistance.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredVenuesWithDistance.map(({ venue, distanceKm }) => (
              <GroundCard
                key={venue.id}
                venue={venue}
                onSelectVenue={(v) => setActiveVenueForBooking(v)}
                userDistanceKm={distanceKm}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-dark-card rounded-2xl border border-dark-border space-y-3">
            <MapPin className="w-8 h-8 text-gray-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No grounds match your filter criteria</h3>
            <p className="text-xs text-gray-400">
              Try expanding your distance radius or switching sports to find available venues.
            </p>
            <button
              onClick={() => {
                setSelectedCity("ALL");
                setSelectedSport("ALL");
                setSearchQuery("");
                setSelectedRadiusKm(null);
                setUserCoords(null);
              }}
              className="px-4 py-2 rounded-xl bg-neon-green text-dark text-xs font-bold"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* 4. GROUND PROTOCOL & CAPTAIN'S MATCHDAY FLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-[#0A130F] border border-[#17261E] rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="max-w-xl text-left space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
              Built for Ground Realities in Pakistan
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Replacing lost WhatsApp diary entries, double-booked turf clashes, and midnight cash arguments under floodlights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#0D1914] border border-[#1C2F24] p-6 rounded-2xl space-y-3 relative overflow-hidden">
              <div className="text-[11px] font-mono font-bold text-[#00E575]">
                PHASE 01 • DATABASE LOCK
              </div>
              <h3 className="text-base font-bold text-white">10-Minute Atomic Slot Hold</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                When you tap a slot, an atomic database lock freezes it for 10 minutes. No competing team can hijack your ground while you confirm attendance with your squad.
              </p>
            </div>

            <div className="bg-[#0D1914] border border-[#1C2F24] p-6 rounded-2xl space-y-3 relative overflow-hidden">
              <div className="text-[11px] font-mono font-bold text-[#00E575]">
                PHASE 02 • SQUAD SETTLEMENT
              </div>
              <h3 className="text-base font-bold text-white">Squad Pay with State Bank Raast</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Auto-generates exact per-player shares with your Raast IBAN. Share to your squad group with 1 tap so teammates transfer their share directly to you before kickoff.
              </p>
            </div>

            <div className="bg-[#0D1914] border border-[#1C2F24] p-6 rounded-2xl space-y-3 relative overflow-hidden">
              <div className="text-[11px] font-mono font-bold text-[#00E575]">
                PHASE 03 • PITCH GATE PASS
              </div>
              <h3 className="text-base font-bold text-white">4-Digit Caretaker Check-In PIN</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Recite your numeric pass to the ground attendant under floodlights. The attendant verifies turf studs, reconciles remaining cash dues, and unlocks pitch access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TOURNAMENT AUTOMATION */}
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
