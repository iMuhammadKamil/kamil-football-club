import { NextRequest, NextResponse } from "next/server";
import { sendWhatsAppNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      bookingId,
      captainName,
      captainPhone,
      venueName,
      pitchName,
      slotTime,
      pinCode,
      remainingAmount,
      address,
    } = body;

    if (!captainPhone || !pinCode) {
      return NextResponse.json({ error: "Missing required booking details for reminder" }, { status: 400 });
    }

    const dispatch = await sendWhatsAppNotification({
      toPhone: captainPhone,
      template: "PRE_MATCH_2HR_REMINDER",
      data: {
        captainName: captainName || "Team Captain",
        venueName: venueName || "Kamil FC Mega Sports Complex (DHA 6 Karachi)",
        pitchName: pitchName || "Main Stadium (11-a-Side)",
        time: slotTime || "20:00 - 20:50",
        pinCode,
        cashDue: remainingAmount || 0,
        address: address || "Khayaban-e-Ittehad, Phase 6 DHA Karachi",
      },
    });

    return NextResponse.json({
      success: true,
      broadcastId: dispatch.messageId,
      preview: dispatch.previewText,
      message: `2-Hour match reminder broadcasted to ${captainPhone} via WhatsApp.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to broadcast reminder" }, { status: 500 });
  }
}

