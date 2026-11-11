import React from "react";
import Link from "next/link";
import { Shield, Sparkles, MapPin, Phone, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#17261E] bg-[#070D0A] text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#12231A] border border-[#1E3A2B] flex items-center justify-center font-black text-[#00E575] text-xs">
              KFC
            </div>
            <span className="font-display font-extrabold text-white text-lg tracking-wider">
              KAMIL <span className="text-[#00E575]">FC</span>
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Pakistan&apos;s Multi-Sport & Stadium Management Operating System. Built for ground reality: floodlight changeovers, atomic database slot holds, and pitch-side PIN check-in.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#00E575] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#00E575]" />
            Operating in Karachi, Lahore & Islamabad
          </div>
        </div>

        {/* Sports Varieties */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
            Sports & Pitches
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="hover:text-neon-green transition-colors cursor-pointer">
              • 11-a-Side Full Football Stadiums
            </li>
            <li className="hover:text-neon-green transition-colors cursor-pointer">
              • 7-a-Side & 5-a-Side Futsal Cages
            </li>
            <li className="hover:text-neon-yellow transition-colors cursor-pointer">
              • World Padel Tour Glass Courts
            </li>
            <li className="hover:text-neon-orange transition-colors cursor-pointer">
              • Tape-ball & Hard-ball Cricket Nets
            </li>
            <li className="hover:text-neon-cyan transition-colors cursor-pointer">
              • Wooden Badminton & Running Tracks
            </li>
          </ul>
        </div>

        {/* Cities */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
            Locations
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-1.5 hover:text-white">
              <MapPin className="w-3.5 h-3.5 text-neon-green" />
              Karachi (DHA Phase 6, Clifton, KDA)
            </li>
            <li className="flex items-center gap-1.5 hover:text-white">
              <MapPin className="w-3.5 h-3.5 text-neon-yellow" />
              Lahore (Gulberg, DHA Phase 5, Model Town)
            </li>
            <li className="flex items-center gap-1.5 hover:text-white">
              <MapPin className="w-3.5 h-3.5 text-neon-cyan" />
              Islamabad (F-7, Blue Area, E-11)
            </li>
            <li className="flex items-center gap-1.5 hover:text-white">
              <MapPin className="w-3.5 h-3.5 text-neon-purple" />
              Rawalpindi (Bahria Town, Saddar)
            </li>
          </ul>
        </div>

        {/* Local Payment & Support */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
            Local Payments & Support
          </h4>
          <div className="space-y-2 text-xs">
            <p className="text-gray-400">
              Supports State Bank Raast P2P QR, JazzCash, EasyPaisa, and Cash on Arrival.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2 py-1 rounded bg-dark-card border border-dark-border text-[11px] font-semibold text-white">
                Raast Instant
              </span>
              <span className="px-2 py-1 rounded bg-dark-card border border-dark-border text-[11px] font-semibold text-red-400">
                JazzCash
              </span>
              <span className="px-2 py-1 rounded bg-dark-card border border-dark-border text-[11px] font-semibold text-green-400">
                EasyPaisa
              </span>
            </div>
            <div className="pt-2">
              <Link 
                href="/caretaker"
                className="text-xs text-neon-cyan hover:underline flex items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" /> Caretaker / Ground Staff Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#141E30] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <p>© 2026 Kamil Football Club (KFC). Built for Pakistani Sports Culture.</p>
        <p className="flex items-center gap-1 text-neon-green">
          <Sparkles className="w-3.5 h-3.5" /> Zero Double-Bookings Guarantee
        </p>
      </div>
    </footer>
  );
}

