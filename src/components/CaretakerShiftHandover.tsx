"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Money as Banknote,
  Warning as AlertTriangle,
  CheckCircle as CheckCircle2,
  ArrowLeft,
  Clock,
  Lock,
} from "@phosphor-icons/react";
import { formatPKR } from "@/lib/utils";
import { Card, Button, Badge } from "@/components/ui";

export default function CaretakerShiftHandover() {
  const [caretakerName, setCaretakerName] = useState<string>("Chacha Tariq (Head Attendant)");
  const [expectedCash] = useState<number>(34000); // 34,000 PKR collected across tonight's matches
  const [countedCashInput, setCountedCashInput] = useState<string>("34000");
  const [notes, setNotes] = useState<string>("Floodlight shift ended 03:00 AM. 11-a-side nets rolled up.");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [shiftCompleted, setShiftCompleted] = useState<any | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const countedCash = Number(countedCashInput) || 0;
  const discrepancy = countedCash - expectedCash;
  const isShortage = discrepancy < 0;
  const absDiff = Math.abs(discrepancy);
  const isThresholdBreached = absDiff > 500 && isShortage;

  const handleSubmitHandover = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/owner/reconciliation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groundId: "karachi-united-stadium-clifton",
          caretakerName,
          expectedCash,
          actualCashCounted: countedCash,
          ownerPhone: "0300-9988776",
          shiftNotes: notes,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSubmitError(data.error || "Failed to submit shift handover.");
      } else {
        setShiftCompleted(data);
      }
    } catch {
      setSubmitError("Could not reach server to lock shift ledger.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#E6E7E5]">
        <Link
          href="/caretaker"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#5C6B64] hover:text-[#0E2A20]"
        >
          <ArrowLeft className="w-4 h-4" weight="bold" />
          Back to Field Check-In
        </Link>
        <Badge tone="gold">
          <Clock className="w-3.5 h-3.5" weight="duotone" /> Shift Handover
        </Badge>
      </div>

      <Card className="p-5 sm:p-6 space-y-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#176B3A] tracking-wider">
            Night Shift Closure (03:00 AM)
          </span>
          <h2 className="text-lg font-bold text-[#0E2A20] font-display mt-0.5">
            Caretaker Cash Drawer Reconciliation
          </h2>
          <p className="text-xs text-[#5C6B64]">
            Reconcile physical cash drawer with verified on-ground match receipts.
          </p>
        </div>

        {/* Expected Cash Box */}
        <div className="bg-[#F4F5F3] p-4 rounded-xl border border-[#E6E7E5] space-y-1">
          <span className="text-[11px] text-[#5C6B64] font-medium block">System Expected Physical Cash</span>
          <div className="text-2xl font-display font-extrabold text-[#176B3A]">
            {formatPKR(expectedCash)}
          </div>
          <span className="text-[10px] text-[#5C6B64] block">
            Calculated from 5 cash-on-arrival bookings &amp; 2 walk-in matches tonight
          </span>
        </div>

        {/* Actual Cash Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0E2A20] block">
            Actual Cash Counted in Drawer (PKR)
          </label>
          <div className="relative">
            <Banknote className="w-4 h-4 text-[#176B3A] absolute left-3 top-1/2 -translate-y-1/2" weight="duotone" />
            <input
              type="number"
              value={countedCashInput}
              onChange={(e) => setCountedCashInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F9FAF9] border border-[#E6E7E5] text-[#0E2A20] text-sm font-mono font-bold focus:outline-none focus:border-[#176B3A] focus:bg-white"
            />
          </div>
        </div>

        {/* Discrepancy Live Box */}
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs transition-all ${
            isThresholdBreached
              ? "bg-[#E94A10]/10 border-[#E94A10]/30 text-[#B83206]"
              : discrepancy === 0
              ? "bg-[#176B3A]/10 border-[#176B3A]/25 text-[#176B3A]"
              : "bg-[#F4F5F3] border-[#E6E7E5] text-[#0E2A20]"
          }`}
        >
          {isThresholdBreached ? (
            <AlertTriangle className="w-5 h-5 text-[#E94A10] shrink-0 mt-0.5" weight="duotone" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#176B3A] shrink-0 mt-0.5" weight="duotone" />
          )}
          <div>
            <div className="font-bold">
              {discrepancy === 0
                ? "Perfect Balance (Rs. 0 Variance)"
                : isShortage
                ? `Cash Shortage: -${formatPKR(absDiff)}`
                : `Cash Surplus: +${formatPKR(absDiff)}`}
            </div>
            <p className="text-[11px] opacity-85 mt-0.5">
              {isThresholdBreached
                ? "Policy Alert: Shortage exceeds the Rs. 500 audit limit. An automatic audit alert will be dispatched to the venue owner's WhatsApp upon submission."
                : "Drawer variance is within allowable bounds (±Rs. 500 threshold)."}
            </p>
          </div>
        </div>

        {/* Shift Notes */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#0E2A20] block">
            Shift Handover Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-[#F9FAF9] border border-[#E6E7E5] text-[#0E2A20] text-xs focus:outline-none focus:border-[#176B3A] focus:bg-white"
          />
        </div>

        {/* Action Button */}
        <Button
          onClick={handleSubmitHandover}
          disabled={isSubmitting}
          variant="primary"
          size="lg"
          className="w-full"
        >
          <Lock className="w-4 h-4" weight="duotone" />
          {isSubmitting ? "Reconciling..." : "Submit Shift Handover & Lock Ledger"}
        </Button>

        {submitError && (
          <div className="p-3 rounded-xl bg-[#E94A10]/10 border border-[#E94A10]/25 text-[#E94A10] text-xs font-medium">
            {submitError}
          </div>
        )}

        {shiftCompleted && (
          <div className="p-3.5 rounded-xl bg-[#176B3A]/10 border border-[#176B3A]/25 text-[#176B3A] text-xs space-y-2 animate-in zoom-in-95">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4" weight="duotone" />
              {shiftCompleted.message}
            </div>
            {shiftCompleted.alertTriggered && (
              <div className="bg-white border border-[#E6E7E5] p-2 rounded text-[10px] text-[#0E2A20] font-mono">
                {shiftCompleted.alertPreview}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

