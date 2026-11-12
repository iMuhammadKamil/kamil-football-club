"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Trophy,
  MapPin,
  ShieldCheck,
  Calendar,
  Menu,
  X,
  Compass,
  LayoutDashboard,
} from "lucide-react";

function PitchShieldMark({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M16 3L27 7.5V15.5C27 22.1 22.3 27.6 16 29.5C9.7 27.6 5 22.1 5 15.5V7.5L16 3Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="rgba(0, 194, 161, 0.14)"
      />
      <line x1="7.5" y1="16" x2="24.5" y2="16" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="3.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 6.5H20V9.5H12V6.5Z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isCaretaker = pathname?.startsWith("/caretaker");
  const isOwner = pathname?.startsWith("/owner");
  const isHome = pathname === "/";

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#090D10]/95 backdrop-blur-md border-b border-[#17261E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#0D1914] border border-[#1E3A2B] text-[#00C2A1] flex items-center justify-center transition-transform group-hover:scale-105 group-hover:border-[#00C2A1]/60">
                <PitchShieldMark className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-lg sm:text-xl text-white tracking-wide">
                    KAMIL <span className="text-[#00C2A1]">FC</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#0D1914] text-[#00E575] border border-[#1E3A2B]">
                    PITCH OS
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 hidden sm:block">
                  Stadium-Night Turf & Matchday System
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/#venues"
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isHome
                    ? "text-white hover:text-[#00C2A1] hover:bg-[#0D1914]"
                    : "text-gray-300 hover:text-[#00C2A1]"
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#00C2A1]" />
                Grounds
              </Link>
              <Link
                href="/#tournaments"
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-gray-300 hover:text-[#FFB300] hover:bg-[#0D1914] transition-all flex items-center gap-1.5"
              >
                <Trophy className="w-3.5 h-3.5 text-[#FFB300]" />
                Tournaments
              </Link>
              <Link
                href="/#my-bookings"
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#0D1914] text-[#00E575] border border-[#1E3A2B] hover:border-[#00E575]/60 transition-all flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                My Passes
              </Link>
              <Link
                href="/caretaker"
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  isCaretaker
                    ? "bg-[#00C2A1]/15 text-[#00C2A1] border-[#00C2A1]/50"
                    : "bg-[#0C1611] text-gray-300 border-[#17261E] hover:border-[#00C2A1]/40 hover:text-white"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#00C2A1]" />
                Caretaker
              </Link>
              <Link
                href="/owner/dashboard"
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isOwner
                    ? "bg-[#0D1914] text-white border border-[#1E3A2B]"
                    : "text-gray-400 hover:text-white hover:bg-[#0D1914]"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Owner
              </Link>
            </div>

            {/* Desktop Primary CTA */}
            <div className="hidden md:flex items-center">
              <Link
                href="/#venues"
                className="px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold bg-[#00C2A1] hover:bg-[#00E575] text-[#090D10] transition-all flex items-center gap-2 shadow-lg shadow-[#00C2A1]/15 active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                Book Pitch
              </Link>
            </div>

            {/* Mobile Top Controls */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/owner/dashboard"
                className="px-2.5 py-1.5 text-[11px] font-semibold rounded-full bg-[#0C1611] text-gray-300 border border-[#17261E]"
              >
                Owner
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-[#0C1611] border border-[#17261E] text-gray-300 hover:text-white"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#090D10] border-b border-[#17261E] px-4 pt-3 pb-5 space-y-2">
            <Link
              href="/#venues"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#0C1611] border border-[#17261E] text-white font-medium text-sm"
            >
              <MapPin className="w-4 h-4 text-[#00C2A1]" />
              Explore Grounds & Turfs
            </Link>
            <Link
              href="/#my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#0D1914] text-[#00E575] font-semibold text-sm border border-[#1E3A2B]"
            >
              <Calendar className="w-4 h-4" />
              My Booked Slots & Passes
            </Link>
            <Link
              href="/#tournaments"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#0C1611] border border-[#17261E] text-white font-medium text-sm"
            >
              <Trophy className="w-4 h-4 text-[#FFB300]" />
              Upcoming Tournaments
            </Link>
            <Link
              href="/caretaker"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#0C1611] text-[#00C2A1] font-medium text-sm border border-[#00C2A1]/30"
            >
              <ShieldCheck className="w-4 h-4" />
              Caretaker Check-In Screen
            </Link>
            <Link
              href="/owner/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#0C1611] border border-[#17261E] text-gray-300 font-medium text-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              Venue Owner Ledger
            </Link>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Quick-Nav Bar (Futbalr 5-tab bar inspired) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#090D10]/95 backdrop-blur-lg border-t border-[#17261E] px-2 py-1.5">
        <div className="grid grid-cols-5 items-center gap-1 max-w-md mx-auto">
          <Link
            href="/#venues"
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-semibold transition-colors ${
              isHome ? "text-[#00C2A1]" : "text-gray-400 hover:text-white"
            }`}
          >
            <MapPin className="w-4 h-4 mb-0.5" />
            <span>Grounds</span>
          </Link>
          <Link
            href="/#radar"
            className="flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <Compass className="w-4 h-4 mb-0.5" />
            <span>Radar</span>
          </Link>
          <Link
            href="/#my-bookings"
            className="flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-semibold text-gray-400 hover:text-[#00E575] transition-colors"
          >
            <Calendar className="w-4 h-4 mb-0.5" />
            <span>Passes</span>
          </Link>
          <Link
            href="/caretaker"
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-semibold transition-colors ${
              isCaretaker ? "text-[#00C2A1]" : "text-gray-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4 mb-0.5" />
            <span>Field</span>
          </Link>
          <Link
            href="/#venues"
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-full bg-[#00C2A1] text-[#090D10] text-[11px] font-extrabold shadow-md"
          >
            <span>Play</span>
          </Link>
        </div>
      </div>
    </>
  );
}
