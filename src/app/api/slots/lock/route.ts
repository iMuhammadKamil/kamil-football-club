import { NextRequest, NextResponse } from "next/server";

// Global singleton lock store so HMR in dev does not wipe active 10-min slot holds
interface LockEntry {
  slotId: string;
  lockedByPhone: string;
  holdExpiresAt: number; // epoch ms
  status: "HOLD_LOCKED" | "AWAITING_VERIFICATION";
  transactionRef?: string;
}

const globalForLocks = globalThis as unknown as {
  kfcSlotLocks: Map<string, LockEntry> | undefined;
};

const memoryLockTable: Map<string, LockEntry> =
  globalForLocks.kfcSlotLocks ?? new Map<string, LockEntry>();

if (process.env.NODE_ENV !== "production") {
  globalForLocks.kfcSlotLocks = memoryLockTable;
}

function pruneExpiredLocks() {
  const now = Date.now();
  memoryLockTable.forEach((entry, key) => {
    if (entry.holdExpiresAt <= now) {
      memoryLockTable.delete(key);
    }
  });
}

export async function GET() {
  pruneExpiredLocks();
  return NextResponse.json({
    success: true,
    locks: Array.from(memoryLockTable.values()),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slotId, phone, action, transactionRef } = body;

    if (!slotId) {
      return NextResponse.json({ error: "Missing slotId" }, { status: 400 });
    }

    pruneExpiredLocks();
    const now = Date.now();
    const existing = memoryLockTable.get(slotId);

    // ACTION: RELEASE LOCK
    if (action === "RELEASE") {
      memoryLockTable.delete(slotId);
      return NextResponse.json({ success: true, message: "Slot lock released." });
    }

    // ACTION: SUBMIT PROOF / TRX REF -> Extend to Awaiting Verification (30 mins grace)
    if (action === "SUBMIT_PROOF") {
      if (!existing || existing.holdExpiresAt < now) {
        return NextResponse.json(
          { error: "Slot hold expired before payment proof was submitted." },
          { status: 409 }
        );
      }

      const updatedEntry: LockEntry = {
        ...existing,
        status: "AWAITING_VERIFICATION",
        holdExpiresAt: now + 30 * 60 * 1000,
        transactionRef: transactionRef || "PENDING_MANUAL_CHECK",
      };
      memoryLockTable.set(slotId, updatedEntry);

      return NextResponse.json({
        success: true,
        status: "AWAITING_VERIFICATION",
        holdExpiresAt: new Date(updatedEntry.holdExpiresAt).toISOString(),
        message: "Payment proof attached. Slot secured under 30-min caretaker verification window.",
      });
    }

    // ACTION: ATOMIC HOLD LOCK (10 mins)
    if (existing && existing.holdExpiresAt > now && existing.lockedByPhone !== (phone || "ANONYMOUS")) {
      const secondsLeft = Math.ceil((existing.holdExpiresAt - now) / 1000);
      return NextResponse.json(
        {
          error: "Slot is currently locked by another captain.",
          secondsRemaining: secondsLeft,
        },
        { status: 409 }
      );
    }

    const holdExpiresAt = now + 10 * 60 * 1000;
    const newEntry: LockEntry = {
      slotId,
      lockedByPhone: phone || "ANONYMOUS",
      holdExpiresAt,
      status: "HOLD_LOCKED",
    };
    memoryLockTable.set(slotId, newEntry);

    return NextResponse.json({
      success: true,
      status: "HOLD_LOCKED",
      holdExpiresAt: new Date(holdExpiresAt).toISOString(),
      durationSeconds: 600,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process slot lock" }, { status: 500 });
  }
}
