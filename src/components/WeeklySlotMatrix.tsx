"use client";

import React, { useState, useEffect } from "react";
import { Clock, Fire } from "@phosphor-icons/react";
import { GroundVenue, Pitch, TimeSlot } from "@/types";
import { formatPKR } from "@/lib/utils";
import { generateDaySlots } from "@/lib/slotEngine";
import { Card } from "@/components/ui";

interface WeeklySlotMatrixProps {
  venue: GroundVenue;
  onSlotSelected: (pitch: Pitch, slot: TimeSlot) => void;
}

export default function WeeklySlotMatrix({ venue, onSlotSelected }: WeeklySlotMatrixProps) {
  const [selectedPitch, setSelectedPitch] = useState<Pitch>(venue.pitches[0]);
  const [serverBookings, setServerBookings] = useState<any[]>([]);
  const [serverLocks, setServerLocks] = useState<{ slotId: string; status: string }[]>([]);

  const syncLiveAvailability = async () => {
    try {
      const [bRes, lRes] = await Promise.all([fetch("/api/bookings"), fetch("/api/slots/lock")]);
      const bData = await bRes.json();
      const lData = await lRes.json();
      if (bData.bookings) setServerBookings(bData.bookings);
      if (lData.locks) setServerLocks(lData.locks);
    } catch {
      // keep generated defaults on network hiccup
    }
  };

  useEffect(() => {
    syncLiveAvailability();
    window.addEventListener("kfc:bookings-updated", syncLiveAvailability);
    return () => window.removeEventListener("kfc:bookings-updated", syncLiveAvailability);
  }, []);

  // Generate 7 upcoming dates
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dateStr: d.toISOString().split("T")[0],
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      isToday: i === 0,
      isWeekend: d.getDay() === 0 || d.getDay() === 5 || d.getDay() === 6,
    };
  });

  const [activeDateStr, setActiveDateStr] = useState<string>(next7Days[0].dateStr);

  // Merge generated slots with live bookings & 10-min holds
  const slots = generateDaySlots(selectedPitch.id, activeDateStr, selectedPitch.pricePerHour).map(
    (slot) => {
      const isBookedOnServer = serverBookings.some(
        (b) =>
          b.groundId === venue.id &&
          b.pitchName === selectedPitch.name &&
          b.slotDate === activeDateStr &&
          b.slotTime?.startsWith(slot.startTime)
      );
      const isLockedOnServer = serverLocks.some((l) => l.slotId === slot.id);
      if (isBookedOnServer) return { ...slot, status: "BOOKED" as const };
      if (isLockedOnServer && slot.status === "AVAILABLE") {
        return { ...slot, status: "HOLD_LOCKED" as const };
      }
      return slot;
    }
  );

  return (
    <Card className="p-5 space-y-5">
      {/* Matrix Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6E7E5] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#176B3A] text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4" weight="duotone" />
            Weekly Time-Slot Grid Matrix
          </div>
          <h3 className="text-lg font-bold text-[#0E2A20] font-display mt-0.5">
            Availability &amp; Dynamic Surge Pricing
          </h3>
          <p className="text-xs text-[#5C6B64] mt-0.5">
            Select a pitch and date to view live peak, off-peak, and weekend rates.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-[#5C6B64] font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#176B3A]" /> Open
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C8A838]" /> On Hold (10m)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E94A10]" /> Booked
          </span>
        </div>
      </div>

      {/* Pitch Selector Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {venue.pitches.map((p) => {
          const isSelected = selectedPitch.id === p.id;
          const is11Side = p.sportType === "FOOTBALL_11A_SIDE";
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPitch(p)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? "bg-[#0E2A20] text-[#C8A838] border-[#0E2A20] shadow-sm"
                  : "bg-white text-[#5C6B64] border-[#E6E7E5] hover:border-[#176B3A]/40 hover:text-[#0E2A20]"
              }`}
            >
              {is11Side && <Fire className="w-3.5 h-3.5" weight="duotone" />}
              <span>{p.name}</span>
              <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-[#5C6B64]"}`}>
                ({formatPKR(p.pricePerHour)}/hr)
              </span>
            </button>
          );
        })}
      </div>

      {/* 7-Day Date Tabs */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {next7Days.map((d) => {
          const active = activeDateStr === d.dateStr;
          return (
            <button
              key={d.dateStr}
              onClick={() => setActiveDateStr(d.dateStr)}
              className={`py-2 px-1 rounded-xl text-center border transition-all cursor-pointer ${
                active
                  ? "bg-[#176B3A] border-[#176B3A] text-white shadow-sm font-bold"
                  : "bg-[#F4F5F3] border-[#E6E7E5] text-[#5C6B64] hover:border-[#176B3A]/40 hover:text-[#0E2A20]"
              }`}
            >
              <span className="block text-[10px] uppercase font-bold">
                {d.isToday ? "Today" : d.dayName}
              </span>
              <span className={`block text-sm sm:text-base font-display font-extrabold ${active ? "text-white" : "text-[#0E2A20]"}`}>
                {d.dayNum}
              </span>
              <span className={`block text-[9px] font-bold ${active ? "text-[#C8A838]" : d.isWeekend ? "text-[#B69422]" : "opacity-70"}`}>
                {d.isWeekend ? "Surge" : d.month}
              </span>
            </button>
          );
        })}
      </div>

      {/* Slot Matrix Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 pt-2">
        {slots.map((slot) => {
          const isBooked = slot.status === "BOOKED";
          const isLocked = slot.status === "HOLD_LOCKED";

          let btnClasses = "bg-white border-[#E6E7E5] text-[#0E2A20] hover:border-[#176B3A] hover:shadow-sm cursor-pointer";
          if (isBooked) {
            btnClasses = "bg-[#F4F5F3] border-[#E6E7E5] text-[#5C6B64]/50 cursor-not-allowed line-through";
          } else if (isLocked) {
            btnClasses = "bg-[#C8A838]/10 border-[#C8A838]/35 text-[#8D7216] cursor-not-allowed";
          }

          return (
            <button
              key={slot.id}
              disabled={isBooked || isLocked}
              onClick={() => onSlotSelected(selectedPitch, slot)}
              className={`p-3 rounded-xl border text-center transition-all relative overflow-hidden group ${btnClasses}`}
            >
              {slot.surgeLabel && (
                <div className={`text-[8px] font-extrabold uppercase tracking-tight py-0.5 px-1 rounded absolute top-1 right-1 ${
                  slot.surgeLabel.includes("Weekend")
                    ? "bg-[#C8A838]/20 text-[#8D7216] border border-[#C8A838]/35"
                    : "bg-[#176B3A]/10 text-[#176B3A]"
                }`}>
                  {slot.surgeLabel.split(" ")[0]}
                </div>
              )}

              <div className="text-xs font-display font-bold mt-1">
                {slot.startTime} - {slot.endTime}
              </div>
              <div className={`text-[11px] font-display font-extrabold mt-1 ${
                isBooked ? "text-[#5C6B64]/60" : isLocked ? "text-[#8D7216]" : "text-[#176B3A]"
              }`}>
                {isBooked ? "Booked" : isLocked ? "On Hold" : formatPKR(slot.price)}
              </div>
              <div className="text-[9px] text-[#5C6B64]">50m play + 10m buffer</div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

