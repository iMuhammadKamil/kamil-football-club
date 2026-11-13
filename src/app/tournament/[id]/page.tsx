"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Trophy,
  ShieldCheck,
  ShareNetwork as Share2,
  ArrowLeft,
  MapPin,
  Fire as Flame,
  Medal as Award,
  ChatCircle as MessageCircle,
} from "@phosphor-icons/react";
import { generateRandomBracket } from "@/lib/tournamentEngine";
import { formatPKR } from "@/lib/utils";
import { TOURNAMENTS } from "@/components/TournamentSection";

const DEFAULT_TEAMS = [
  "Karachi Strikers",
  "DHA Titans",
  "Gulberg Galacticos",
  "Islamabad United Futsal",
  "Clifton FC",
  "Model Town Warriors",
  "Rawalpindi Panthers",
  "F-7 All-Stars",
  "Korangi United",
  "Johar Town Lions",
  "Bahria Blitz",
  "Defense United",
  "North Karachi FC",
  "Cantt Cavaliers",
  "Margalla Mavericks",
  "Sindh Tigers",
];

export default function TournamentDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "tourney-khi-11";
  const tournamentMeta = TOURNAMENTS.find((t) => t.id === id) || TOURNAMENTS[0];

  const [bracket, setBracket] = useState(() =>
    generateRandomBracket(
      id,
      tournamentMeta.title,
      DEFAULT_TEAMS
    )
  );

  useEffect(() => {
    fetch("/api/tournament/score?matchId=QF-M1")
      .then((res) => res.json())
      .then((data) => {
        if (data.score) {
          setBracket((prev) => ({
            ...prev,
            matches: prev.matches.map((m) =>
              m.id === "QF-M1"
                ? {
                    ...m,
                    team1: {
                      ...m.team1,
                      score: data.score.scoreA,
                      isWinner: data.score.status === "COMPLETED" && data.score.scoreA > data.score.scoreB,
                    },
                    team2: {
                      ...m.team2,
                      score: data.score.scoreB,
                      isWinner: data.score.status === "COMPLETED" && data.score.scoreB > data.score.scoreA,
                    },
                  }
                : m
            ),
          }));
        }
      })
      .catch(() => {});
  }, []);

  const [copiedLink, setCopiedLink] = useState(false);

  const copyShareLink = () => {
    try {
      navigator.clipboard?.writeText(window.location.href);
    } catch {
      // ignore clipboard restrictions
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <main className="min-h-screen bg-[#090D10] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <Link href="/#tournaments" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Tournaments
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-neon-yellow/10 border border-neon-yellow/30 text-neon-yellow font-bold text-[10px]">
              {tournamentMeta.teamsCount}
            </span>
          </div>
        </div>

        {/* Tournament Hero Banner */}
        <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-neon-yellow/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-yellow/10 border border-neon-yellow/30 text-neon-yellow text-xs font-bold uppercase">
                <Trophy className="w-4 h-4" /> Official Knockout Draw
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
                {bracket.title}
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neon-yellow shrink-0" />
                {tournamentMeta.sport} • {tournamentMeta.venueName}
              </p>

              {/* Public Fair-Play Cryptographic Seal */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <div className="bg-dark-elevated px-3 py-1.5 rounded-xl border border-neon-green/40 flex items-center gap-2 text-xs text-neon-green">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Fair Play Draw: <strong>{bracket.verificationSeedHash}</strong></span>
                </div>
                <span className="text-[11px] text-gray-400">
                  Seeded cryptographically • Zero manual tampering
                </span>
              </div>
            </div>

            {/* Share CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `🏆 *Official Knockout Draw Released: ${bracket.title}*\n` +
                  `🏟️ Venue: ${tournamentMeta.venueName} (${tournamentMeta.sport})\n` +
                  `🔒 Verification Seed: ${bracket.verificationSeedHash}\n` +
                  `👀 View Live Bracket: ${typeof window !== "undefined" ? window.location.href : "https://kamilfc.pk/bracket"}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-emerald-500 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg hover:bg-emerald-400"
              >
                <MessageCircle className="w-4 h-4" />
                Share Bracket to WhatsApp
              </a>

              <button
                onClick={copyShareLink}
                className="px-4 py-3 rounded-xl bg-dark-elevated text-white border border-dark-border hover:border-gray-400 font-bold text-xs flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4 text-neon-cyan" />
                {copiedLink ? "Link Copied!" : "Copy Verification URL"}
              </button>
            </div>
          </div>
        </div>

        {/* Visual Knockout Bracket Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-dark-border pb-3">
            <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Flame className="w-5 h-5 text-neon-yellow" />
              Knockout Tournament Tree
            </h2>
            <span className="text-xs text-gray-400">
              Live Scores & Pitch Assignments
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Round of 16 */}
            <div className="space-y-3">
              <div className="bg-dark-card border border-dark-border py-2 px-3 rounded-xl text-xs font-bold text-gray-300 uppercase tracking-wider text-center">
                Round of 16 (8 Matches)
              </div>
              <div className="space-y-2.5">
                {bracket.matches.filter((m) => m.round === "ROUND_OF_16").slice(0, 4).map((m) => (
                  <div key={m.id} className="bg-dark-card border border-dark-border rounded-xl p-3 space-y-2 hover:border-neon-yellow/40 transition-all">
                    <div className="flex justify-between text-[10px] text-gray-400 border-b border-dark-border/60 pb-1">
                      <span>{m.id}</span>
                      <span className="text-neon-cyan">{m.timeSlot}</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className={`flex justify-between items-center ${m.team1.isWinner ? "font-bold text-neon-green" : "text-white"}`}>
                        <span>{m.team1.name}</span>
                        {m.team1.score !== undefined && <span className="font-mono">{m.team1.score}</span>}
                      </div>
                      <div className={`flex justify-between items-center ${m.team2.isWinner ? "font-bold text-neon-green" : "text-gray-400"}`}>
                        <span>{m.team2.name}</span>
                        {m.team2.score !== undefined && <span className="font-mono">{m.team2.score}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quarter Finals */}
            <div className="space-y-3">
              <div className="bg-dark-card border border-dark-border py-2 px-3 rounded-xl text-xs font-bold text-neon-yellow uppercase tracking-wider text-center">
                Quarter Finals
              </div>
              <div className="space-y-2.5">
                {bracket.matches.filter((m) => m.round === "QUARTERS").map((m) => (
                  <div key={m.id} className="bg-dark-card border-2 border-neon-yellow/40 rounded-xl p-3.5 space-y-2 shadow-lg">
                    <div className="flex justify-between text-[10px] text-gray-400 border-b border-dark-border/60 pb-1">
                      <span className="font-bold text-neon-yellow">{m.id}</span>
                      <span>{m.timeSlot}</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className={`flex justify-between items-center ${m.team1.isWinner ? "font-bold text-neon-green" : "text-white"}`}>
                        <span>{m.team1.name}</span>
                        {m.team1.score !== undefined && <span className="font-mono text-neon-green font-bold">{m.team1.score}</span>}
                      </div>
                      <div className={`flex justify-between items-center ${m.team2.isWinner ? "font-bold text-neon-green" : "text-gray-400"}`}>
                        <span>{m.team2.name}</span>
                        {m.team2.score !== undefined && <span className="font-mono font-bold">{m.team2.score}</span>}
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-400 pt-1 border-t border-dark-border/60">
                      Pitch: {m.pitchName}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Semi Finals & Grand Final */}
            <div className="space-y-3">
              <div className="bg-dark-card border border-dark-border py-2 px-3 rounded-xl text-xs font-bold text-neon-green uppercase tracking-wider text-center">
                Grand Final (Prize: {formatPKR(tournamentMeta.prizePool)})
              </div>
              <div className="space-y-3">
                {bracket.matches.filter((m) => m.round === "FINAL").map((m) => (
                  <div key={m.id} className="bg-dark-card border-2 border-neon-green p-4 rounded-2xl space-y-3 glow-neon-green">
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-neon-green uppercase">
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4" /> Championship Final
                      </span>
                      <span>{tournamentMeta.startDate}</span>
                    </div>
                    <div className="bg-dark p-3 rounded-xl border border-dark-border space-y-2 text-xs">
                      <div className="flex justify-between text-white font-bold">
                        <span>{bracket.matches[0]?.team1?.name || "Winner Semi-Final 1"}</span>
                        <span className="text-neon-yellow">Finalist 1</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Winner Semi-Final 2</span>
                        <span className="text-gray-500">TBD</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-gray-300 text-center font-medium">
                      Live commentary & trophy ceremony under floodlights
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

