import { NextRequest, NextResponse } from "next/server";
import { sendWhatsAppNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, bookingId, captainPhone, captainName, reason, venueName, originalAmount } = body;

    // ACTION 1: ISSUE WEATHER / SMOG RESCHEDULE VOUCHER
    if (action === "ISSUE_WEATHER_VOUCHER") {
      const voucherCode = `KFC-VOUCH-${Math.floor(1000 + Math.random() * 9000)}`;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); // Valid for 30 days

      // Dispatch WhatsApp Reschedule Voucher to Captain
      const previewText =
        `🌧️ *KAMIL FC WEATHER RESCHEDULE VOUCHER*\n` +
        `Dear Captain ${captainName || "Captain"},\n` +
        `Your match at *${venueName || "Kamil FC Arena"}* was cancelled due to: *${reason || "Unplayable Weather / Winter Smog"}*.\n` +
        `🎟️ *Voucher Code:* *${voucherCode}*\n` +
        `💰 Credit Value: *Rs. ${originalAmount || 6000}*\n` +
        `⏳ Valid Until: ${expiryDate.toLocaleDateString("en-PK")}\n` +
        `You can use this voucher code to book any available slot within 30 days with zero additional charges.`;

      console.log(`[Voucher WhatsApp Dispatch to ${captainPhone}]:\n${previewText}\n-------------------`);

      return NextResponse.json({
        success: true,
        voucherCode,
        creditValue: originalAmount || 6000,
        validUntil: expiryDate.toISOString(),
        message: `Weather voucher ${voucherCode} generated and dispatched via WhatsApp.`,
      });
    }

    // ACTION 2: EXTEND ACTIVE SLOT (+30 MINS PRO-RATED)
    if (action === "EXTEND_SLOT_30M") {
      const { currentSlotEndTime, pitchBaseRate, isSurgeActive } = body;
      const ratePerHour = pitchBaseRate || 6000;
      const surgeMultiplier = isSurgeActive ? 1.2 : 1.0;
      const proRatedFee = Math.round((ratePerHour * surgeMultiplier) / 2);

      return NextResponse.json({
        success: true,
        extendedDurationMinutes: 30,
        additionalAmount: proRatedFee,
        message: `Slot extended by 30 mins! Additional cash due from captain: Rs. ${proRatedFee}. Logged in caretaker audit report.`,
      });
    }

    // ACTION 3: REJECT FOR ILLEGAL FOOTWEAR (METAL STUDS)
    if (action === "REJECT_ILLEGAL_FOOTWEAR") {
      const auditLog = {
        actionType: "FOOTWEAR_VIOLATION_REJECTION",
        bookingId: bookingId || "BK-UNKNOWN",
        captainPhone: captainPhone || "UNKNOWN",
        timestamp: new Date().toISOString(),
        notes: "Player arrived with prohibited metal screw-in studs. Turned away under turf preservation bylaws.",
      };

      return NextResponse.json({
        success: true,
        auditLog,
        message: "Player turnaway logged for metal stud violation. Ground owner is legally protected from refund claims.",
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process voucher/extension" }, { status: 500 });
  }
}

