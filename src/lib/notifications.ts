// Simulated WhatsApp and SMS notification dispatch engine for Pakistan
export interface WhatsAppNotificationPayload {
  toPhone: string;
  template:
    | "BOOKING_CONFIRMED"
    | "SQUAD_PAY_INVITE"
    | "WALK_IN_RECEIPT"
    | "FRAUD_ALERT"
    | "STRIKE_WARNING"
    | "PRE_MATCH_2HR_REMINDER";
  data: Record<string, any>;
}

export async function sendWhatsAppNotification(payload: WhatsAppNotificationPayload): Promise<{
  success: boolean;
  messageId: string;
  previewText: string;
}> {
  let previewText = "";
  const msgId = `WA-MSG-${Date.now()}`;

  switch (payload.template) {
    case "PRE_MATCH_2HR_REMINDER":
      previewText =
        `⏰ *2-HOUR MATCH REMINDER — KAMIL FC*\n` +
        `Dear Captain ${payload.data.captainName},\n` +
        `Your match kicks off in 2 hours!\n` +
        `🏟️ Venue: *${payload.data.venueName}*\n` +
        `🌱 Pitch: *${payload.data.pitchName}*\n` +
        `⏰ Time: *${payload.data.time}* (50m Play + 10m Buffer)\n` +
        `🔑 Caretaker Check-In PIN: *${payload.data.pinCode}*\n` +
        `💰 Remaining Cash Due: *Rs. ${payload.data.cashDue}*\n` +
        `📍 Google Maps Pin: https://maps.google.com/?q=${encodeURIComponent(payload.data.address || "DHA Phase 6 Karachi")}\n` +
        `👟 *Footwear Rule:* Rubber studs (TF) and indoor trainers only. Metal screw-in cleats strictly prohibited.\n` +
        `Please arrive 15 minutes before kickoff!`;
      break;

    case "BOOKING_CONFIRMED":
      previewText =
        `⚽ *KAMIL FC BOOKING CONFIRMED!*\n` +
        `🏟️ Venue: ${payload.data.venueName}\n` +
        `🌱 Pitch: ${payload.data.pitchName}\n` +
        `📅 Date: ${payload.data.date}\n` +
        `⏰ Time: ${payload.data.time} (50m Play + 10m Buffer)\n` +
        `🔑 Caretaker Check-In PIN: *${payload.data.pinCode}*\n` +
        `💰 Total: Rs. ${payload.data.totalAmount} (Cash Due at Pitch: Rs. ${payload.data.cashDue})\n` +
        `⚠️ Show this 4-digit PIN to the ground caretaker under the floodlights.`;
      break;

    case "WALK_IN_RECEIPT":
      previewText =
        `🧾 *KAMIL FC OFFICIAL CASH RECEIPT*\n` +
        `Caretaker: ${payload.data.caretakerName}\n` +
        `Amount Paid: *Rs. ${payload.data.amountPaid}*\n` +
        `Pitch: ${payload.data.pitchName}\n` +
        `Time: ${payload.data.time}\n` +
        `PIN: ${payload.data.pinCode}\n` +
        `🛡️ *Anti-Theft Security:* If you were charged more than Rs. ${payload.data.amountPaid}, report fraud to Kamil FC HQ immediately at 0300-KAMIL-FC.`;
      break;

    case "STRIKE_WARNING":
      previewText =
        `⚠️ *KAMIL FC ACCOUNT WARNING (Strike ${payload.data.strikeCount}/2)*\n` +
        `Dear ${payload.data.captainName}, your team had an unpaid balance of Rs. ${payload.data.unpaidAmount} at ${payload.data.venueName}.\n` +
        `Please clear your Khata within 24 hours to avoid a nationwide booking blacklist.`;
      break;

    case "SQUAD_PAY_INVITE":
      previewText =
        `⚡ *KFC SQUAD PAY: MATCH SHARE INVITATION*\n` +
        `Captain ${payload.data.captainName} booked ${payload.data.venueName} (${payload.data.time}).\n` +
        `Your Share: *Rs. ${payload.data.shareAmount}*\n` +
        `Pay to Captain Raast: *${payload.data.raastIban}*\n` +
        `Join Squad: https://kamilfc.pk/squad/${payload.data.bookingId}`;
      break;

    case "FRAUD_ALERT":
      previewText =
        `🚨 *KAMIL FC CASH SHORTAGE AUDIT ALERT*\n` +
        `Venue: ${payload.data.venueName}\n` +
        `Caretaker: ${payload.data.caretakerName}\n` +
        `Expected: Rs. ${payload.data.expected}\n` +
        `Collected: Rs. ${payload.data.collected}\n` +
        `Shortage: -Rs. ${payload.data.shortage}`;
      break;
  }

  console.log(`[WhatsApp Dispatch to ${payload.toPhone}]:\n${previewText}\n-------------------`);

  return {
    success: true,
    messageId: msgId,
    previewText,
  };
}
