"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Trophy, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Menu, 
  X, 
  Sparkles,
  PhoneCall
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#070A0F]/90 backdrop-blur-md border-b border-[#1E2C44]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-green via-neon-cyan to-blue-600 p-[2px] transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#070A0F] rounded-[10px] flex items-center justify-center">
                <span className="font-display font-extrabold text-neon-green text-lg tracking-wider">KFC</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-lg sm:text-xl text-white tracking-wide">
                  KAMIL <span className="text-neon-green">FC</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-neon-green/10 text-neon-green border border-neon-green/30">
                  PAKISTAN
                </span>
              </div>
              <p className="text-[11px] text-dark-muted hidden sm:block">
                Multi-Sport Arenas & Turfs
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-5">
            <Link 
              href="/#venues" 
              className="text-xs sm:text-sm font-medium text-gray-300 hover:text-neon-green transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-neon-green" />
              Explore Grounds
            </Link>
            <Link 
              href="/#tournaments" 
              className="text-xs sm:text-sm font-medium text-gray-300 hover:text-neon-yellow transition-colors flex items-center gap-1.5"
            >
              <Trophy className="w-4 h-4 text-neon-yellow" />
              Tournaments
            </Link>
            <Link 
              href="/#my-bookings" 
              className="text-xs sm:text-sm font-semibold text-neon-green hover:text-white transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neon-green/10 border border-neon-green/30"
            >
              <Calendar className="w-3.5 h-3.5 text-neon-green" />
              My Bookings
            </Link>
            <Link 
              href="/caretaker" 
              className="text-xs sm:text-sm font-medium text-gray-300 hover:text-neon-cyan transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-card border border-dark-border"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-neon-cyan" />
              Caretaker
            </Link>
            <Link 
              href="/owner/dashboard" 
              className="text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              Owner Portal
            </Link>
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/#venues"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-neon-green text-[#070A0F] hover:bg-neon-green/90 transition-all glow-neon-green flex items-center gap-2 shadow-lg"
            >
              <Calendar className="w-4 h-4" />
              Book a Turf
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/#my-bookings"
              className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-neon-green/10 text-neon-green border border-neon-green/30 flex items-center gap-1"
            >
              <Calendar className="w-3 h-3" />
              Passes
            </Link>
            <Link
              href="/caretaker"
              className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3" />
              Field
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-dark-card border border-dark-border text-gray-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070A0F] border-b border-[#1E2C44] px-4 pt-3 pb-6 space-y-2.5 animate-in slide-in-from-top-4">
          <Link
            href="/#venues"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-dark-card/60 text-white font-medium text-sm"
          >
            <MapPin className="w-4 h-4 text-neon-green" />
            Explore Arenas & Turfs
          </Link>
          <Link
            href="/#my-bookings"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-neon-green/10 text-neon-green font-semibold text-sm border border-neon-green/30"
          >
            <Calendar className="w-4 h-4 text-neon-green" />
            My Booked Slots & Passes
          </Link>
          <Link
            href="/#tournaments"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-dark-card/60 text-white font-medium text-sm"
          >
            <Trophy className="w-4 h-4 text-neon-yellow" />
            Upcoming Tournaments
          </Link>
          <Link
            href="/caretaker"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-dark-card/60 text-neon-cyan font-medium text-sm border border-neon-cyan/30"
          >
            <ShieldCheck className="w-4 h-4 text-neon-cyan" />
            Caretaker Check-In Screen
          </Link>
          <Link
            href="/owner/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-dark-card/60 text-gray-300 font-medium text-sm"
          >
            Venue Owner Ledger
          </Link>
          <div className="pt-2">
            <Link
              href="/#venues"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl text-center text-sm font-bold bg-neon-green text-[#070A0F] flex items-center justify-center gap-2 glow-neon-green"
            >
              <Calendar className="w-4 h-4" />
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

