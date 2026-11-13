"use client";

import React, { useEffect, useState } from "react";
import {
  Lightning,
  UsersThree,
  CheckCircle,
  Clock,
  WhatsappLogo,
  Plus,
  Trash,
} from "@phosphor-icons/react";
import AdminShell from "@/components/admin/AdminShell";
import { Card, Badge, Button, Switch, Input } from "@/components/ui";

interface RushQueueItem {
  id: string;
  squadName: string;
  phone: string;
  sport: string;
  preferredSlot: string;
  waitingMins: number;
  status: "WAITING" | "ASSIGNED";
}

interface PitchLoad {
  id: string;
  name: string;
  occupancy: number;
  nextFree: string;
  status: "PEAK_RUSH" | "FILLING_FAST" | "OPEN";
}

interface RushControlsState {
  peakSurgeActive: boolean;
  bufferEnforced: boolean;
  walkInsPaused: boolean;
  floodlightBoost: boolean;
}

export default function RushManagementPage() {
  const [controls, setControls] = useState<RushControlsState>({
    peakSurgeActive: true,
    bufferEnforced: true,
    walkInsPaused: false,
    floodlightBoost: true,
  });
  const [queue, setQueue] = useState<RushQueueItem[]>([]);
  const [pitches, setPitches] = useState<PitchLoad[]>([]);
  const [avgOccupancy, setAvgOccupancy] = useState<number>(77);

  // Quick 1-line Walk-In Add
  const [newSquad, setNewSquad] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [adding, setAdding] = useState(false);

  const loadRush = async () => {
    try {
      const res = await fetch("/api/rush");
      const data = await res.json();
      if (data.controls) setControls(data.controls);
      if (data.queue) setQueue(data.queue);
      if (data.pitches) setPitches(data.pitches);
      if (typeof data.avgOccupancy === "number") setAvgOccupancy(data.avgOccupancy);
    } catch {
      // ignore transient network errors
    }
  };

  useEffect(() => {
    loadRush();
  }, []);

  const toggleControl = async (key: keyof RushControlsState, next: boolean) => {
    setControls((prev) => ({ ...prev, [key]: next }));
    await fetch("/api/rush", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "TOGGLE_CONTROL", key, value: next }),
    });
  };

  const handleAssignSlot = async (id: string) => {
    const res = await fetch("/api/rush", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ASSIGN_SLOT", id }),
    });
    const data = await res.json();
    if (data.queue) setQueue(data.queue);
  };

  const handleRemoveQueue = async (id: string) => {
    const res = await fetch("/api/rush", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "REMOVE_QUEUE", id }),
    });
    const data = await res.json();
    if (data.queue) setQueue(data.queue);
  };

  const handleAddWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSquad.trim() || !newPhone.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/rush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "JOIN_QUEUE",
          squadName: newSquad,
          phone: newPhone,
          sport: "7v7 Turf",
          preferredSlot: "Next Free Slot",
        }),
      });
      const data = await res.json();
      if (data.queue) {
        setQueue(data.queue);
        setNewSquad("");
        setNewPhone("");
      }
    } finally {
      setAdding(false);
    }
  };

  const waitingCount = queue.filter((q) => q.status === "WAITING").length;

  return (
    <AdminShell
      title="Rush & Queue Management"
      subtitle="Live peak-hour occupancy, 10m changeover buffer, and instant walk-in waitlist."
    >
      <div className="space-y-6">
        {/* Mockup Screen 07 Style Evergreen Header Banner */}
        <div className="rounded-2xl p-5 sm:p-6 stadium-mesh-bg text-white shadow-md">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C8A838]">
                PEAK RUSH CONTROL · TONIGHT
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold mt-0.5">
                Live Pitch Load &amp; Queue
              </h2>
            </div>
            <Badge tone={controls.peakSurgeActive ? "gold" : "neutral"}>
              <Lightning className="w-3.5 h-3.5" weight="fill" />
              {controls.peakSurgeActive ? "Surge +20% ON" : "Standard Rate"}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/15 rounded-xl p-3">
              <div className="text-xl sm:text-2xl font-display font-extrabold text-[#C8A838]">
                {avgOccupancy}%
              </div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-white/80">
                Occupancy
              </div>
            </div>
            <div className="bg-white/15 rounded-xl p-3">
              <div className="text-xl sm:text-2xl font-display font-extrabold text-white">
                {waitingCount}
              </div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-white/80">
                In Queue
              </div>
            </div>
            <div className="bg-white/15 rounded-xl p-3">
              <div className="text-xl sm:text-2xl font-display font-extrabold text-[#C8A838]">
                {controls.bufferEnforced ? "10m" : "0m"}
              </div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-white/80">
                Buffer Lock
              </div>
            </div>
          </div>
        </div>

        {/* 1-Tap Rush Switches + Live Pitch Load */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Pitch Controls (Mockup .bk + .tog2) */}
          <Card className="lg:col-span-5 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#E6E7E5] pb-3">
              <h3 className="text-sm font-display font-bold text-[#0E2A20]">
                1-Tap Rush Controls
              </h3>
              <span className="text-[11px] font-semibold text-[#176B3A]">Instant Sync</span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F5F3] border border-[#E6E7E5]">
                <div>
                  <div className="text-xs font-display font-bold text-[#0E2A20]">
                    Peak Hour Surge (+20%)
                  </div>
                  <div className="text-[11px] text-[#5C6B64]">Auto-apply 19:00–23:00</div>
                </div>
                <Switch
                  checked={controls.peakSurgeActive}
                  onChange={(v) => toggleControl("peakSurgeActive", v)}
                  label="Peak Hour Surge"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F5F3] border border-[#E6E7E5]">
                <div>
                  <div className="text-xs font-display font-bold text-[#0E2A20]">
                    10m Buffer Changeover
                  </div>
                  <div className="text-[11px] text-[#5C6B64]">Prevent back-to-back clashes</div>
                </div>
                <Switch
                  checked={controls.bufferEnforced}
                  onChange={(v) => toggleControl("bufferEnforced", v)}
                  label="10m Buffer Changeover"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F5F3] border border-[#E6E7E5]">
                <div>
                  <div className="text-xs font-display font-bold text-[#0E2A20]">
                    Pause Walk-In Queue
                  </div>
                  <div className="text-[11px] text-[#5C6B64]">Online bookings only</div>
                </div>
                <Switch
                  checked={controls.walkInsPaused}
                  onChange={(v) => toggleControl("walkInsPaused", v)}
                  label="Pause Walk-In Queue"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F5F3] border border-[#E6E7E5]">
                <div>
                  <div className="text-xs font-display font-bold text-[#0E2A20]">
                    Floodlight Boost
                  </div>
                  <div className="text-[11px] text-[#5C6B64]">Keep all towers on until 02:00</div>
                </div>
                <Switch
                  checked={controls.floodlightBoost}
                  onChange={(v) => toggleControl("floodlightBoost", v)}
                  label="Floodlight Boost"
                />
              </div>
            </div>
          </Card>

          {/* Live Pitch Occupancy Bars */}
          <Card className="lg:col-span-7 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#E6E7E5] pb-3">
              <h3 className="text-sm font-display font-bold text-[#0E2A20]">
                Live Pitch Crowd Meter
              </h3>
              <span className="text-[11px] text-[#5C6B64]">Updated live</span>
            </div>

            <div className="space-y-3 pt-1">
              {pitches.map((p) => {
                const isPeak = p.status === "PEAK_RUSH";
                const isFilling = p.status === "FILLING_FAST";
                return (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-[#F4F5F3] border border-[#E6E7E5] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-display font-bold text-[#0E2A20]">{p.name}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-[#5C6B64] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#176B3A]" weight="duotone" />
                          Next: <strong className="text-[#0E2A20]">{p.nextFree}</strong>
                        </span>
                        <Badge tone={isPeak ? "alert" : isFilling ? "gold" : "forest"}>
                          {p.occupancy}%
                        </Badge>
                      </div>
                    </div>

                    <div className="h-2 w-full rounded-full bg-white border border-[#E6E7E5] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isPeak ? "bg-[#E94A10]" : isFilling ? "bg-[#C8A838]" : "bg-[#176B3A]"
                        }`}
                        style={{ width: `${p.occupancy}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Rush Waitlist Queue + Quick Walk-In Entry */}
        <Card className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6E7E5] pb-3">
            <div className="flex items-center gap-2">
              <UsersThree className="w-5 h-5 text-[#176B3A]" weight="duotone" />
              <h3 className="text-sm sm:text-base font-display font-bold text-[#0E2A20]">
                Walk-In &amp; Rush Waitlist ({waitingCount} waiting)
              </h3>
            </div>

            <form onSubmit={handleAddWalkIn} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              <Input
                placeholder="Squad name"
                value={newSquad}
                onChange={(e) => setNewSquad(e.target.value)}
                className="sm:w-36 py-2"
              />
              <Input
                placeholder="0300-1234567"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="sm:w-36 py-2"
              />
              <Button type="submit" variant="secondary" size="sm" disabled={adding} className="shrink-0">
                <Plus className="w-3.5 h-3.5" weight="bold" />
                Add Walk-In
              </Button>
            </form>
          </div>

          <div className="space-y-2.5">
            {queue.map((item) => {
              const assigned = item.status === "ASSIGNED";
              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#F4F5F3] border border-[#E6E7E5]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-display font-extrabold text-xs shrink-0 ${
                        assigned
                          ? "bg-[#176B3A] text-white"
                          : "bg-[#C8A838]/25 text-[#8D7216]"
                      }`}
                    >
                      {item.id.replace("RQ-", "#")}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-display font-bold text-[#0E2A20]">
                        {item.squadName} · <span className="text-[#176B3A]">{item.sport}</span>
                      </div>
                      <div className="text-[11px] text-[#5C6B64]">
                        {item.phone} · Target: {item.preferredSlot} · Waiting {item.waitingMins}m
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {assigned ? (
                      <Badge tone="forest">
                        <CheckCircle className="w-3.5 h-3.5" weight="duotone" />
                        Slot Assigned
                      </Badge>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="primary"
                        onClick={() => handleAssignSlot(item.id)}
                      >
                        Assign Next Slot
                      </Button>
                    )}

                    <a
                      href={`https://wa.me/${item.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `⚽ *Kamil FC Rush Alert:* Your squad *${item.squadName}* is up next for ${item.sport}! Head to the pitch gate now.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white border border-[#E6E7E5] text-[#176B3A] hover:border-[#176B3A] transition-colors"
                      title="Notify on WhatsApp"
                    >
                      <WhatsappLogo className="w-4 h-4" weight="duotone" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleRemoveQueue(item.id)}
                      className="p-2 rounded-lg bg-white border border-[#E6E7E5] text-[#5C6B64] hover:text-[#E94A10] cursor-pointer"
                      title="Remove from queue"
                    >
                      <Trash className="w-4 h-4" weight="duotone" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
