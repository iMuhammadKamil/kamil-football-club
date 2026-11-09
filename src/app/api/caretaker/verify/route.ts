import { NextRequest, NextResponse } from "next/server";
import { sendWhatsAppNotification } from "@/lib/notifications";
import { bookingStore, findBookingByPin, updateBookingCheckIn, addBookingToStore } from "@/lib/bookingStore";

export async function GET() {
  return NextResponse.json({
    success: true,
    bookings: bookingStore,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, pinCode, customerPhone, amountCollected, pitchId, caretakerId, captainName, unpaidAmount } = body;

    // ACTION: 4-DIGIT PIN CHECK-IN
    if (action === "VERIFY_PIN") {
      if (!pinCode || pinCode.length !== 4) {
        return NextResponse.json({ error: "Invalid 4-digit PIN" }, { status: 400 });
      }

      const existingBooking = findBookingByPin(pinCode);
      if (!existingBooking) {
        return NextResponse.json({
          error: `No booking found with PIN ${pinCode}. Please verify with captain.`,
        }, { status: 404 });
      }

      const updated = updateBookingCheckIn(pinCode);

      const auditLog = {
        actionType: "CHECKIN_VERIFIED",
        pinCode,
        caretakerId: caretakerId || "CARETAKER_CHAHA_1",
        verifiedAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        booking: updated,
        auditLog,
        message: `PIN ${pinCode} verified successfully for ${existingBooking.captainName}! Pitch access granted.`,
      });
    }

    // ACTION: ANTI-THEFT WALK-IN BLOCKER
    if (action === "BLOCK_WALK_IN") {
      if (!customerPhone || customerPhone.trim().length < 10) {
        return NextResponse.json(
          { error: "Owner Anti-Theft Policy: A valid 11-digit customer mobile number is mandatory for walk-in bookings." },
          { status: 422 }
        );
      }

      const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();
      const finalAmount = amountCollected || 4500;
      const walkInBooking = {
        id: `WALK-${Math.floor(1000 + Math.random() * 9000)}`,
        pinCode: generatedPin,
        captainName: `Walk-In (${customerPhone})`,
        captainPhone: customerPhone,
        groundId: "kamil-fc-arena",
        venueName: "Kamil FC Mega Sports Complex",
        pitchName: pitchId || "Speed Arena (5-a-Side)",
        slotTime: "Current Tonight Slot",
        slotDate: new Date().toISOString().split("T")[0],
        totalAmount: finalAmount,
        depositAmount: finalAmount,
        cashDue: 0,
        paymentMethod: "CASH_ON_ARRIVAL" as const,
        paymentStatus: "PAID",
        checkInStatus: "CHECKED_IN" as const,
        createdAt: new Date().toISOString(),
      };

      addBookingToStore(walkInBooking);

      const dispatch = await sendWhatsAppNotification({
        toPhone: customerPhone,
        template: "WALK_IN_RECEIPT",
        data: {
          caretakerName: "Chacha Tariq (Head Ground Attendant)",
          amountPaid: finalAmount,
          pitchName: pitchId || "Speed Arena (5-a-Side)",
          time: "Tonight Floodlight Slot",
          pinCode: generatedPin,
        },
      });

      const auditLog = {
        actionType: "WALK_IN_CASH_COLLECTED",
        customerPhone,
        amountCollected: finalAmount,
        pinCode: generatedPin,
        caretakerId: caretakerId || "CARETAKER_CHAHA_1",
        timestamp: new Date().toISOString(),
        receiptMessageId: dispatch.messageId,
        receiptPreview: dispatch.previewText,
      };

      return NextResponse.json({
        success: true,
        pinCode: generatedPin,
        booking: walkInBooking,
        auditLog,
        receiptDispatched: true,
        message: `Walk-In slot blocked! PIN: ${generatedPin}. Automated WhatsApp receipt sent to ${customerPhone}.`,
      });
    }

    // ACTION: ISSUE STRIKE TO DEFAULTER
    if (action === "ISSUE_STRIKE") {
      if (!customerPhone) {
        return NextResponse.json({ error: "Missing customerPhone" }, { status: 400 });
      }

      const dispatch = await sendWhatsAppNotification({
        toPhone: customerPhone,
        template: "STRIKE_WARNING",
        data: {
          captainName: captainName || "Team Captain",
          unpaidAmount: unpaidAmount || 3000,
          venueName: "Kamil FC Mega Sports Complex",
          strikeCount: 1,
        },
      });

      return NextResponse.json({
        success: true,
        strikeIssued: true,
        alertSent: dispatch.previewText,
        message: `Strike 1 warning sent to ${customerPhone}. Account marked in Khata defaulter watch.`,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
