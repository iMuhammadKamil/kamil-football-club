import React from "react";
import Link from "next/link";
import { Shield, Sparkles, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#17261E] bg-[#090D10] text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0D1914] border border-[#1E3A2B] flex items-center justify-center font-black text-[#00C2A1] text-xs">
              KFC
            </div>
            <span className="font-display font-extrabold text-white text-lg tracking-wider">
              KAMIL <span className="text-[#00C2A1]">FC</span>
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Pakistan&apos;s Multi-Sport &amp; Stadium Management Operating System. Built for ground reality: floodlight changeovers, atomic slot holds, and pitch-side PIN check-in.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1914] border border-[#17261E] text-xs text-[#00E575] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#00C2A1]" />
            Islamabad • Rawalpindi • Lahore • Karachi
          </div>
        </div>

        {/* Sports Varieties */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            Sports &amp; Pitches
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="hover:text-[#00C2A1] transition-colors">
              • 11-a-Side Full Football Stadiums
            </li>
            <li className="hover:text-[#00E575] transition-colors">
              • 7-a-Side &amp; 5-a-Side Futsal Cages
            </li>
            <li className="hover:text-[#FFB300] transition-colors">
              • World Padel Tour Glass Courts
            </li>
            <li className="hover:text-[#E94A10] transition-colors">
              • Tape-ball &amp; Hard-ball Cricket Nets
            </li>
            <li className="hover:text-[#00C2A1] transition-colors">
              • BWF Badminton, Table Tennis &amp; Tracks
            </li>
          </ul>
        </div>

        {/* Cities */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            Locations
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-1.5 hover:text-white">
              <MapPin className="w-3.5 h-3.5 text-[#00C2A1]" />
              Islamabad (F-11/2, F-10/3, H-9/4, Gulberg)
            </li>
            <li className="flex items-center gap-1.5 hover:text-white">
              <MapPin className="w-3.5 h-3.5 text-[#00E575]" />
              Rawalpindi (DHA Phase 1, Ayub Park, Shamsabad)
            </li>
            <li className="flex items-center gap-1.5 hover:text-white">
              <MapPin className="w-3.5 h-3.5 text-[#FFB300]" />
              Lahore (Model Town, Gulberg V, Johar Town)
            </li>
            <li className="flex items-center gap-1.5 hover:text-white">
              <MapPin className="w-3.5 h-3.5 text-[#E94A10]" />
              Karachi (Clifton, DHA 5 &amp; 8, Gulshan)
            </li>
          </ul>
        </div>

        {/* Local Payment & Support */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            Local Payments &amp; Access
          </h4>
          <div className="space-y-2.5 text-xs">
            <p className="text-gray-400">
              Supports State Bank Raast P2P QR, JazzCash, EasyPaisa, and Cash on Arrival.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2.5 py-1 rounded-full bg-[#0C1611] border border-[#17261E] text-[11px] font-semibold text-[#00C2A1]">
                Raast Instant
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#0C1611] border border-[#17261E] text-[11px] font-semibold text-[#E94A10]">
                JazzCash
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#0C1611] border border-[#17261E] text-[11px] font-semibold text-[#00E575]">
                EasyPaisa
              </span>
            </div>
            <div className="pt-2">
              <Link
                href="/caretaker"
                className="text-xs text-[#00C2A1] hover:underline inline-flex items-center gap-1.5 font-semibold"
              >
                <Shield className="w-3.5 h-3.5" /> Caretaker / Ground Staff Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#17261E] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <p>© 2026 Kamil Football Club (KFC). Built for Pakistani Sports Culture.</p>
        <p className="flex items-center gap-1.5 text-[#00C2A1] font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Zero Double-Bookings Guarantee
        </p>
      </div>
    </footer>
  );
}
