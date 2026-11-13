"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trophy, MapPin, Check, Eye, X } from "@phosphor-icons/react";
import { formatPKR } from "@/lib/utils";
import { Card, Button, Badge, Input } from "@/components/ui";

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

export const TOURNAMENTS: TournamentItem[] = [
  {
    id: "tourney-khi-11",
    title: "Karachi United Floodlit Cup (11-a-Side)",
    sport: "11-a-Side Football",
    city: "Karachi",
    venueName: "Karachi United Football Stadium, Clifton Scheme 5",
    startDate: "Nov 20 - 24, 2026",
    entryFee: 15000,
    prizePool: 300000,
    teamsCount: "16 Teams Knockout",
    featuredImg: "/images/grounds/football-11.jpg",
    format: "FIFA Rules • 90 Mins • PFF Referees",
  },
  {
    id: "tourney-padel-isb",
    title: "Islamabad Open Padel Series (Gulberg Greens)",
    sport: "Padel Tennis",
    city: "Islamabad",
    venueName: "Padel Zone, Block B, Gulberg Greens",
    startDate: "Dec 02 - 04, 2026",
    entryFee: 8000,
    prizePool: 150000,
    teamsCount: "32 Pairs Double-Elimination",
    featuredImg: "/images/grounds/padel.jpg",
    format: "WPT Scoring • Floodlit Panoramic Courts",
  },
  {
    id: "tourney-tapeball-lhr",
    title: "Lahore All-City Badminton & Table Tennis Open",
    sport: "Table Tennis & Badminton",
    city: "Lahore",
    venueName: "Nishtar Park Sports Complex (Punjab Stadium), Ferozepur Rd",
    startDate: "Nov 28 - 29, 2026",
    entryFee: 3500,
    prizePool: 120000,
    teamsCount: "32 Singles & Doubles Draw",
    featuredImg: "/images/grounds/table-tennis.jpg",
    format: "ITTF 11-Point Sets • SBP Indoor Hall",
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
  const [regError, setRegError] = useState<string | null>(null);

  const handleOpenRegistration = (t: TournamentItem) => {
    setActiveTourneyForReg(t);
    setRegSuccess(false);
    setRegError(null);
  };

  const handleConfirmRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !captainName.trim() || !captainPhone.trim()) {
      setRegError("Please fill out all team credentials.");
      return;
    }
    setRegError(null);
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
            <div className="flex items-center gap-2 text-[#176B3A] text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-[#C8A838]" weight="duotone" />
              Official KFC Tournament Ecosystem
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0E2A20] font-display mt-1">
              Active Tournaments &amp; Cups
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6B64] mt-1 max-w-xl">
              Cryptographically randomized brackets, verified cash prize pools, and live match scoring across Pakistan.
            </p>
          </div>
          <Badge tone="gold" className="self-start sm:self-auto py-1.5 px-3">
            <span className="w-2 h-2 rounded-full bg-[#176B3A] animate-pulse" />
            <span>Registration Open for 3 Cups</span>
          </Badge>
        </div>

        {/* Tournament Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOURNAMENTS.map((t) => {
            const isRegistered = registeredSquads[t.id];
            return (
              <Card
                key={t.id}
                interactive
                className="overflow-hidden flex flex-col group"
              >
                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden bg-[#EAEDEA]">
                  <img
                    src={t.featuredImg}
                    alt={t.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/grounds/football-11.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E2A20]/80 via-[#0E2A20]/20 to-transparent" />

                  {/* Sport Pill */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-[#0E2A20]/90 backdrop-blur-md text-[#C8A838] border border-[#C8A838]/40">
                    {t.sport}
                  </div>

                  {/* Prize Badge */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-[#C8A838] text-[#0E2A20] text-xs font-display font-extrabold shadow-md">
                    Prize: {formatPKR(t.prizePool)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-[#0E2A20] group-hover:text-[#176B3A] transition-colors font-display">
                      {t.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#5C6B64] mt-1">
                      <MapPin className="w-4 h-4 text-[#176B3A] shrink-0" weight="duotone" />
                      <span className="line-clamp-1">{t.venueName}</span>
                    </div>

                    <div className="mt-4 bg-[#F4F5F3] p-3 rounded-xl border border-[#E6E7E5] space-y-1.5 text-xs">
                      <div className="flex justify-between text-[#5C6B64]">
                        <span>Dates:</span>
                        <strong className="text-[#0E2A20]">{t.startDate}</strong>
                      </div>
                      <div className="flex justify-between text-[#5C6B64]">
                        <span>Teams:</span>
                        <strong className="text-[#0E2A20]">{t.teamsCount}</strong>
                      </div>
                      <div className="flex justify-between text-[#5C6B64]">
                        <span>Format:</span>
                        <span className="text-[#0E2A20] font-medium text-[11px] truncate max-w-[160px]">{t.format}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-[#E6E7E5] space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#5C6B64] font-semibold uppercase tracking-wider block">
                          Entry Fee / Team
                        </span>
                        <span className="text-sm font-display font-extrabold text-[#0E2A20]">
                          {formatPKR(t.entryFee)}
                        </span>
                      </div>

                      <Button
                        size="sm"
                        variant={isRegistered ? "gold" : "secondary"}
                        onClick={() => handleOpenRegistration(t)}
                      >
                        {isRegistered ? (
                          <>
                            <Check className="w-3.5 h-3.5" weight="bold" /> Registered
                          </>
                        ) : (
                          "Register Squad"
                        )}
                      </Button>
                    </div>

                    <Link
                      href={`/tournament/${t.id}`}
                      className="w-full py-2 rounded-xl bg-[#F4F5F3] text-[#0E2A20] hover:bg-[#EAEDEA] border border-[#E6E7E5] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Eye className="w-4 h-4 text-[#176B3A]" weight="duotone" />
                      View Live Knockout Bracket Tree
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* SQUAD REGISTRATION MODAL */}
      {activeTourneyForReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2A20]/60 backdrop-blur-sm">
          <div className="bg-white border border-[#E6E7E5] rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl relative">
            <button
              onClick={() => setActiveTourneyForReg(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#F4F5F3] text-[#5C6B64] hover:text-[#0E2A20] cursor-pointer"
            >
              <X className="w-4 h-4" weight="bold" />
            </button>

            {!regSuccess ? (
              <form onSubmit={handleConfirmRegistration} className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#176B3A] tracking-wider">
                    Official Squad Registration
                  </span>
                  <h3 className="text-base font-bold text-[#0E2A20] font-display mt-0.5">
                    {activeTourneyForReg.title}
                  </h3>
                  <p className="text-xs text-[#5C6B64] mt-0.5">
                    Entry Fee: <strong className="text-[#176B3A]">{formatPKR(activeTourneyForReg.entryFee)}</strong> • {activeTourneyForReg.venueName}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#0E2A20] block mb-1">
                      Team / Squad Name
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Clifton Strikers FC"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#0E2A20] block mb-1">
                      Captain Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Daniyal Ahmed"
                      value={captainName}
                      onChange={(e) => setCaptainName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#0E2A20] block mb-1">
                      Captain WhatsApp Number (For Bracket Alerts)
                    </label>
                    <Input
                      type="tel"
                      placeholder="0300-1234567"
                      value={captainPhone}
                      onChange={(e) => setCaptainPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="bg-[#F4F5F3] p-3 rounded-xl border border-[#E6E7E5] text-[11px] text-[#5C6B64] space-y-1">
                  <div className="flex justify-between">
                    <span>Entry Fee:</span>
                    <strong className="text-[#176B3A]">{formatPKR(activeTourneyForReg.entryFee)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Mode:</span>
                    <span className="text-[#0E2A20] font-medium">Raast Transfer / Cash at Ground</span>
                  </div>
                </div>

                {regError && (
                  <p className="text-xs text-[#E94A10] bg-[#E94A10]/10 border border-[#E94A10]/25 px-3 py-2 rounded-lg">
                    {regError}
                  </p>
                )}

                <Button type="submit" variant="primary" size="lg" className="w-full">
                  <Trophy className="w-4 h-4" weight="duotone" />
                  Confirm Squad Registration
                </Button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#176B3A]/10 text-[#176B3A] border border-[#176B3A]/30 flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" weight="bold" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#0E2A20] font-display">Squad Registered!</h4>
                  <p className="text-xs text-[#5C6B64] mt-1">
                    Team <strong className="text-[#0E2A20]">{teamName}</strong> is officially entered in the knockout draw.
                  </p>
                  <p className="text-[11px] text-[#176B3A] font-semibold mt-1">
                    Fixture alerts will be sent to WhatsApp: {captainPhone}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/tournament/${activeTourneyForReg.id}`}
                    onClick={() => setActiveTourneyForReg(null)}
                    className="w-full py-2.5 rounded-xl bg-[#0E2A20] text-[#C8A838] text-xs font-display font-bold flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" weight="duotone" />
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
