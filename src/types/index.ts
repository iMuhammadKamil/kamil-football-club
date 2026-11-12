export type SportType =
  | "FOOTBALL_5A_SIDE"
  | "FOOTBALL_7A_SIDE"
  | "FOOTBALL_11A_SIDE"
  | "PADEL"
  | "CRICKET_HARDBALL"
  | "CRICKET_TAPEBALL"
  | "BADMINTON"
  | "TABLE_TENNIS"
  | "RUNNING_TRACK";

export type SlotStatus = "AVAILABLE" | "HOLD_LOCKED" | "BOOKED" | "MAINTENANCE";

export type PaymentMethod = "RAAST_QR" | "JAZZCASH" | "EASYPAISA" | "CASH_ON_ARRIVAL";

export type PaymentStatus = "PENDING_VERIFICATION" | "PARTIALLY_PAID" | "PAID" | "CANCELLED";

export interface Pitch {
  id: string;
  name: string;
  sportType: SportType;
  surfaceType: string;
  dimensions?: string;
  pricePerHour: number;
}

export interface GroundVenue {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  city: "Karachi" | "Lahore" | "Islamabad" | "Rawalpindi";
  area: string;
  address: string;
  lat: number;
  lng: number;
  featuredImg: string;
  images: string[];
  amenities: string[];
  rating: number;
  reviewCount: number;
  pitches: Pitch[];
}

export interface TimeSlot {
  id: string;
  pitchId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "20:00"
  endTime: string; // "21:00"
  price: number;
  status: SlotStatus;
  holdExpiresAt?: string | null;
}

export interface AddOnItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

export interface SquadPlayer {
  id: string;
  name: string;
  phone?: string;
  shareAmount: number;
  isPaid: boolean;
  paidAt?: string;
}

export interface BookingDetails {
  id: string;
  pinCode: string;
  ground: GroundVenue;
  pitch: Pitch;
  slot: TimeSlot;
  totalAmount: number;
  depositAmount: number;
  remainingAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  addOns: { addOn: AddOnItem; quantity: number }[];
  squadSplits: SquadPlayer[];
  createdAt: string;
  captainName: string;
  captainPhone: string;
  raastIban?: string;
}

