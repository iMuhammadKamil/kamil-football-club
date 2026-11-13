"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Trophy,
  MapPin,
  ShieldCheck,
  CalendarCheck as Calendar,
  List as Menu,
  X,
  Compass,
  SquaresFour as LayoutDashboard,
} from "@phosphor-icons/react";

function PitchShieldMark({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M16 3L27 7.5V15.5C27 22.1 22.3 27.6 16 29.5C9.7 27.6 5 22.1 5 15.5V7.5L16 3Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="rgba(200, 168, 56, 0.2)"
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
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E6E7E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#0E2A20] text-[#C8A838] flex items-center justify-center transition-transform group-hover:scale-105">
                <PitchShieldMark className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-lg sm:text-xl text-[#0E2A20] tracking-tight">
                    KAMIL <span className="text-[#176B3A]">FC</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#C8A838]/20 text-[#8D7216] border border-[#C8A838]/35">
                    CLUB OS
                  </span>
                </div>
                <p className="text-[11px] text-[#5C6B64] hidden sm:block">
                  Pakistan Multi-Sport &amp; Ground Booking
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/#venues"
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isHome
                    ? "text-[#0E2A20] bg-[#F4F5F3]"
                    : "text-[#5C6B64] hover:text-[#0E2A20] hover:bg-[#F4F5F3]"
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#176B3A]" />
                Grounds
              </Link>
              <Link
                href="/#tournaments"
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-[#5C6B64] hover:text-[#0E2A20] hover:bg-[#F4F5F3] transition-all flex items-center gap-1.5"
              >
                <Trophy className="w-3.5 h-3.5 text-[#C8A838]" />
                Tournaments
              </Link>
              <Link
                href="/#my-bookings"
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#176B3A]/10 text-[#176B3A] border border-[#176B3A]/20 hover:bg-[#176B3A]/15 transition-all flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                My Passes
              </Link>
              <Link
                href="/caretaker"
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  isCaretaker
                    ? "bg-[#0E2A20] text-[#C8A838] border-[#0E2A20]"
                    : "bg-white text-[#5C6B64] border-[#E6E7E5] hover:border-[#176B3A]/40 hover:text-[#0E2A20]"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#176B3A]" />
                Caretaker
              </Link>
              <Link
                href="/owner/dashboard"
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  isOwner
                    ? "bg-[#0E2A20] text-[#C8A838] border-[#0E2A20]"
                    : "bg-white text-[#5C6B64] border-[#E6E7E5] hover:border-[#176B3A]/40 hover:text-[#0E2A20]"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Owner Admin
              </Link>
            </div>

            {/* Desktop Primary CTA */}
            <div className="hidden md:flex items-center">
              <Link
                href="/#venues"
                className="px-4 py-2 rounded-full text-xs sm:text-sm font-display font-bold bg-[#0E2A20] hover:bg-[#176B3A] text-[#C8A838] hover:text-white transition-all flex items-center gap-2 shadow-sm active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                Book Pitch
              </Link>
            </div>

            {/* Mobile Top Controls */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/owner/dashboard"
                className="px-2.5 py-1.5 text-[11px] font-semibold rounded-full bg-[#F4F5F3] text-[#0E2A20] border border-[#E6E7E5]"
              >
                Admin
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-[#F4F5F3] border border-[#E6E7E5] text-[#0E2A20]"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#E6E7E5] px-4 pt-3 pb-5 space-y-2">
            <Link
              href="/#venues"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#F4F5F3] text-[#0E2A20] font-semibold text-sm"
            >
              <MapPin className="w-4 h-4 text-[#176B3A]" />
              Explore Grounds &amp; Turfs
            </Link>
            <Link
              href="/#my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#176B3A]/10 text-[#176B3A] font-semibold text-sm"
            >
              <Calendar className="w-4 h-4" />
              My Booked Slots &amp; Passes
            </Link>
            <Link
              href="/#tournaments"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#F4F5F3] text-[#0E2A20] font-semibold text-sm"
            >
              <Trophy className="w-4 h-4 text-[#C8A838]" />
              Upcoming Tournaments
            </Link>
            <Link
              href="/caretaker"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#F4F5F3] text-[#0E2A20] font-semibold text-sm"
            >
              <ShieldCheck className="w-4 h-4 text-[#176B3A]" />
              Caretaker Check-In Screen
            </Link>
            <Link
              href="/owner/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#0E2A20] text-[#C8A838] font-semibold text-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              Owner Admin Portal
            </Link>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Quick-Nav Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-[#E6E7E5] px-2 py-1.5">
        <div className="grid grid-cols-5 items-center gap-1 max-w-md mx-auto">
          <Link
            href="/#venues"
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-semibold transition-colors ${
              isHome ? "text-[#176B3A]" : "text-[#5C6B64]"
            }`}
          >
            <MapPin className="w-4 h-4 mb-0.5" />
            <span>Grounds</span>
          </Link>
          <Link
            href="/#radar"
            className="flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-semibold text-[#5C6B64] hover:text-[#0E2A20]"
          >
            <Compass className="w-4 h-4 mb-0.5" />
            <span>Radar</span>
          </Link>
          <Link
            href="/#my-bookings"
            className="flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-semibold text-[#5C6B64] hover:text-[#176B3A]"
          >
            <Calendar className="w-4 h-4 mb-0.5" />
            <span>Passes</span>
          </Link>
          <Link
            href="/caretaker"
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-semibold transition-colors ${
              isCaretaker ? "text-[#176B3A]" : "text-[#5C6B64]"
            }`}
          >
            <ShieldCheck className="w-4 h-4 mb-0.5" />
            <span>Field</span>
          </Link>
          <Link
            href="/#venues"
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-full bg-[#0E2A20] text-[#C8A838] text-[11px] font-display font-extrabold shadow-sm"
          >
            <span>Play</span>
          </Link>
        </div>
      </div>
    </>
  );
}
