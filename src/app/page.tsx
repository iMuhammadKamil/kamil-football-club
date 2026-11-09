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
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#1E2C44]/80">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-neon-green/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[300px] bg-neon-cyan/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green text-xs font-bold tracking-wide uppercase shadow-sm">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-ping" />
            Pakistan&apos;s Multi-Sport & Ground Management System
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white font-display tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            NO MORE PHONE CALLS. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green via-neon-cyan to-white">
              INSTANT LOCK & SQUAD PAY.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            From <strong>11-a-Side full football stadiums</strong> and <strong>7-a-side futsal cages</strong> to 
            panoramic <strong>Padel tennis</strong> and floodlit <strong>cricket nets</strong> in Karachi, Lahore, and Islamabad. 
            Real-time atomic slot holds, Raast QR checkout, and 4-digit caretaker check-in PINs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="#venues"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-neon-green text-dark font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 glow-neon-green shadow-xl hover:bg-neon-green/90 transition-all active:scale-95"
            >
              <Calendar className="w-5 h-5" />
              Book a Pitch Now
            </a>
            <a
              href="#my-bookings"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-dark-card border border-neon-green/40 hover:border-neon-green text-neon-green font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-dark-elevated transition-all"
            >
              <CheckCircle2 className="w-5 h-5 text-neon-green" />
              My Booked Slots
            </a>
            <Link
              href="/caretaker"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-dark-card border border-dark-border hover:border-neon-cyan text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-dark-elevated transition-all"
            >
              <ShieldCheck className="w-5 h-5 text-neon-cyan" />
              Caretaker PIN
            </Link>
          </div>

          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-dark-card/70 border border-dark-border p-4 rounded-xl">
              <div className="flex items-center gap-2 text-neon-green text-xs font-bold uppercase">
                <Flame className="w-4 h-4" /> 11v11 Ready
              </div>
              <div className="text-xl font-extrabold text-white mt-1">Full Stadiums</div>
              <p className="text-[11px] text-gray-400 mt-0.5">FIFA-standard turfs</p>
            </div>

            <div className="bg-dark-card/70 border border-dark-border p-4 rounded-xl">
              <div className="flex items-center gap-2 text-neon-yellow text-xs font-bold uppercase">
                <Activity className="w-4 h-4" /> Padel & Net
              </div>
              <div className="text-xl font-extrabold text-white mt-1">Glass Courts</div>
              <p className="text-[11px] text-gray-400 mt-0.5">WPT spec panoramic</p>
            </div>

            <div className="bg-dark-card/70 border border-dark-border p-4 rounded-xl">
              <div className="flex items-center gap-2 text-neon-cyan text-xs font-bold uppercase">
                <QrCode className="w-4 h-4" /> Zero Fees
              </div>
              <div className="text-xl font-extrabold text-white mt-1">Raast Instant</div>
              <p className="text-[11px] text-gray-400 mt-0.5">Direct State Bank QR</p>
            </div>

            <div className="bg-dark-card/70 border border-dark-border p-4 rounded-xl">
              <div className="flex items-center gap-2 text-neon-purple text-xs font-bold uppercase">
                <Users className="w-4 h-4" /> Squad Pay
              </div>
              <div className="text-xl font-extrabold text-white mt-1">Split the Bill</div>
              <p className="text-[11px] text-gray-400 mt-0.5">1-tap WhatsApp shares</p>
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

      {/* 4. CORE LOCAL PROBLEMS SOLVED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-neon-cyan uppercase tracking-wider">
              Engineered for Ground Realities in Pakistan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Why Kamil Football Club Replaces WhatsApp Diaries
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-elevated p-6 rounded-2xl border border-dark-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neon-green/20 text-neon-green flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-base font-bold text-white">Double-Booking Prevention</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                When a captain selects 9:00 PM - 10:00 PM, an atomic 10-minute hold lock prevents any other player from snitching the slot while you complete your deposit.
              </p>
            </div>

            <div className="bg-dark-elevated p-6 rounded-2xl border border-dark-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 text-neon-cyan flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-base font-bold text-white">Squad Pay (Split Bill)</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                No more awkward 1:00 AM cash hunting under floodlights. The app calculates per-player shares and crafts a formatted WhatsApp payment card with your Raast IBAN.
              </p>
            </div>

            <div className="bg-dark-elevated p-6 rounded-2xl border border-dark-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neon-yellow/20 text-neon-yellow flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-base font-bold text-white">Caretaker 4-Digit PIN Check-In</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Field caretakers use an ultra-fast high-contrast mobile screen. Players simply recite their 4-digit numeric code to unlock pitch floodlights and verify remaining cash dues.
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
