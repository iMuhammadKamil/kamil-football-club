import { NextResponse } from "next/server";

export interface RushQueueItem {
  id: string;
  squadName: string;
  phone: string;
  sport: string;
  preferredSlot: string;
  waitingMins: number;
  status: "WAITING" | "ASSIGNED";
}

export interface RushControlsState {
  peakSurgeActive: boolean;
  bufferEnforced: boolean;
  walkInsPaused: boolean;
  floodlightBoost: boolean;
}

// In-memory rush state for live demo & caretaker control
let rushControls: RushControlsState = {
  peakSurgeActive: true,
  bufferEnforced: true,
  walkInsPaused: false,
  floodlightBoost: true,
};

let rushQueue: RushQueueItem[] = [
  {
    id: "RQ-101",
    squadName: "F-11 Falcons",
    phone: "0321-5544332",
    sport: "7v7 Turf",
    preferredSlot: "20:00 - 21:00",
    waitingMins: 8,
    status: "WAITING",
  },
  {
    id: "RQ-102",
    squadName: "Padel Strikers",
    phone: "0300-8877661",
    sport: "Padel",
    preferredSlot: "21:00 - 22:00",
    waitingMins: 14,
    status: "WAITING",
  },
  {
    id: "RQ-103",
    squadName: "Margalla XI",
    phone: "0333-1122990",
    sport: "11v11 Stadium",
    preferredSlot: "22:00 - 23:00",
    waitingMins: 4,
    status: "WAITING",
  },
];

const PITCH_LOADS = [
  { id: "p-a", name: "Pitch A · 7v7 FIFA Turf", occupancy: 92, nextFree: "22:00", status: "PEAK_RUSH" },
  { id: "p-b", name: "Pitch B · 5v5 Cage", occupancy: 76, nextFree: "21:00", status: "FILLING_FAST" },
  { id: "p-c", name: "Padel Court 1 · Panoramic", occupancy: 84, nextFree: "21:00", status: "PEAK_RUSH" },
  { id: "p-d", name: "Full 11v11 Stadium", occupancy: 55, nextFree: "20:00", status: "OPEN" },
];

export async function GET() {
  return NextResponse.json({
    controls: rushControls,
    queue: rushQueue,
    pitches: PITCH_LOADS,
    avgOccupancy: Math.round(PITCH_LOADS.reduce((acc, p) => acc + p.occupancy, 0) / PITCH_LOADS.length),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "TOGGLE_CONTROL") {
      const key = body.key as keyof RushControlsState;
      if (key in rushControls) {
        rushControls = { ...rushControls, [key]: Boolean(body.value) };
      }
      return NextResponse.json({ success: true, controls: rushControls });
    }

    if (action === "JOIN_QUEUE") {
      const { squadName, phone, sport, preferredSlot } = body;
      if (!squadName || !phone) {
        return NextResponse.json({ error: "Squad name and phone are required." }, { status: 400 });
      }
      const item: RushQueueItem = {
        id: `RQ-${Math.floor(100 + Math.random() * 900)}`,
        squadName: String(squadName).trim(),
        phone: String(phone).trim(),
        sport: sport || "7v7 Turf",
        preferredSlot: preferredSlot || "Next Open Slot",
        waitingMins: 1,
        status: "WAITING",
      };
      rushQueue = [item, ...rushQueue];
      return NextResponse.json({ success: true, item, queue: rushQueue });
    }

    if (action === "ASSIGN_SLOT") {
      const { id } = body;
      rushQueue = rushQueue.map((q) => (q.id === id ? { ...q, status: "ASSIGNED" } : q));
      return NextResponse.json({ success: true, queue: rushQueue });
    }

    if (action === "REMOVE_QUEUE") {
      const { id } = body;
      rushQueue = rushQueue.filter((q) => q.id !== id);
      return NextResponse.json({ success: true, queue: rushQueue });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
