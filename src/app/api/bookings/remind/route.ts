import { NextRequest, NextResponse } from "next/server";
import { sendWhatsAppNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      bookingId,
      captainName,
      captainPhone,
      phone,
      venueName,
      pitchName,
      slotTime,
      pinCode,
      remainingAmount,
      address,
    } = body;

    const targetPhone = captainPhone || phone;

    if (!targetPhone || !pinCode) {
      return NextResponse.json({ error: "Missing required booking details for reminder" }, { status: 400 });
    }

    const dispatch = await sendWhatsAppNotification({
      toPhone: targetPhone,
      template: "PRE_MATCH_2HR_REMINDER",
      data: {
        captainName: captainName || "Team Captain",
        venueName: venueName || "POPO FC Ground (F-11/2 Islamabad)",
        pitchName: pitchName || "POPO Main 7-a-Side Turf",
        time: slotTime || "20:00 - 20:50",
        pinCode,
        cashDue: remainingAmount || 0,
        address: address || "78 Street 24, F-11/2 Multipurpose Ground, Islamabad",
      },
    });

    return NextResponse.json({
      success: true,
      broadcastId: dispatch.messageId,
      preview: dispatch.previewText,
      message: `2-Hour match reminder broadcasted to ${targetPhone} via WhatsApp.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to broadcast reminder" }, { status: 500 });
  }
}

