"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  Calendar, 
  Users, 
  Zap, 
  FileText,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { formatPKR } from "@/lib/utils";

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

  // Commercial Metrics (Based on 6% Commission model)
  const grossRevenue = 485000;
  const commissionRate = 0.06; // 6% Platform commission
  const platformFee = Math.round(grossRevenue * commissionRate);
  const netPayout = grossRevenue - platformFee;

  const digitalCollections = 312000; // Raast & Wallets
  const physicalCash = 173000; // Collected by caretakers on field

  return (
    <main className="min-h-screen bg-[#090D10] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-neon-green text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              Venue Owner Commercial Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
              Karachi United Football Stadium — Revenue &amp; Audit Ledger
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Plot ST-20, Block 1, Scheme 5, Clifton, Karachi • Multi-Pitch Performance
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/caretaker/handover"
              className="px-3.5 py-2 rounded-xl bg-dark-card border border-dark-border hover:border-neon-yellow text-neon-yellow text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Clock className="w-3.5 h-3.5" />
              Caretaker Handover Screen
            </Link>
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl bg-dark-elevated text-white hover:text-neon-green border border-dark-border text-xs font-bold flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Public View
            </Link>
          </div>
        </div>

        {/* Top KPIs Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Gross Revenue */}
          <div className="bg-dark-card border border-dark-border p-5 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Total Gross Bookings
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {formatPKR(grossRevenue)}
            </div>
            <span className="text-[11px] text-neon-green font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% vs last month
            </span>
          </div>

          {/* Platform Commission (6%) */}
          <div className="bg-dark-card border border-dark-border p-5 rounded-2xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Platform Commission
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30">
                6% Flat
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neon-cyan font-mono">
              -{formatPKR(platformFee)}
            </div>
            <span className="text-[11px] text-gray-400">
              Software, Raast API & hosting
            </span>
          </div>

          {/* Net Owner Payout */}
          <div className="bg-dark-card border-2 border-neon-green/60 p-5 rounded-2xl space-y-2 shadow-neon-green/10 shadow-lg">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              Net Bank Payout (To Raast IBAN)
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-neon-green font-mono">
              {formatPKR(netPayout)}
            </div>
            <span className="text-[11px] text-gray-300 font-medium">
              Weekly settlement scheduled Monday
            </span>
          </div>

          {/* Digital vs Cash Split */}
          <div className="bg-dark-card border border-dark-border p-5 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Digital vs Physical Cash
            </span>
            <div className="text-sm font-bold text-white pt-1 flex justify-between">
              <span>Raast / Digital:</span>
              <strong className="text-neon-cyan font-mono">{formatPKR(digitalCollections)}</strong>
            </div>
            <div className="text-sm font-bold text-white flex justify-between">
              <span>On-Pitch Cash:</span>
              <strong className="text-neon-yellow font-mono">{formatPKR(physicalCash)}</strong>
            </div>
          </div>
        </div>

        {/* Pitch Revenue Performance */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-display">
              Sub-Pitch Revenue Breakdown (Last 30 Days)
            </h3>
            <span className="text-xs text-gray-400">
              Ranked by profitability
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-dark-elevated border border-neon-green/30 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">KU Main Stadium (11-a-Side)</span>
                <span className="text-neon-green font-extrabold font-mono">Rs. 252,000</span>
              </div>
              <div className="w-full bg-dark h-2 rounded-full overflow-hidden">
                <div className="bg-neon-green h-full w-[52%]" />
              </div>
              <div className="text-[11px] text-gray-400 flex justify-between">
                <span>18 Matches Booked</span>
                <span>52% of venue revenue</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-dark-elevated border border-dark-border space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">Clifton Sector (7-a-Side)</span>
                <span className="text-neon-cyan font-extrabold font-mono">Rs. 132,000</span>
              </div>
              <div className="w-full bg-dark h-2 rounded-full overflow-hidden">
                <div className="bg-neon-cyan h-full w-[27%]" />
              </div>
              <div className="text-[11px] text-gray-400 flex justify-between">
                <span>24 Matches Booked</span>
                <span>27% of venue revenue</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-dark-elevated border border-dark-border space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">Sea View Cage (5-a-Side)</span>
                <span className="text-neon-yellow font-extrabold font-mono">Rs. 101,000</span>
              </div>
              <div className="w-full bg-dark h-2 rounded-full overflow-hidden">
                <div className="bg-neon-yellow h-full w-[21%]" />
              </div>
              <div className="text-[11px] text-gray-400 flex justify-between">
                <span>19 Matches Booked</span>
                <span>21% of venue revenue</span>
              </div>
            </div>
          </div>
        </div>

        {/* Night Shift Reconciliation & Discrepancy Ledger */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-neon-green" />
                Caretaker Shift Handover & Anti-Theft Ledger
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Every night shift closure (03:00 AM) requires physical drawer count. Shortages exceeding Rs. 500 trigger automatic WhatsApp audit alerts.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-elevated text-gray-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-lg">Shift ID</th>
                  <th className="p-3">Caretaker</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Expected Cash</th>
                  <th className="p-3">Handed Over</th>
                  <th className="p-3">Variance</th>
                  <th className="p-3 rounded-r-lg">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/60 text-gray-300">
                {shiftAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-dark-elevated/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-white">{log.id}</td>
                    <td className="p-3 font-medium">{log.caretaker}</td>
                    <td className="p-3 text-gray-400">{log.date}</td>
                    <td className="p-3 font-mono">{formatPKR(log.expected)}</td>
                    <td className="p-3 font-mono font-bold text-white">{formatPKR(log.actual)}</td>
                    <td className={`p-3 font-mono font-bold ${
                      log.diff < 0 ? "text-red-400" : log.diff > 0 ? "text-neon-green" : "text-gray-400"
                    }`}>
                      {log.diff === 0 ? "Balanced (Rs. 0)" : formatPKR(log.diff)}
                    </td>
                    <td className="p-3">
                      {log.status === "AUDIT_FLAGGED" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-950/60 border border-red-500/50 text-red-400 inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Shortage Flagged (Alert Sent)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 border border-neon-green/30 text-neon-green inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Reconciled & Cleared
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

