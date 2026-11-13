"use client";

import React from "react";
import Link from "next/link";
import { MapPin, ShieldCheck } from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="border-t border-[#E6E7E5] bg-white text-[#5C6B64] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0E2A20] flex items-center justify-center font-display font-black text-[#C8A838] text-xs">
              KFC
            </div>
            <span className="font-display font-extrabold text-[#0E2A20] text-lg tracking-tight">
              KAMIL <span className="text-[#176B3A]">FC</span>
            </span>
          </div>
          <p className="text-xs text-[#5C6B64] leading-relaxed">
            Pakistan&apos;s Multi-Sport &amp; Stadium Management System. Built for ground reality: floodlight changeovers, atomic slot holds, and pitch-side PIN check-in.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4F5F3] border border-[#E6E7E5] text-xs text-[#176B3A] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#176B3A]" />
            Islamabad • Rawalpindi • Lahore • Karachi
          </div>
        </div>

        {/* Sports Varieties */}
        <div>
          <h4 className="text-xs font-display font-bold text-[#0E2A20] uppercase tracking-wider mb-3">
            Sports &amp; Pitches
          </h4>
          <ul className="space-y-2 text-xs">
            <li>• 11-a-Side Full Football Stadiums</li>
            <li>• 7-a-Side &amp; 5-a-Side Futsal Cages</li>
            <li>• Padel Glass Courts</li>
            <li>• Tape-ball &amp; Hard-ball Cricket Nets</li>
            <li>• BWF Badminton, Table Tennis &amp; Tracks</li>
          </ul>
        </div>

        {/* Cities */}
        <div>
          <h4 className="text-xs font-display font-bold text-[#0E2A20] uppercase tracking-wider mb-3">
            Locations
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#176B3A]" weight="duotone" />
              Islamabad (F-11/2, F-10/3, H-9/4, Gulberg)
            </li>
            <li className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#176B3A]" weight="duotone" />
              Rawalpindi (DHA Phase 1, Ayub Park, Shamsabad)
            </li>
            <li className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C8A838]" weight="duotone" />
              Lahore (Model Town, Gulberg V, Johar Town)
            </li>
            <li className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#0E2A20]" weight="duotone" />
              Karachi (Clifton, DHA 5 &amp; 8, Gulshan)
            </li>
          </ul>
        </div>

        {/* Local Payment & Support */}
        <div>
          <h4 className="text-xs font-display font-bold text-[#0E2A20] uppercase tracking-wider mb-3">
            Local Payments &amp; Access
          </h4>
          <div className="space-y-2.5 text-xs">
            <p>
              Supports Raast Instant QR, JazzCash, Easypaisa, and Cash at Pitch.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2.5 py-1 rounded-full bg-[#F4F5F3] border border-[#E6E7E5] text-[11px] font-semibold text-[#176B3A]">
                Raast Instant
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#F4F5F3] border border-[#E6E7E5] text-[11px] font-semibold text-[#0E2A20]">
                JazzCash
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#F4F5F3] border border-[#E6E7E5] text-[11px] font-semibold text-[#176B3A]">
                Easypaisa
              </span>
            </div>
            <div className="pt-2">
              <Link
                href="/caretaker"
                className="text-xs text-[#176B3A] hover:underline inline-flex items-center gap-1.5 font-semibold"
              >
                <ShieldCheck className="w-4 h-4" weight="duotone" />
                Caretaker &amp; Admin Portal →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-[#E6E7E5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C6B64]">
        <p>© {new Date().getFullYear()} Kamil Football Club &amp; Sports Complex Network.</p>
        <p>Built for Pakistani grounds &amp; clubs</p>
      </div>
    </footer>
  );
}
