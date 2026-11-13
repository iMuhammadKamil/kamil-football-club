"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Clock,
  MapPin,
  ShareNetwork,
  CheckCircle,
  MagnifyingGlass,
  Bell,
  ShieldCheck,
  ArrowsClockwise,
  CaretRight,
} from "@phosphor-icons/react";
import { formatPKR } from "@/lib/utils";
import { Card, Badge, Input, EmptyState } from "@/components/ui";

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
      <Card className="p-5 sm:p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E6E7E5] pb-5">
          <div>
            <div className="flex items-center gap-2 text-[#176B3A] text-xs font-bold uppercase tracking-wider">
              <CalendarCheck className="w-4 h-4" weight="duotone" />
              <span>Matchday Passes &amp; Active Slots</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0E2A20] font-display mt-0.5">
              Your Booked Slots &amp; Passes
            </h2>
            <p className="text-xs text-[#5C6B64] mt-1 max-w-xl">
              Instant access to your 4-digit caretaker check-in PIN, match timings, remaining cash balance, and WhatsApp Squad Pay bill generator.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchBookings}
              className="px-3 py-2 rounded-xl bg-[#F4F5F3] hover:bg-[#EAEDEA] text-[#0E2A20] text-xs font-semibold flex items-center gap-1.5 transition-all border border-[#E6E7E5] cursor-pointer"
            >
              <ArrowsClockwise className={`w-4 h-4 text-[#176B3A] ${loading ? "animate-spin" : ""}`} weight="duotone" />
              Sync Passes
            </button>
            <Link
              href="/caretaker"
              className="px-3.5 py-2 rounded-xl bg-[#0E2A20] text-[#C8A838] hover:bg-[#143B2D] text-xs font-display font-bold flex items-center gap-1.5 transition-all"
            >
              <ShieldCheck className="w-4 h-4" weight="duotone" />
              Field PIN Screen
            </Link>
          </div>
        </div>

        {/* Quick Phone or PIN Search Filter */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <MagnifyingGlass className="w-4 h-4 text-[#5C6B64] absolute left-3.5 top-1/2 -translate-y-1/2" weight="duotone" />
            <Input
              type="text"
              placeholder="Find booking by WhatsApp phone (e.g. 0324...) or 4-digit PIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-[#5C6B64] hover:text-[#0E2A20] px-2 py-1 font-semibold cursor-pointer"
            >
              Clear
            </button>
          )}
          <div className="text-[11px] text-[#5C6B64] shrink-0">
            Active Passes: <strong className="text-[#0E2A20] font-display">{filteredBookings.length}</strong>
          </div>
        </div>
      </Card>

      {/* Bookings List Cards */}
      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredBookings.map((b) => {
            const isCheckedIn = b.checkInStatus === "CHECKED_IN";
            const reminderTxt = reminderStatus[b.id];

            return (
              <Card
                key={b.id}
                interactive
                className="p-5 space-y-4 flex flex-col justify-between relative overflow-hidden group"
              >
                {/* Status Indicator */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    isCheckedIn ? "bg-[#176B3A]" : "bg-[#C8A838]"
                  }`}
                />

                <div className="space-y-3">
                  {/* Top Bar: Status & Booking ID */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#5C6B64]">
                      PASS #{b.id}
                    </span>
                    <Badge tone={isCheckedIn ? "forest" : "gold"}>
                      {isCheckedIn ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" weight="duotone" /> PITCH UNLOCKED
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5" weight="duotone" /> SLOT CONFIRMED
                        </>
                      )}
                    </Badge>
                  </div>

                  {/* Pitch and Venue */}
                  <div>
                    <h3 className="text-base font-bold text-[#0E2A20] font-display group-hover:text-[#176B3A] transition-colors">
                      {b.pitchName}
                    </h3>
                    <p className="text-xs text-[#5C6B64] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#176B3A] shrink-0" weight="duotone" />
                      <span>{b.venueName || "POPO FC Ground (F-11/2)"}</span>
                    </p>
                  </div>

                  {/* Timing Pill */}
                  <div className="bg-[#F4F5F3] p-2.5 rounded-xl border border-[#E6E7E5] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[#0E2A20] font-medium">
                      <CalendarCheck className="w-4 h-4 text-[#5C6B64]" weight="duotone" />
                      <span>{b.slotDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-display font-bold text-[#176B3A]">
                      <Clock className="w-3.5 h-3.5" weight="duotone" />
                      <span>{b.slotTime}</span>
                    </div>
                  </div>

                  {/* High Contrast Scoreboard PIN Box */}
                  <div className="bg-[#0E2A20] p-3.5 rounded-xl border border-[#176B3A]/40 text-center space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#C8A838] uppercase tracking-wider">
                      Caretaker Check-In PIN
                    </span>
                    <div className="text-3xl font-mono font-black tracking-widest text-white">
                      {b.pinCode}
                    </div>
                    <p className="text-[10px] text-white/70">
                      Show this 4-digit code to ground attendant at pitch
                    </p>
                  </div>

                  {/* Financials Breakdown */}
                  <div className="space-y-1 pt-1 text-xs text-[#5C6B64]">
                    <div className="flex justify-between">
                      <span>Captain:</span>
                      <span className="font-semibold text-[#0E2A20]">
                        {b.captainName} ({b.captainPhone})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Price:</span>
                      <strong className="text-[#176B3A] font-display">{formatPKR(b.totalAmount)}</strong>
                    </div>
                    {b.cashDue > 0 ? (
                      <div className="flex justify-between text-[#B69422] font-bold">
                        <span>Cash Due at Pitch:</span>
                        <span>{formatPKR(b.cashDue)}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-[#176B3A] font-semibold">
                        <span>Payment:</span>
                        <span>Paid in Full</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-[#E6E7E5] space-y-2">
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
                      className="py-2 px-2 rounded-xl bg-[#176B3A]/10 hover:bg-[#176B3A] hover:text-white text-[#176B3A] border border-[#176B3A]/20 text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                    >
                      <ShareNetwork className="w-3.5 h-3.5" weight="duotone" />
                      <span>Squad Share</span>
                    </a>

                    {/* Pre-Match Reminder Button */}
                    <button
                      onClick={() => handleSendReminder(b)}
                      disabled={!!reminderTxt}
                      className="py-2 px-2 rounded-xl bg-[#F4F5F3] hover:bg-[#EAEDEA] text-[#0E2A20] text-[11px] font-semibold border border-[#E6E7E5] flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5 text-[#C8A838]" weight="duotone" />
                      <span>{reminderTxt || "Send Alert"}</span>
                    </button>
                  </div>

                  {/* Verify PIN Direct Quick Test */}
                  <Link
                    href={`/caretaker`}
                    className="w-full py-2 rounded-xl bg-[#F4F5F3] border border-[#E6E7E5] hover:border-[#176B3A]/40 text-[#0E2A20] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#176B3A]" weight="duotone" />
                    <span>Open Field Caretaker PIN Keypad</span>
                    <CaretRight className="w-3.5 h-3.5 text-[#5C6B64]" weight="bold" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          illustration="ticket"
          title="No Booked Slots Found"
          description={
            searchQuery
              ? `No booking matching "${searchQuery}". Please check the phone number or 4-digit PIN.`
              : "No matches booked yet. Explore available grounds below to lock your floodlit slot."
          }
          actionLabel="Explore Arenas & Book a Slot"
          onAction={() => {
            const el = document.getElementById("venues");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />
      )}
    </section>
  );
}

