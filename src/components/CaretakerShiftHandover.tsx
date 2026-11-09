"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Banknote, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  Clock, 
  FileText,
  Send,
  Lock
} from "lucide-react";
import { formatPKR } from "@/lib/utils";

export default function CaretakerShiftHandover() {
  const [caretakerName, setCaretakerName] = useState<string>("Chacha Tariq (Head Attendant)");
  const [expectedCash] = useState<number>(34000); // 34,000 PKR collected across tonight's matches
  const [countedCashInput, setCountedCashInput] = useState<string>("34000");
  const [notes, setNotes] = useState<string>("Floodlight shift ended 03:00 AM. 11-a-side nets rolled up.");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [shiftCompleted, setShiftCompleted] = useState<any | null>(null);

  const countedCash = Number(countedCashInput) || 0;
  const discrepancy = countedCash - expectedCash;
  const isShortage = discrepancy < 0;
  const absDiff = Math.abs(discrepancy);
  const isThresholdBreached = absDiff > 500 && isShortage;

  const handleSubmitHandover = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/owner/reconciliation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groundId: "kamil-fc-arena",
          caretakerName,
          expectedCash,
          actualCashCounted: countedCash,
          ownerPhone: "0300-9988776",
          shiftNotes: notes,
        }),
      });
      const data = await res.json();
      setShiftCompleted(data);
    } catch (e) {
      alert("Shift handover submitted locally.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-dark-border">
        <Link
          href="/caretaker"
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Field Check-In
        </Link>
        <span className="px-2.5 py-1 rounded-full bg-neon-yellow/10 border border-neon-yellow/30 text-neon-yellow text-xs font-bold flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> Shift Handover
        </span>
      </div>

      <div className="bg-dark-card border border-dark-border p-5 rounded-2xl space-y-4 shadow-xl">
        <div>
          <span className="text-[10px] uppercase font-bold text-neon-green tracking-wider">
            Night Shift Closure (03:00 AM)
          </span>
          <h2 className="text-base font-bold text-white font-display mt-0.5">
            Caretaker Cash Drawer Reconciliation
          </h2>
          <p className="text-xs text-gray-400">
            Reconcile physical cash drawer with verified on-ground match receipts.
          </p>
        </div>

        {/* Expected Cash Box */}
        <div className="bg-dark-elevated p-4 rounded-xl border border-dark-border space-y-1">
          <span className="text-[11px] text-gray-400 block">System Expected Physical Cash</span>
          <div className="text-2xl font-mono font-extrabold text-neon-green">
            {formatPKR(expectedCash)}
          </div>
          <span className="text-[10px] text-gray-400 block">
            Calculated from 5 cash-on-arrival bookings & 2 walk-in matches tonight
          </span>
        </div>

        {/* Actual Cash Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-300 block">
            Actual Cash Counted in Drawer (PKR)
          </label>
          <div className="relative">
            <Banknote className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              value={countedCashInput}
              onChange={(e) => setCountedCashInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-dark border border-dark-border text-white text-sm font-mono font-bold focus:outline-none focus:border-neon-cyan"
            />
          </div>
        </div>

        {/* Discrepancy Live Box */}
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs transition-all ${
            isThresholdBreached
              ? "bg-red-950/40 border-red-500/50 text-red-200"
              : discrepancy === 0
              ? "bg-emerald-950/40 border-neon-green/40 text-neon-green"
              : "bg-dark-elevated border-dark-border text-gray-300"
          }`}
        >
          {isThresholdBreached ? (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
          )}
          <div>
            <div className="font-bold">
              {discrepancy === 0
                ? "Perfect Balance (Rs. 0 Variance)"
                : isShortage
                ? `Cash Shortage: -${formatPKR(absDiff)}`
                : `Cash Surplus: +${formatPKR(absDiff)}`}
            </div>
            <p className="text-[11px] opacity-80 mt-0.5">
              {isThresholdBreached
                ? "⚠️ Policy Alert: Shortage exceeds the Rs. 500 audit limit. An automatic audit alert will be dispatched to the venue owner's WhatsApp upon submission."
                : "Drawer variance is within allowable bounds (±Rs. 500 threshold)."}
            </p>
          </div>
        </div>

        {/* Shift Notes */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-300 block">
            Shift Handover Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-dark border border-dark-border text-white text-xs focus:outline-none focus:border-neon-cyan"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleSubmitHandover}
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl bg-neon-cyan text-dark font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 glow-neon-cyan shadow-lg hover:bg-neon-cyan/90 transition-all active:scale-95"
        >
          <Lock className="w-4 h-4" />
          {isSubmitting ? "Reconciling..." : "Submit Shift Handover & Lock Ledger"}
        </button>

        {shiftCompleted && (
          <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-neon-green/40 text-neon-green text-xs space-y-2 animate-in zoom-in-95">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              {shiftCompleted.message}
            </div>
            {shiftCompleted.alertTriggered && (
              <div className="bg-dark p-2 rounded text-[10px] text-gray-300 font-mono">
                {shiftCompleted.alertPreview}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

