"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Warning as AlertTriangle,
  CheckCircle as CheckCircle2,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { formatPKR } from "@/lib/utils";
import AdminShell from "@/components/admin/AdminShell";
import { Card, Badge } from "@/components/ui";

const DEFAULT_SHIFTS = [
  {
    id: "SHIFT-9921",
    caretaker: "Chacha Tariq",
    date: "Nov 05, 03:15 AM",
    expected: 34000,
    actual: 34000,
    diff: 0,
    status: "CLEARED",
  },
  {
    id: "SHIFT-9844",
    caretaker: "Nadeem Akhtar",
    date: "Nov 04, 03:00 AM",
    expected: 28500,
    actual: 27500,
    diff: -1000,
    status: "AUDIT_FLAGGED",
    alertDispatched: true,
  },
  {
    id: "SHIFT-9781",
    caretaker: "Chacha Tariq",
    date: "Nov 03, 03:10 AM",
    expected: 41000,
    actual: 41200,
    diff: 200,
    status: "CLEARED",
  },
];

export default function OwnerDashboardPage() {
  const [shiftAuditLogs, setShiftAuditLogs] = useState(DEFAULT_SHIFTS);

  useEffect(() => {
    fetch("/api/owner/reconciliation")
      .then((res) => res.json())
      .then((data) => {
        if (data.shifts && Array.isArray(data.shifts)) {
          setShiftAuditLogs(data.shifts);
        }
      })
      .catch(() => {});
  }, []);

  const grossRevenue = 485000;
  const commissionRate = 0.06;
  const platformFee = Math.round(grossRevenue * commissionRate);
  const netPayout = grossRevenue - platformFee;
  const digitalCollections = 312000;
  const physicalCash = 173000;

  return (
    <AdminShell
      title="Venue Owner Commercial Portal"
      subtitle="Karachi United Football Stadium • Clifton, Karachi — Multi-Pitch Revenue & Audit Ledger"
    >
      <div className="space-y-6">
        {/* Top KPIs Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 space-y-2">
            <span className="text-xs font-bold text-[#5C6B64] uppercase tracking-wider block">
              Total Gross Bookings
            </span>
            <div className="text-2xl font-display font-extrabold text-[#0E2A20]">
              {formatPKR(grossRevenue)}
            </div>
            <span className="text-[11px] text-[#176B3A] font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% vs last month
            </span>
          </Card>

          <Card className="p-5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#5C6B64] uppercase tracking-wider block">
                Platform Fee
              </span>
              <Badge tone="neutral">6% Flat</Badge>
            </div>
            <div className="text-2xl font-display font-extrabold text-[#0E2A20]">
              -{formatPKR(platformFee)}
            </div>
            <span className="text-[11px] text-[#5C6B64]">
              Software, Raast API &amp; hosting
            </span>
          </Card>

          <Card className="p-5 space-y-2 border-[#176B3A]/40 bg-[#176B3A]/[0.03]">
            <span className="text-xs font-bold text-[#176B3A] uppercase tracking-wider block">
              Net Bank Payout
            </span>
            <div className="text-2xl font-display font-extrabold text-[#176B3A]">
              {formatPKR(netPayout)}
            </div>
            <span className="text-[11px] text-[#5C6B64] font-medium">
              Weekly settlement scheduled Monday
            </span>
          </Card>

          <Card className="p-5 space-y-2">
            <span className="text-xs font-bold text-[#5C6B64] uppercase tracking-wider block">
              Digital vs Cash
            </span>
            <div className="text-xs font-semibold text-[#0E2A20] pt-1 flex justify-between">
              <span>Raast / Digital:</span>
              <strong className="font-display text-[#176B3A]">{formatPKR(digitalCollections)}</strong>
            </div>
            <div className="text-xs font-semibold text-[#0E2A20] flex justify-between">
              <span>On-Pitch Cash:</span>
              <strong className="font-display text-[#8D7216]">{formatPKR(physicalCash)}</strong>
            </div>
          </Card>
        </div>

        {/* Pitch Revenue Performance */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0E2A20] font-display">
              Sub-Pitch Revenue Breakdown (Last 30 Days)
            </h3>
            <span className="text-xs text-[#5C6B64]">Ranked by profitability</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#F4F5F3] border border-[#E6E7E5] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#0E2A20]">KU Main Stadium (11-a-Side)</span>
                <span className="text-[#176B3A] font-display font-extrabold">Rs. 252,000</span>
              </div>
              <div className="w-full bg-[#E6E7E5] h-2 rounded-full overflow-hidden">
                <div className="bg-[#176B3A] h-full w-[52%]" />
              </div>
              <div className="text-[11px] text-[#5C6B64] flex justify-between">
                <span>18 Matches Booked</span>
                <span>52% of revenue</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F5F3] border border-[#E6E7E5] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#0E2A20]">Clifton Sector (7-a-Side)</span>
                <span className="text-[#0E2A20] font-display font-extrabold">Rs. 132,000</span>
              </div>
              <div className="w-full bg-[#E6E7E5] h-2 rounded-full overflow-hidden">
                <div className="bg-[#0E2A20] h-full w-[27%]" />
              </div>
              <div className="text-[11px] text-[#5C6B64] flex justify-between">
                <span>24 Matches Booked</span>
                <span>27% of revenue</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F5F3] border border-[#E6E7E5] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#0E2A20]">Sea View Cage (5-a-Side)</span>
                <span className="text-[#8D7216] font-display font-extrabold">Rs. 101,000</span>
              </div>
              <div className="w-full bg-[#E6E7E5] h-2 rounded-full overflow-hidden">
                <div className="bg-[#C8A838] h-full w-[21%]" />
              </div>
              <div className="text-[11px] text-[#5C6B64] flex justify-between">
                <span>19 Matches Booked</span>
                <span>21% of revenue</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Night Shift Reconciliation & Discrepancy Ledger */}
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#0E2A20] font-display flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#176B3A]" />
              Caretaker Shift Handover &amp; Anti-Theft Ledger
            </h3>
            <p className="text-xs text-[#5C6B64] mt-0.5">
              Every night shift closure (03:00 AM) requires physical drawer count. Shortages exceeding Rs. 500 trigger audit alerts.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F5F3] text-[#5C6B64] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-lg">Shift ID</th>
                  <th className="p-3">Caretaker</th>
                  <th className="p-3">Date &amp; Time</th>
                  <th className="p-3">Expected Cash</th>
                  <th className="p-3">Handed Over</th>
                  <th className="p-3">Variance</th>
                  <th className="p-3 rounded-r-lg">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E7E5] text-[#0E2A20]">
                {shiftAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F4F5F3]/60 transition-colors">
                    <td className="p-3 font-mono font-bold">{log.id}</td>
                    <td className="p-3 font-medium">{log.caretaker}</td>
                    <td className="p-3 text-[#5C6B64]">{log.date}</td>
                    <td className="p-3 font-display font-semibold">{formatPKR(log.expected)}</td>
                    <td className="p-3 font-display font-bold">{formatPKR(log.actual)}</td>
                    <td
                      className={`p-3 font-display font-bold ${
                        log.diff < 0
                          ? "text-[#E94A10]"
                          : log.diff > 0
                            ? "text-[#176B3A]"
                            : "text-[#5C6B64]"
                      }`}
                    >
                      {log.diff === 0 ? "Balanced (Rs. 0)" : formatPKR(log.diff)}
                    </td>
                    <td className="p-3">
                      {log.status === "AUDIT_FLAGGED" ? (
                        <Badge tone="alert">
                          <AlertTriangle className="w-3 h-3" /> Shortage Flagged
                        </Badge>
                      ) : (
                        <Badge tone="forest">
                          <CheckCircle2 className="w-3 h-3" /> Reconciled
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
