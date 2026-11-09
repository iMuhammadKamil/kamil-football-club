import { NextRequest, NextResponse } from "next/server";
import { sendWhatsAppNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      groundId,
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
      const dispatch = await sendWhatsAppNotification({
        toPhone: ownerPhone || "0300-9988776",
        template: "FRAUD_ALERT",
        data: {
          venueName: "Kamil FC Mega Sports Complex",
          caretakerName: caretakerName || "Chacha Tariq",
          expected: expectedCash,
          collected: actualCashCounted,
          shortage: absDiscrepancy,
        },
      });

      alertPreview =
        `🚨 *KAMIL FC CASH SHORTAGE AUDIT ALERT*\n` +
        `Venue: Kamil FC Mega Sports Complex\n` +
        `Shift Handover: ${caretakerName}\n` +
        `Expected Cash: Rs. ${expectedCash}\n` +
        `Cash Handed Over: Rs. ${actualCashCounted}\n` +
        `⚠️ *CASH SHORTAGE:* -Rs. ${absDiscrepancy} (Exceeds Rs. 500 audit limit)\n` +
        `Shift closed at: ${new Date().toLocaleTimeString("en-PK")}`;
    }

    return NextResponse.json({
      success: true,
      shiftRecord: {
        id: `SHIFT-${Date.now()}`,
        caretakerName,
        expectedCash,
        actualCashCounted,
        discrepancy,
        status: alertTriggered && isShortage ? "AUDIT_FLAGGED" : "CLEARED",
        closedAt: new Date().toISOString(),
        shiftNotes: shiftNotes || "Night floodlight shift",
      },
      alertTriggered,
      alertPreview,
      message: alertTriggered
        ? `Shift logged with variance (-Rs. ${absDiscrepancy}). Owner WhatsApp alert dispatched.`
        : "Shift reconciliation balanced and cleared successfully.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process reconciliation" }, { status: 500 });
  }
}

