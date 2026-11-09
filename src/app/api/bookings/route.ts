import { NextRequest, NextResponse } from "next/server";
import { generatePinCode } from "@/lib/utils";
import { sendWhatsAppNotification } from "@/lib/notifications";
import { bookingStore, addBookingToStore } from "@/lib/bookingStore";

export async function GET() {
  return NextResponse.json({
    success: true,
    bookings: bookingStore,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      groundId,
      groundName,
      pitchName,
      slotDate,
      slotTime,
      totalAmount,
      depositAmount,
      captainName,
      captainPhone,
      paymentMethod,
      squadMembers,
    } = body;

    if (!groundId || !captainName || !captainPhone || !slotDate || !slotTime) {
      return NextResponse.json({ error: "Missing required booking fields" }, { status: 400 });
    }

    const pinCode = generatePinCode();
    const bookingId = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
    const deposit = depositAmount !== undefined ? depositAmount : Math.round(totalAmount * 0.3);
    const remainingAmount = paymentMethod === "CASH_ON_ARRIVAL" ? totalAmount : totalAmount - deposit;

    const newRecord = {
      id: bookingId,
      pinCode,
      captainName,
      captainPhone,
      groundId,
      venueName: groundName || "Kamil FC Arena",
      pitchName: pitchName || "Main Pitch",
      slotTime,
      slotDate,
      totalAmount,
      depositAmount: paymentMethod === "CASH_ON_ARRIVAL" ? 0 : deposit,
      cashDue: remainingAmount,
      paymentMethod: paymentMethod || "RAAST_QR",
      paymentStatus: paymentMethod === "CASH_ON_ARRIVAL" ? "PARTIALLY_PAID" : "PENDING_VERIFICATION",
      checkInStatus: "PENDING" as const,
      createdAt: new Date().toISOString(),
      squadSplits: squadMembers && squadMembers.length > 0
        ? squadMembers.map((m: string) => ({
            name: m,
            share: Math.ceil(totalAmount / (squadMembers.length + 1)),
            isPaid: false,
          }))
        : undefined,
    };

    // Save directly to server singleton store!
    addBookingToStore(newRecord);

    // Dispatch official WhatsApp confirmation with 4-digit PIN
    const dispatch = await sendWhatsAppNotification({
      toPhone: captainPhone,
      template: "BOOKING_CONFIRMED",
      data: {
        venueName: groundName || "Kamil FC Arena",
        pitchName: pitchName || "Main Stadium",
        date: slotDate,
        time: slotTime,
        pinCode,
        totalAmount,
        cashDue: remainingAmount,
      },
    });

    return NextResponse.json({
      success: true,
      booking: newRecord,
      whatsappNotification: {
        dispatched: dispatch.success,
        preview: dispatch.previewText,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create booking" }, { status: 500 });
  }
}
