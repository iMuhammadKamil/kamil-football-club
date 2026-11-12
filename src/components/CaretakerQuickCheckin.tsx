"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Phone, 
  Clock, 
  MapPin, 
  Banknote,
  Search,
  Lock,
  PlusCircle,
  Users,
  Zap,
  FileText,
  X,
  CloudRain,
  ShieldAlert,
  Plus,
  Send,
  Trophy,
  Award,
  Bell,
  RefreshCw
} from "lucide-react";
import { formatPKR } from "@/lib/utils";

interface StoredBookingItem {
  pinCode: string;
  id: string;
  captainName: string;
  captainPhone: string;
  pitchName: string;
  slotTime: string;
  totalAmount: number;
  cashDue: number;
  checkInStatus: string;
  isExtended?: boolean;
}

export default function CaretakerQuickCheckin() {
  const [pinInput, setPinInput] = useState<string>("");
  const [searchedBooking, setSearchedBooking] = useState<StoredBookingItem | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Generator surcharge toggle
  const [generatorActive, setGeneratorActive] = useState<boolean>(false);

  // Walk-in modal state
  const [walkInModalOpen, setWalkInModalOpen] = useState<boolean>(false);
  const [walkInPhone, setWalkInPhone] = useState<string>("");
  const [walkInAmount, setWalkInAmount] = useState<number>(4500);
  const [walkInPitch, setWalkInPitch] = useState<string>("The Cage Alpha (7-a-Side)");
  const [walkInError, setWalkInError] = useState<string | null>(null);

  // Caretaker Live Tournament Score Keeper
  const [scoreTeamA, setScoreTeamA] = useState<number>(2);
  const [scoreTeamB, setScoreTeamB] = useState<number>(1);

  // Live bookings from server
  const [activeBookings, setActiveBookings] = useState<StoredBookingItem[]>([]);

  // Fetch real server bookings & live score on mount
  const fetchLiveBookings = async () => {
    try {
      const [verifyRes, scoreRes] = await Promise.all([
        fetch("/api/caretaker/verify"),
        fetch("/api/tournament/score?matchId=QF-M1"),
      ]);
      const data = await verifyRes.json();
      if (data.bookings) {
        setActiveBookings(data.bookings);
      }
      const scoreData = await scoreRes.json();
      if (scoreData.score) {
        setScoreTeamA(scoreData.score.scoreA);
        setScoreTeamB(scoreData.score.scoreB);
      }
    } catch {
      console.warn("Could not fetch server bookings");
    }
  };

  useEffect(() => {
    fetchLiveBookings();
  }, []);

  const handleNumClick = (num: string) => {
    if (pinInput.length < 4) {
      setPinInput((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
  };

  // LOOKUP PIN VIA SERVER API
  const handleVerifyPin = async () => {
    setSearchError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/caretaker/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "VERIFY_PIN", pinCode: pinInput }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSearchError(data.error || `No booking found with PIN ${pinInput}.`);
        setSearchedBooking(null);
      } else {
        setSearchedBooking(data.booking);
      }
    } catch {
      setSearchError("Failed to communicate with verification server.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCheckin = async () => {
    if (!searchedBooking) return;
    setLoading(true);
    setSearchError(null);
    try {
      const res = await fetch("/api/caretaker/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CONFIRM_CHECKIN", pinCode: searchedBooking.pinCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSearchError(data.error || "Check-in failed.");
      } else {
        setSearchedBooking(data.booking);
        setSuccessMessage(`✓ Check-In Confirmed for ${data.booking.captainName}! Cash received logged in owner audit trail.`);
        fetchLiveBookings();
      }
    } catch {
      setSearchError("Failed to confirm check-in on server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async (booking: StoredBookingItem) => {
    try {
      const res = await fetch("/api/bookings/remind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          captainName: booking.captainName,
          captainPhone: booking.captainPhone,
          venueName: "POPO FC Ground (F-11/2 Islamabad)",
          pitchName: booking.pitchName,
          slotTime: booking.slotTime,
          pinCode: booking.pinCode,
          remainingAmount: booking.cashDue,
        }),
      });
      const data = await res.json();
      setSuccessMessage(data.message || `Automated 2-Hour WhatsApp Reminder sent to ${booking.captainName}!`);
    } catch {
      setSearchError("Failed to dispatch WhatsApp reminder.");
    }
  };

  const handleExtendSlot = async (booking: StoredBookingItem) => {
    try {
      const res = await fetch("/api/caretaker/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "EXTEND_SLOT_30M",
          pitchBaseRate: 6000,
          isSurgeActive: true,
        }),
      });
      const data = await res.json();
      const extensionFee = data.additionalAmount || 3600;
      if (searchedBooking && searchedBooking.id === booking.id) {
        setSearchedBooking({
          ...searchedBooking,
          totalAmount: searchedBooking.totalAmount + extensionFee,
          cashDue: searchedBooking.cashDue + extensionFee,
          isExtended: true,
        });
      }
      setSuccessMessage(data.message || `Match extended +30 mins (+Rs. ${extensionFee}).`);
    } catch {
      setSearchError("Failed to extend slot.");
    }
  };

  const handleRejectFootwear = async (booking: StoredBookingItem) => {
    try {
      const res = await fetch("/api/caretaker/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REJECT_ILLEGAL_FOOTWEAR",
          bookingId: booking.id,
          captainPhone: booking.captainPhone,
        }),
      });
      const data = await res.json();
      setSuccessMessage(data.message || `Violation Logged for ${booking.captainName}.`);
    } catch {
      setSearchError("Failed to log footwear rejection.");
    }
  };

  const handleIssueWeatherVoucher = async (booking: StoredBookingItem) => {
    try {
      const res = await fetch("/api/caretaker/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ISSUE_WEATHER_VOUCHER",
          bookingId: booking.id,
          captainName: booking.captainName,
          captainPhone: booking.captainPhone,
          venueName: "POPO FC Ground (F-11/2 Islamabad)",
          originalAmount: booking.totalAmount,
        }),
      });
      const data = await res.json();
      setSuccessMessage(
        data.message || `Weather voucher ${data.voucherCode} generated for ${booking.captainName}.`
      );
    } catch {
      setSearchError("Failed to generate weather voucher.");
    }
  };

  const handleUpdateScore = async (nextA: number, nextB: number, isFinal = false) => {
    setScoreTeamA(nextA);
    setScoreTeamB(nextB);
    try {
      const res = await fetch("/api/tournament/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: "QF-M1",
          scoreA: nextA,
          scoreB: nextB,
          isFinal,
        }),
      });
      const data = await res.json();
      if (isFinal && data.success) {
        setSuccessMessage(data.message || "Match score finalized & bracket updated.");
      }
    } catch {
      setSearchError("Failed to sync score with tournament bracket.");
    }
  };

  const handleConfirmWalkIn = async () => {
    if (!walkInPhone || walkInPhone.trim().length < 10) {
      setWalkInError("Anti-Theft Requirement: Enter an active 11-digit customer mobile number.");
      return;
    }
    setWalkInError(null);

    try {
      const res = await fetch("/api/caretaker/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "BLOCK_WALK_IN",
          customerPhone: walkInPhone,
          amountCollected: walkInAmount + (generatorActive ? 1500 : 0),
          pitchId: walkInPitch,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setWalkInError(data.error || "Failed to log walk-in.");
        return;
      }
      setWalkInModalOpen(false);
      setWalkInPhone("");
      setSuccessMessage(`Walk-In Confirmed! PIN: ${data.pinCode}. Automated receipt logged for venue owner.`);
      fetchLiveBookings();
    } catch {
      setWalkInError("Could not reach server to record walk-in.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-5">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-dark-border">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Site
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchLiveBookings}
            title="Refresh Live Bookings"
            className="p-1 rounded-lg bg-dark-card border border-dark-border text-gray-400 hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <Link
            href="/caretaker/handover"
            className="px-2.5 py-1 rounded-full bg-neon-yellow/10 border border-neon-yellow/30 text-neon-yellow text-xs font-bold flex items-center gap-1"
          >
            <Clock className="w-3.5 h-3.5" /> Shift Handover
          </Link>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-bold">
            <ShieldCheck className="w-4 h-4" /> Field Mode
          </div>
        </div>
      </div>

      {/* Ground Header & Pilot Badge */}
      <div className="bg-dark-card p-4 rounded-2xl border border-dark-border space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-neon-green tracking-wider">
                Active Ground Gate
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-neon-green/20 text-neon-green border border-neon-green/30">
                Islamabad F-11/2
              </span>
            </div>
            <h2 className="text-sm font-bold text-white mt-0.5">
              POPO FC Ground (F-11/2)
            </h2>
            <p className="text-[11px] text-gray-400">78 Street 24, Sector F-11/2, Islamabad</p>
          </div>
          <button
            onClick={() => setWalkInModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-neon-orange/20 border border-neon-orange/40 text-neon-orange text-[11px] font-bold hover:bg-neon-orange hover:text-dark transition-all flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Walk-In
          </button>
        </div>

        {/* Load Shedding / Diesel Generator Toggle */}
        <div className="pt-2 border-t border-dark-border/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${generatorActive ? "text-neon-yellow animate-bounce" : "text-gray-500"}`} />
            <div>
              <span className="font-bold text-white block">200kVA Heavy Generator</span>
              <span className="text-[10px] text-gray-400">
                {generatorActive ? "ACTIVE (+Rs. 1,500 fuel surcharge applied)" : "Grid Power (No surcharge)"}
              </span>
            </div>
          </div>
          <button
            onClick={() => setGeneratorActive(!generatorActive)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
              generatorActive
                ? "bg-neon-yellow text-dark border-neon-yellow"
                : "bg-dark-elevated text-gray-400 border-dark-border hover:text-white"
            }`}
          >
            {generatorActive ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Caretaker Live Tournament Score Keeper */}
      <div className="bg-dark-card border-2 border-neon-yellow/50 p-4 rounded-2xl space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neon-yellow uppercase tracking-wider">
            <Trophy className="w-4 h-4" /> Live Score Keeper (Court-side)
          </div>
          <span className="w-2 h-2 rounded-full bg-neon-yellow animate-ping" />
        </div>

        <div className="bg-dark p-3 rounded-xl border border-dark-border flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="text-xs font-bold text-white">Karachi Strikers</div>
            <div className="text-2xl font-mono font-extrabold text-neon-green mt-1">{scoreTeamA}</div>
            <button
              onClick={() => handleUpdateScore(scoreTeamA + 1, scoreTeamB)}
              className="mt-1 px-2.5 py-1 rounded-lg bg-neon-green/20 text-neon-green text-[10px] font-bold border border-neon-green/40 hover:bg-neon-green hover:text-dark"
            >
              +1 Goal
            </button>
          </div>

          <div className="text-xs font-bold text-gray-400 px-2">VS</div>

          <div className="text-center flex-1">
            <div className="text-xs font-bold text-white">DHA Titans</div>
            <div className="text-2xl font-mono font-extrabold text-neon-cyan mt-1">{scoreTeamB}</div>
            <button
              onClick={() => handleUpdateScore(scoreTeamA, scoreTeamB + 1)}
              className="mt-1 px-2.5 py-1 rounded-lg bg-neon-cyan/20 text-neon-cyan text-[10px] font-bold border border-neon-cyan/40 hover:bg-neon-cyan hover:text-dark"
            >
              +1 Goal
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-gray-400">
          <span>Match: QF-M1 • Main Stadium</span>
          <button
            onClick={() => handleUpdateScore(scoreTeamA, scoreTeamB, true)}
            className="text-neon-yellow font-bold hover:underline"
          >
            End Match & Update Bracket
          </button>
        </div>
      </div>

      {/* 4-Digit PIN Keypad Box */}
      <div className="bg-dark-card border-2 border-dark-border focus-within:border-neon-cyan p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="text-center">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
            Enter Team 4-Digit PIN Code
          </label>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Ask the captain for the 4-digit code shown in their app or WhatsApp
          </p>
        </div>

        {/* PIN Display */}
        <div className="flex justify-center gap-3">
          {[0, 1, 2, 3].map((idx) => {
            const digit = pinInput[idx] || "";
            return (
              <div
                key={idx}
                className={`w-12 h-14 rounded-xl border flex items-center justify-center text-2xl font-mono font-extrabold transition-all ${
                  digit
                    ? "bg-dark-elevated border-neon-cyan text-neon-cyan shadow-neon-cyan/20 shadow-md"
                    : "bg-dark border-dark-border text-gray-500"
                }`}
              >
                {digit || "•"}
              </div>
            );
          })}
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "OK"].map((key) => {
            if (key === "C") {
              return (
                <button
                  key={key}
                  onClick={handleBackspace}
                  className="py-3 rounded-xl bg-dark-elevated text-gray-400 hover:text-white font-bold text-sm border border-dark-border active:scale-95"
                >
                  Clear
                </button>
              );
            }
            if (key === "OK") {
              return (
                <button
                  key={key}
                  onClick={handleVerifyPin}
                  disabled={pinInput.length !== 4 || loading}
                  className="py-3 rounded-xl bg-neon-cyan text-dark font-extrabold text-sm disabled:opacity-40 shadow-neon-cyan/20 shadow-md active:scale-95"
                >
                  {loading ? "..." : "Verify"}
                </button>
              );
            }
            return (
              <button
                key={key}
                onClick={() => handleNumClick(key)}
                className="py-3 rounded-xl bg-dark-elevated text-white font-mono font-bold text-lg border border-dark-border hover:border-gray-500 active:scale-95"
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Result or Error */}
      {searchError && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{searchError}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-neon-green/40 text-neon-green text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-neon-green" />
          <span>{successMessage}</span>
        </div>
      )}

      {searchedBooking && (
        <div className="bg-dark-card border-2 border-neon-green p-4 rounded-2xl space-y-4 animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-neon-green text-dark uppercase">
              Valid Booking Verified
            </span>
            <span className="text-xs font-mono text-gray-400">
              PIN: #{searchedBooking.pinCode}
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white font-display">
              {searchedBooking.captainName}
            </h3>
            <p className="text-xs text-gray-300 flex items-center gap-1 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-neon-green" />
              {searchedBooking.captainPhone}
            </p>
          </div>

          <div className="bg-dark p-3 rounded-xl border border-dark-border space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-300">
              <span>Pitch:</span>
              <strong className="text-white">{searchedBooking.pitchName}</strong>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Time Slot:</span>
              <strong className="text-neon-cyan">{searchedBooking.slotTime}</strong>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Total Bill:</span>
              <strong className="text-white">{formatPKR(searchedBooking.totalAmount)}</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-dark-border font-bold">
              <span className="text-gray-300">Cash Due at Pitch:</span>
              <span className={searchedBooking.cashDue > 0 ? "text-neon-yellow" : "text-neon-green"}>
                {searchedBooking.cashDue > 0 ? formatPKR(searchedBooking.cashDue) : "Fully Settled (Rs. 0)"}
              </span>
            </div>
          </div>

          {/* Operational Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-dark-border">
            <button
              onClick={() => handleExtendSlot(searchedBooking)}
              className="p-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-bold hover:bg-neon-cyan hover:text-dark transition-all flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Extend +30m
            </button>
            <button
              onClick={() => handleRejectFootwear(searchedBooking)}
              className="p-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Reject Metal Studs
            </button>
          </div>

          {searchedBooking.checkInStatus === "CHECKED_IN" ? (
            <div className="w-full py-3 rounded-xl bg-emerald-950/60 border border-neon-green/40 text-neon-green text-center text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Team Checked-In & Playing
            </div>
          ) : (
            <button
              onClick={handleConfirmCheckin}
              className="w-full py-3.5 rounded-xl bg-neon-green text-dark font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 glow-neon-green active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm Check-In {searchedBooking.cashDue > 0 && `& Collect ${formatPKR(searchedBooking.cashDue)}`}
            </button>
          )}
        </div>
      )}

      {/* Active Schedule Overview */}
      <div className="pt-2">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Tonight&apos;s Match Log (Live from Server)</span>
          <span className="text-[10px] text-neon-green font-bold">{activeBookings.length} Teams</span>
        </h4>
        <div className="space-y-2">
          {activeBookings.map((b) => (
            <div
              key={b.id}
              onClick={() => {
                setPinInput(b.pinCode);
                setSearchedBooking(b);
              }}
              className="p-3 rounded-xl bg-dark-card border border-dark-border hover:border-gray-500 cursor-pointer flex items-center justify-between text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{b.pitchName ? b.pitchName.split("(")[0] : "Pitch"}</span>
                  <span className="font-mono text-[10px] text-neon-green font-bold">PIN: {b.pinCode}</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  {b.slotTime} • {b.captainName}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {b.checkInStatus === "CHECKED_IN" ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-neon-green border border-neon-green/30">
                    Checked In
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                    Awaiting
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendReminder(b);
                  }}
                  title="Send 2-Hour WhatsApp Pre-Match Reminder"
                  className="p-1 rounded bg-dark-elevated text-neon-green hover:bg-neon-green hover:text-dark border border-dark-border"
                >
                  <Bell className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIssueWeatherVoucher(b);
                  }}
                  title="Rain / Smog Cancellation Voucher"
                  className="p-1 rounded bg-dark-elevated text-gray-400 hover:text-neon-cyan border border-dark-border"
                >
                  <CloudRain className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anti-Theft Walk-In Booking Modal */}
      {walkInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0C1611] border border-dark-border rounded-2xl p-5 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-neon-orange text-xs font-bold uppercase">
                <FileText className="w-4 h-4" />
                Anti-Theft Walk-In Logger
              </div>
              <button
                onClick={() => setWalkInModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-400">
              To prevent caretaker theft, walk-ins require a mandatory mobile number. An automated receipt is logged in the owner audit report.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">
                  Customer Mobile Number (Mandatory)
                </label>
                <input
                  type="tel"
                  placeholder="0300-1234567"
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-dark-elevated border border-dark-border text-white text-xs focus:outline-none focus:border-neon-orange"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">
                  Cash Collected (PKR)
                </label>
                <input
                  type="number"
                  value={walkInAmount}
                  onChange={(e) => setWalkInAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-dark-elevated border border-dark-border text-white text-xs focus:outline-none focus:border-neon-orange"
                />
              </div>
            </div>

            {walkInError && (
              <p className="text-xs text-[#FF7A4D] bg-[#E94A10]/15 border border-[#E94A10]/30 px-3 py-2 rounded-lg">
                {walkInError}
              </p>
            )}

            <button
              onClick={handleConfirmWalkIn}
              className="w-full py-2.5 rounded-xl bg-neon-orange text-dark font-extrabold text-xs shadow-lg hover:bg-neon-orange/90"
            >
              Log Walk-In & Block Slot
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
