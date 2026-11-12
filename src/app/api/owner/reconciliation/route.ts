import { NextRequest, NextResponse } from "next/server";
import { sendWhatsAppNotification } from "@/lib/notifications";

export interface ShiftAuditRecord {
  id: string;
  caretaker: string;
  date: string;
  expected: number;
  actual: number;
  diff: number;
  status: "CLEARED" | "AUDIT_FLAGGED";
  alertDispatched?: boolean;
  shiftNotes?: string;
}

const globalForShifts = globalThis as unknown as {
  kfcShiftAudits: ShiftAuditRecord[] | undefined;
};

const shiftAuditStore: ShiftAuditRecord[] = globalForShifts.kfcShiftAudits ?? [
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

if (process.env.NODE_ENV !== "production") {
  globalForShifts.kfcShiftAudits = shiftAuditStore;
}

export async function GET() {
  return NextResponse.json({ success: true, shifts: shiftAuditStore });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      caretakerName,
      expectedCash,
      actualCashCounted,
      ownerPhone,
      shiftNotes,
    } = body;

    const discrepancy = actualCashCounted - expectedCash;
    const isShortage = discrepancy < 0;
    const absDiscrepancy = Math.abs(discrepancy);
    const alertTriggered = absDiscrepancy > 500;

    let alertPreview = "";

    // If shortage exceeds Rs. 500 threshold, send high-priority alert to Ground Owner
    if (alertTriggered && isShortage) {
      await sendWhatsAppNotification({
        toPhone: ownerPhone || "0300-9988776",
        template: "FRAUD_ALERT",
        data: {
          venueName: "Karachi United Football Stadium (Clifton)",
          caretakerName: caretakerName || "Chacha Tariq",
          expected: expectedCash,
          collected: actualCashCounted,
          shortage: absDiscrepancy,
        },
      });

      alertPreview =
        `🚨 *KAMIL FC CASH SHORTAGE AUDIT ALERT*\n` +
        `Venue: Karachi United Football Stadium (Clifton)\n` +
        `Shift Handover: ${caretakerName}\n` +
        `Expected Cash: Rs. ${expectedCash}\n` +
        `Cash Handed Over: Rs. ${actualCashCounted}\n` +
        `⚠️ *CASH SHORTAGE:* -Rs. ${absDiscrepancy} (Exceeds Rs. 500 audit limit)\n` +
        `Shift closed at: ${new Date().toLocaleTimeString("en-PK")}`;
    }

    const shiftId = `SHIFT-${Date.now().toString().slice(-4)}`;
    const status = alertTriggered && isShortage ? "AUDIT_FLAGGED" : "CLEARED";

    shiftAuditStore.unshift({
      id: shiftId,
      caretaker: caretakerName || "Chacha Tariq",
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      expected: expectedCash,
      actual: actualCashCounted,
      diff: discrepancy,
      status,
      alertDispatched: alertTriggered && isShortage,
      shiftNotes: shiftNotes || "Night floodlight shift",
    });

    return NextResponse.json({
      success: true,
      shiftRecord: {
        id: shiftId,
        caretakerName,
        expectedCash,
        actualCashCounted,
        discrepancy,
        status,
        closedAt: new Date().toISOString(),
        shiftNotes: shiftNotes || "Night floodlight shift",
      },
      alertTriggered: alertTriggered && isShortage,
      alertPreview,
      message:
        alertTriggered && isShortage
          ? `Shift logged with variance (-Rs. ${absDiscrepancy}). Owner WhatsApp alert dispatched.`
          : "Shift reconciliation balanced and cleared successfully.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process reconciliation" }, { status: 500 });
  }
}

