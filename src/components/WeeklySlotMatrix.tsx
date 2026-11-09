"use client";

import React, { useState } from "react";
import { Clock, Calendar, Flame, AlertCircle, ChevronRight, Zap } from "lucide-react";
import { GroundVenue, Pitch, TimeSlot } from "@/types";
import { formatPKR } from "@/lib/utils";
import { generateDaySlots, LINKED_PITCH_MAP } from "@/lib/slotEngine";

interface WeeklySlotMatrixProps {
  venue: GroundVenue;
  onSlotSelected: (pitch: Pitch, slot: TimeSlot) => void;
}

export default function WeeklySlotMatrix({ venue, onSlotSelected }: WeeklySlotMatrixProps) {
  const [selectedPitch, setSelectedPitch] = useState<Pitch>(venue.pitches[0]);

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

  // Generate slots for selected pitch and date
  const slots = generateDaySlots(selectedPitch.id, activeDateStr, selectedPitch.pricePerHour);

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-5 space-y-5 shadow-xl">
      {/* Matrix Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-neon-green text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            Weekly Time-Slot Grid Matrix
          </div>
          <h3 className="text-lg font-bold text-white font-display mt-0.5">
            Availability & Dynamic Surge Pricing
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Select a pitch and date to view live peak, off-peak, and weekend rates.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-gray-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-green" /> Open
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-yellow" /> On Hold (10m)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Booked
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
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                isSelected
                  ? "bg-neon-green text-dark border-neon-green glow-neon-green"
                  : "bg-dark-elevated text-gray-300 border-dark-border hover:border-gray-500"
              }`}
            >
              {is11Side && <Flame className="w-3.5 h-3.5 fill-current text-neon-green group-hover:text-dark" />}
              <span>{p.name}</span>
              <span className={`text-[10px] ${isSelected ? "text-dark opacity-90" : "text-gray-400"}`}>
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
              className={`py-2 px-1 rounded-xl text-center border transition-all ${
                active
                  ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan glow-neon-cyan font-bold"
                  : "bg-dark-elevated border-dark-border text-gray-400 hover:border-gray-500 hover:text-white"
              }`}
            >
              <span className="block text-[10px] uppercase font-bold">
                {d.isToday ? "Today" : d.dayName}
              </span>
              <span className="block text-sm sm:text-base font-extrabold text-white">
                {d.dayNum}
              </span>
              <span className={`block text-[9px] ${d.isWeekend ? "text-neon-yellow font-bold" : "opacity-60"}`}>
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
          const hasSurge = !!slot.surgeLabel;

          let btnClasses = "bg-dark-elevated border-dark-border text-white hover:border-neon-green";
          if (isBooked) {
            btnClasses = "bg-red-950/20 border-red-900/40 text-gray-500 cursor-not-allowed line-through";
          } else if (isLocked) {
            btnClasses = "bg-yellow-950/20 border-yellow-800/40 text-yellow-400 cursor-not-allowed";
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
                  slot.surgeLabel.includes("Weekend") ? "bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/40" : "bg-emerald-500/20 text-emerald-400"
                }`}>
                  {slot.surgeLabel.split(" ")[0]}
                </div>
              )}

              <div className="text-xs font-mono font-bold mt-1">
                {slot.startTime} - {slot.endTime}
              </div>
              <div className="text-[11px] font-extrabold text-neon-green mt-1">
                {isBooked ? "Booked" : isLocked ? "On Hold" : formatPKR(slot.price)}
              </div>
              <div className="text-[9px] text-gray-400">50m play + 10m buffer</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

