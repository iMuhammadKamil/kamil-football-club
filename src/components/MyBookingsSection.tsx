"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Key, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  MessageCircle, 
  Bell, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { formatPKR } from "@/lib/utils";

interface BookingRecord {
  id: string;
  pinCode: string;
  captainName: string;
  captainPhone: string;
  groundId?: string;
  venueName?: string;
  pitchName: string;
  slotTime: string;
  slotDate: string;
  totalAmount: number;
  depositAmount: number;
  cashDue: number;
  paymentMethod: string;
  paymentStatus: string;
  checkInStatus: "PENDING" | "CHECKED_IN" | "CANCELLED";
  createdAt: string;
  squadSplits?: { name: string; share: number; isPaid: boolean }[];
}

export default function MyBookingsSection() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [reminderStatus, setReminderStatus] = useState<{ [id: string]: string }>({});

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.bookings) {
        setBookings(data.bookings);
      }
    } catch (e) {
      console.error("Failed to load bookings", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const onUpdated = () => fetchBookings();
    window.addEventListener("kfc:bookings-updated", onUpdated);
    const timer = setInterval(fetchBookings, 15000);
    return () => {
      window.removeEventListener("kfc:bookings-updated", onUpdated);
      clearInterval(timer);
    };
  }, []);

  const handleSendReminder = async (booking: BookingRecord) => {
    setReminderStatus((prev) => ({ ...prev, [booking.id]: "Sending..." }));
    try {
      const res = await fetch("/api/bookings/remind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          captainName: booking.captainName,
          captainPhone: booking.captainPhone,
          venueName: booking.venueName || "Kamil FC Arena",
          pitchName: booking.pitchName,
          slotTime: booking.slotTime,
          pinCode: booking.pinCode,
          remainingAmount: booking.cashDue,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReminderStatus((prev) => ({ ...prev, [booking.id]: "WhatsApp Sent!" }));
        setTimeout(() => {
          setReminderStatus((prev) => ({ ...prev, [booking.id]: "" }));
        }, 3500);
      } else {
        setReminderStatus((prev) => ({ ...prev, [booking.id]: "Failed" }));
      }
    } catch {
      setReminderStatus((prev) => ({ ...prev, [booking.id]: "Failed" }));
    }
  };

  // Filter bookings based on user search query (phone number, PIN, or captain name)
  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      b.captainPhone?.toLowerCase().includes(q) ||
      b.pinCode?.includes(q) ||
      b.captainName?.toLowerCase().includes(q) ||
      b.id?.toLowerCase().includes(q) ||
      b.pitchName?.toLowerCase().includes(q)
    );
  });

  return (
    <section id="my-bookings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
      {/* Header and Lookup Search Bar */}
      <div className="bg-[#0A130F] border border-[#17261E] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#17261E] pb-5">
          <div>
            <div className="flex items-center gap-2 text-[#00E575] text-xs font-bold">
              <Calendar className="w-4 h-4" />
              <span>Matchday Passes & Active Slots</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display mt-0.5">
              Your Booked Slots & Passes
            </h2>
            <p className="text-xs text-gray-400 mt-1 max-w-xl">
              Instant access to your 4-digit caretaker check-in PIN, match timings, remaining cash balance, and WhatsApp Squad Pay bill generator.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchBookings}
              className="px-3 py-2 rounded-xl bg-[#0F1D16] hover:bg-[#14291F] text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all border border-[#1E3527]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Sync Passes
            </button>
            <Link
              href="/caretaker"
              className="px-3.5 py-2 rounded-xl bg-[#12231A] border border-[#1E3A2B] text-[#00E575] hover:bg-[#00E575] hover:text-[#090D10] text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Field PIN Screen
            </Link>
          </div>
        </div>

        {/* Quick Phone or PIN Search Filter */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Find booking by WhatsApp phone (e.g. 0324...) or 4-digit PIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#090D10] border border-[#17261E] text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#00E575]"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-gray-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
          )}
          <div className="text-[11px] text-gray-400 shrink-0">
            Active Passes: <strong className="text-white font-mono">{filteredBookings.length}</strong>
          </div>
        </div>
      </div>

      {/* Bookings List Cards */}
      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredBookings.map((b) => {
            const isCheckedIn = b.checkInStatus === "CHECKED_IN";
            const reminderTxt = reminderStatus[b.id];

            return (
              <div
                key={b.id}
                className="bg-[#0C1611] border border-[#17261E] hover:border-[#00E575]/50 rounded-2xl p-5 space-y-4 shadow-lg transition-all flex flex-col justify-between relative overflow-hidden group"
              >
                {/* Status Indicator */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    isCheckedIn ? "bg-[#00E575]" : "bg-amber-400"
                  }`}
                />

                <div className="space-y-3">
                  {/* Top Bar: Status & Booking ID */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-400">
                      PASS #{b.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                        isCheckedIn
                          ? "bg-[#00E575]/20 text-[#00E575] border border-[#00E575]/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {isCheckedIn ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> PITCH ACCESS UNLOCKED
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" /> SLOT CONFIRMED
                        </>
                      )}
                    </span>
                  </div>

                  {/* Pitch and Venue */}
                  <div>
                    <h3 className="text-base font-bold text-white font-display group-hover:text-[#00E575] transition-colors">
                      {b.pitchName}
                    </h3>
                    <p className="text-xs text-gray-300 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#00E575] shrink-0" />
                      <span>{b.venueName || "POPO FC Ground (F-11/2)"}</span>
                    </p>
                  </div>

                  {/* Timing Pill */}
                  <div className="bg-[#08100C] p-2.5 rounded-xl border border-[#17261E] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-white">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{b.slotDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-[#00E575]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{b.slotTime}</span>
                    </div>
                  </div>

                  {/* High Contrast Scoreboard PIN Box */}
                  <div className="bg-[#090D10] p-3.5 rounded-xl border border-[#1E3A2B] text-center space-y-1">
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Caretaker Check-In PIN
                    </span>
                    <div className="text-3xl font-mono font-black tracking-widest text-[#00E575]">
                      {b.pinCode}
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Show this 4-digit code to ground attendant at pitch
                    </p>
                  </div>

                  {/* Financials Breakdown */}
                  <div className="space-y-1 pt-1 text-xs text-gray-300">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Captain:</span>
                      <span className="font-semibold text-white">
                        {b.captainName} ({b.captainPhone})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Price:</span>
                      <strong className="text-[#00E575]">{formatPKR(b.totalAmount)}</strong>
                    </div>
                    {b.cashDue > 0 ? (
                      <div className="flex justify-between text-amber-300 font-bold">
                        <span>Cash Due at Pitch:</span>
                        <span>{formatPKR(b.cashDue)}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-[#00E575] font-semibold">
                        <span>Payment:</span>
                        <span>Paid in Full</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-[#17261E] space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Share WhatsApp Squad Bill */}
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `⚽ *Match Confirmed with Kamil Football Club!*\n` +
                        `🏟️ Venue: ${b.venueName || "Kamil FC Arena"}\n` +
                        `🌱 Pitch: ${b.pitchName}\n` +
                        `📅 Date: ${b.slotDate}\n` +
                        `⏰ Time: ${b.slotTime}\n` +
                        `🔑 Caretaker Check-In PIN: *${b.pinCode}*\n` +
                        `💰 Total: Rs. ${b.totalAmount} (Cash Due at Pitch: Rs. ${b.cashDue})\n` +
                        `👟 Rubber studs or turf trainers only.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2 rounded-xl bg-[#12231A] hover:bg-[#00E575] hover:text-[#090D10] text-[#00E575] border border-[#1E3A2B] text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Squad Share</span>
                    </a>

                    {/* Pre-Match Reminder Button */}
                    <button
                      onClick={() => handleSendReminder(b)}
                      disabled={!!reminderTxt}
                      className="py-2 px-2 rounded-xl bg-[#0F1D16] hover:bg-[#152B1F] text-white text-[11px] font-semibold border border-[#17261E] flex items-center justify-center gap-1 transition-all"
                    >
                      <Bell className="w-3.5 h-3.5 text-amber-400" />
                      <span>{reminderTxt || "Send Alert"}</span>
                    </button>
                  </div>

                  {/* Verify PIN Direct Quick Test */}
                  <Link
                    href={`/caretaker`}
                    className="w-full py-2 rounded-xl bg-[#08100C] border border-[#17261E] hover:border-[#00E575]/40 text-gray-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00E575]" />
                    <span>Open Field Caretaker PIN Keypad</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#0A130F] border border-[#17261E] rounded-2xl p-8 sm:p-12 text-center space-y-3">
          <Calendar className="w-10 h-10 text-gray-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Booked Slots Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            {searchQuery
              ? `No booking matching "${searchQuery}". Please check the phone number or 4-digit PIN.`
              : "No matches booked yet. Explore available grounds below to lock your floodlit slot."}
          </p>
          <a
            href="#venues"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E575] text-[#090D10] text-xs font-extrabold mt-2 transition-all shadow-md active:scale-95"
          >
            Explore Arenas & Book a Slot
          </a>
        </div>
      )}
    </section>
  );
}

