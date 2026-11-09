import { TimeSlot, BookingDetails, GroundVenue, Pitch, AddOnItem, SquadPlayer, PaymentMethod } from "@/types";
import { generatePinCode } from "@/lib/utils";

// Linked Pitch Relationship: 11-a-side main stadium encompasses sub-cages
export const LINKED_PITCH_MAP: Record<string, string[]> = {
  "kamil-11-side": ["kamil-7-side-a", "kamil-5-side"],
  "legends-11-side": ["legends-7-side", "legends-cricket-net1"],
};

// Check if a given date string is a weekend in Pakistan (Friday night, Saturday, Sunday)
export function isWeekendInPakistan(dateStr: string): boolean {
  const d = new Date(dateStr);
  const day = d.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
  return day === 0 || day === 5 || day === 6;
}

// Generate slot times for a given day with Peak, Off-Peak, and Dynamic Weekend Surges
export function generateDaySlots(
  pitchId: string,
  dateStr: string,
  pricePerHour: number,
  linkedBookedPitchIds: string[] = []
): (TimeSlot & { surgeMultiplier?: number; surgeLabel?: string })[] {
  const isWeekend = isWeekendInPakistan(dateStr);

  const times = [
    { start: "06:00", end: "06:50", offPeak: true },
    { start: "07:00", end: "07:50", offPeak: true },
    { start: "08:00", end: "08:50", offPeak: true },
    { start: "16:00", end: "16:50", offPeak: true },
    { start: "17:00", end: "17:50", offPeak: false },
    { start: "18:00", end: "18:50", offPeak: false },
    { start: "19:00", end: "19:50", offPeak: false },
    { start: "20:00", end: "20:50", offPeak: false, primeTime: true },
    { start: "21:00", end: "21:50", offPeak: false, primeTime: true },
    { start: "22:00", end: "22:50", offPeak: false, primeTime: true },
    { start: "23:00", end: "23:50", offPeak: false, primeTime: true },
    { start: "00:00", end: "00:50", offPeak: false, primeTime: true },
    { start: "01:00", end: "01:50", offPeak: false },
  ];

  return times.map((t, idx) => {
    // Check if a linked pitch conflict exists (e.g. parent 11-a-side booked, so sub-pitch is locked)
    const isParentConflict = linkedBookedPitchIds.includes(pitchId);

    // Realistic demo status
    const isBooked = isParentConflict || ((idx === 7 || idx === 8) && dateStr === new Date().toISOString().split("T")[0]);
    const isLocked = idx === 9 && dateStr === new Date().toISOString().split("T")[0];

    // Dynamic Pricing Engine
    let finalPrice = pricePerHour;
    let surgeMultiplier = 1.0;
    let surgeLabel = undefined;

    if (isWeekend && t.primeTime) {
      surgeMultiplier = 1.2; // +20% Weekend Prime-Time Surge
      finalPrice = Math.round(pricePerHour * surgeMultiplier);
      surgeLabel = "Weekend Prime (+20%)";
    } else if (t.offPeak) {
      surgeMultiplier = 0.8; // -20% Off-Peak Discount
      finalPrice = Math.round(pricePerHour * surgeMultiplier);
      surgeLabel = "Off-Peak (-20%)";
    }

    return {
      id: `${pitchId}-${dateStr}-${t.start.replace(":", "")}`,
      pitchId,
      date: dateStr,
      startTime: t.start,
      endTime: t.end,
      price: finalPrice,
      status: isBooked ? "BOOKED" : isLocked ? "HOLD_LOCKED" : "AVAILABLE",
      holdExpiresAt: isLocked ? new Date(Date.now() + 6 * 60 * 1000).toISOString() : null,
      surgeMultiplier,
      surgeLabel,
    };
  });
}

// Generate Raast P2P string for QR codes
export function generateRaastQRData(iban: string, amount: number, billRef: string): string {
  return `RAAST://PAY?IBAN=${encodeURIComponent(iban)}&AMOUNT=${amount}&REF=${billRef}&PURPOSE=KAMIL_FC_BOOKING`;
}

// Create in-memory mock booking helper
export function createMockBooking(params: {
  ground: GroundVenue;
  pitch: Pitch;
  slot: TimeSlot;
  captainName: string;
  captainPhone: string;
  paymentMethod: PaymentMethod;
  addOns: { addOn: AddOnItem; quantity: number }[];
  squadMembers?: string[];
}): BookingDetails {
  const addOnsTotal = params.addOns.reduce((acc, curr) => acc + curr.addOn.price * curr.quantity, 0);
  const totalAmount = params.slot.price + addOnsTotal;
  const depositAmount = params.paymentMethod === "CASH_ON_ARRIVAL" ? 0 : Math.round(totalAmount * 0.3);
  const remainingAmount = totalAmount - depositAmount;

  const squadNames = params.squadMembers && params.squadMembers.length > 0 
    ? [params.captainName, ...params.squadMembers]
    : [params.captainName];

  const sharePerPlayer = Math.ceil(totalAmount / squadNames.length);

  const squadSplits: SquadPlayer[] = squadNames.map((name, i) => ({
    id: `sq-${i}-${Date.now()}`,
    name,
    phone: i === 0 ? params.captainPhone : undefined,
    shareAmount: sharePerPlayer,
    isPaid: i === 0 && params.paymentMethod !== "CASH_ON_ARRIVAL",
  }));

  return {
    id: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
    pinCode: generatePinCode(),
    ground: params.ground,
    pitch: params.pitch,
    slot: params.slot,
    totalAmount,
    depositAmount,
    remainingAmount,
    paymentMethod: params.paymentMethod,
    paymentStatus: params.paymentMethod === "CASH_ON_ARRIVAL" ? "PARTIALLY_PAID" : "PENDING_VERIFICATION",
    addOns: params.addOns,
    squadSplits,
    createdAt: new Date().toISOString(),
    captainName: params.captainName,
    captainPhone: params.captainPhone,
    raastIban: "PK36MEZN0001020304050607",
  };
}
