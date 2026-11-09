"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trophy, Calendar, MapPin, Users, Award, ShieldAlert, ArrowRight, Check, Eye, X, QrCode } from "lucide-react";
import { formatPKR } from "@/lib/utils";

interface TournamentItem {
  id: string;
  title: string;
  sport: string;
  city: string;
  venueName: string;
  startDate: string;
  entryFee: number;
  prizePool: number;
  teamsCount: string;
  featuredImg: string;
  format: string;
}

const TOURNAMENTS: TournamentItem[] = [
  {
    id: "tourney-khi-11",
    title: "Karachi Champions Cup (11-a-Side)",
    sport: "11-a-Side Football",
    city: "Karachi",
    venueName: "Kamil FC Mega Sports Complex, DHA 6",
    startDate: "Nov 20 - 24, 2026",
    entryFee: 15000,
    prizePool: 300000,
    teamsCount: "16 Teams Knockout",
    featuredImg: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
    format: "FIFA Rules • 90 Mins • Professional Referees",
  },
  {
    id: "tourney-padel-isb",
    title: "Capital Padel Masters (Category B & Open)",
    sport: "Padel Tennis",
    city: "Islamabad",
    venueName: "Capital Padel & Badminton Club, F-7",
    startDate: "Dec 02 - 04, 2026",
    entryFee: 8000,
    prizePool: 150000,
    teamsCount: "32 Pairs Double-Elimination",
    featuredImg: "https://images.unsplash.com/photo-1626248801379-51a0748a5f96?auto=format&fit=crop&w=800&q=80",
    format: "WPT Scoring • Dunlop Balls Provided",
  },
  {
    id: "tourney-tapeball-lhr",
    title: "Lahore Midnight Tapeball Super League",
    sport: "Tapeball Cricket",
    city: "Lahore",
    venueName: "Legends Sports Arena, Gulberg",
    startDate: "Nov 28 - 29, 2026",
    entryFee: 6000,
    prizePool: 120000,
    teamsCount: "24 Teams Group + Knockout",
    featuredImg: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
    format: "6 Overs • Floodlight Matches • Speed Radar",
  },
];

export default function TournamentSection() {
  const [activeTourneyForReg, setActiveTourneyForReg] = useState<TournamentItem | null>(null);
  const [registeredSquads, setRegisteredSquads] = useState<Record<string, boolean>>({});

  // Registration Form State
  const [teamName, setTeamName] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [captainPhone, setCaptainPhone] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);

  const handleOpenRegistration = (t: TournamentItem) => {
    setActiveTourneyForReg(t);
    setRegSuccess(false);
  };

  const handleConfirmRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !captainName.trim() || !captainPhone.trim()) {
      alert("Please fill out all team credentials.");
      return;
    }
    if (activeTourneyForReg) {
      setRegisteredSquads({ ...registeredSquads, [activeTourneyForReg.id]: true });
      setRegSuccess(true);
    }
  };

  return (
    <section id="tournaments" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-neon-yellow text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-4 h-4" />
              Official KFC Tournament Ecosystem
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
              Active Tournaments & Cups
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
              Cryptographically randomized brackets, verified cash prize pools, and live match scoring across Pakistan.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-yellow animate-ping" />
            <span>Registration Open for 3 Cups</span>
          </div>
        </div>

        {/* Tournament Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOURNAMENTS.map((t) => {
            const isRegistered = registeredSquads[t.id];
            return (
              <div
                key={t.id}
                className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-neon-yellow/60 transition-all flex flex-col group hover:shadow-neon-yellow/10 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden bg-dark-elevated">
                  <img
                    src={t.featuredImg}
                    alt={t.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D131F] via-[#0D131F]/30 to-transparent" />
                  
                  {/* Sport Pill */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-dark/80 backdrop-blur-md text-neon-yellow border border-neon-yellow/40">
                    {t.sport}
                  </div>

                  {/* Prize Badge */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-neon-yellow text-dark text-xs font-extrabold shadow-lg">
                    Prize: {formatPKR(t.prizePool)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-neon-yellow transition-colors font-display">
                      {t.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-neon-yellow" />
                      <span>{t.venueName}</span>
                    </div>

                    <div className="mt-4 bg-dark-elevated p-3 rounded-xl border border-dark-border space-y-1.5 text-xs">
                      <div className="flex justify-between text-gray-300">
                        <span>Dates:</span>
                        <strong className="text-white">{t.startDate}</strong>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Teams:</span>
                        <strong className="text-white">{t.teamsCount}</strong>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Format:</span>
                        <span className="text-gray-400 text-[11px] truncate max-w-[150px]">{t.format}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-dark-border space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Entry Fee / Team</span>
                        <span className="text-sm font-extrabold text-white">
                          {formatPKR(t.entryFee)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleOpenRegistration(t)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                          isRegistered
                            ? "bg-neon-yellow text-dark font-extrabold shadow-md"
                            : "bg-dark-elevated text-neon-yellow border border-neon-yellow/40 hover:bg-neon-yellow hover:text-dark"
                        }`}
                      >
                        {isRegistered ? <><Check className="w-3.5 h-3.5" /> Registered</> : "Register Squad"}
                      </button>
                    </div>

                    <Link
                      href={`/tournament/${t.id}`}
                      className="w-full py-2 rounded-xl bg-dark text-gray-300 hover:text-white hover:bg-dark-elevated border border-dark-border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-neon-green" />
                      View Live Knockout Bracket Tree
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SQUAD REGISTRATION MODAL */}
      {activeTourneyForReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0D131F] border border-dark-border rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl relative">
            <button
              onClick={() => setActiveTourneyForReg(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-dark-elevated text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {!regSuccess ? (
              <form onSubmit={handleConfirmRegistration} className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neon-yellow tracking-wider">
                    Official Squad Registration
                  </span>
                  <h3 className="text-base font-bold text-white font-display mt-0.5">
                    {activeTourneyForReg.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Entry Fee: <strong className="text-neon-green">{formatPKR(activeTourneyForReg.entryFee)}</strong> • {activeTourneyForReg.venueName}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-300 block mb-1">
                      Team / Squad Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Clifton Strikers FC"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-dark border border-dark-border text-white text-xs focus:outline-none focus:border-neon-yellow"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-300 block mb-1">
                      Captain Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Daniyal Ahmed"
                      value={captainName}
                      onChange={(e) => setCaptainName(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-dark border border-dark-border text-white text-xs focus:outline-none focus:border-neon-yellow"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-300 block mb-1">
                      Captain WhatsApp Number (For Bracket Alerts)
                    </label>
                    <input
                      type="tel"
                      placeholder="0300-1234567"
                      value={captainPhone}
                      onChange={(e) => setCaptainPhone(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-dark border border-dark-border text-white text-xs focus:outline-none focus:border-neon-yellow"
                    />
                  </div>
                </div>

                <div className="bg-dark-elevated p-3 rounded-xl border border-dark-border text-[11px] text-gray-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Entry Fee:</span>
                    <strong className="text-neon-green">{formatPKR(activeTourneyForReg.entryFee)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Mode:</span>
                    <span>Raast Transfer / Cash at Ground</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-neon-yellow text-dark font-extrabold text-xs shadow-lg hover:bg-neon-yellow/90 transition-all flex items-center justify-center gap-1.5"
                >
                  <Trophy className="w-4 h-4" />
                  Confirm Squad Registration
                </button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/40 flex items-center justify-center mx-auto shadow-xl">
                  <Check className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white font-display">Squad Registered!</h4>
                  <p className="text-xs text-gray-300 mt-1">
                    Team <strong>{teamName}</strong> is officially entered in the knockout draw.
                  </p>
                  <p className="text-[11px] text-neon-yellow mt-1">
                    Fixture alerts will be sent to WhatsApp: {captainPhone}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/tournament/${activeTourneyForReg.id}`}
                    onClick={() => setActiveTourneyForReg(null)}
                    className="w-full py-2.5 rounded-xl bg-dark-elevated text-neon-green border border-neon-green/40 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    View Tournament Bracket Draw
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
