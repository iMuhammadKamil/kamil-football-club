import { BookingDetails, TimeSlot, GroundVenue, Pitch, PaymentMethod } from "@/types";

export interface StoredBooking {
  id: string;
  pinCode: string;
  captainName: string;
  captainPhone: string;
  groundId: string;
  venueName: string;
  pitchName: string;
  slotTime: string;
  slotDate: string;
  totalAmount: number;
  depositAmount: number;
  cashDue: number;
  paymentMethod: PaymentMethod;
  paymentStatus: string;
  checkInStatus: "PENDING" | "CHECKED_IN" | "NO_SHOW";
  createdAt: string;
  squadSplits?: { name: string; share: number; isPaid: boolean }[];
}

// Global server singleton store
const globalForBookings = globalThis as unknown as {
  kfcBookings: StoredBooking[] | undefined;
};

export const bookingStore: StoredBooking[] =
  globalForBookings.kfcBookings ?? [
    {
      id: "BK-829104",
      pinCode: "4821",
      captainName: "Hamza Tariq (Islamabad Strikers)",
      captainPhone: "0321-4455667",
      groundId: "popo-fc-f11-islamabad",
      venueName: "POPO FC Ground (F-11/2)",
      pitchName: "POPO Main 7-a-Side Turf",
      slotTime: "20:00 - 20:50 (10m Buffer)",
      slotDate: new Date().toISOString().split("T")[0],
      totalAmount: 5500,
      depositAmount: 1650,
      cashDue: 3850,
      paymentMethod: "RAAST_QR",
      paymentStatus: "PARTIALLY_PAID",
      checkInStatus: "PENDING",
      createdAt: new Date().toISOString(),
    },
    {
      id: "BK-918233",
      pinCode: "7139",
      captainName: "Bilal Sheikh (Padel Kings)",
      captainPhone: "0300-8877665",
      groundId: "legends-arena-dha5-karachi",
      venueName: "Legends Arena (DHA Phase 5)",
      pitchName: "Legends Padel Court 1 (Panoramic)",
      slotTime: "21:00 - 21:50 (10m Buffer)",
      slotDate: new Date().toISOString().split("T")[0],
      totalAmount: 5500,
      depositAmount: 5500,
      cashDue: 0,
      paymentMethod: "RAAST_QR",
      paymentStatus: "PAID",
      checkInStatus: "CHECKED_IN",
      createdAt: new Date().toISOString(),
    },
    {
      id: "BK-445129",
      pinCode: "2490",
      captainName: "Danish Khan",
      captainPhone: "0333-1122334",
      groundId: "vibrant-fc-dha-rawalpindi",
      venueName: "Vibrant Football Academy (DHA Phase 1)",
      pitchName: "DHA Sector D Pitch (7-a-Side)",
      slotTime: "22:00 - 22:50 (10m Buffer)",
      slotDate: new Date().toISOString().split("T")[0],
      totalAmount: 5200,
      depositAmount: 1560,
      cashDue: 3640,
      paymentMethod: "RAAST_QR",
      paymentStatus: "PARTIALLY_PAID",
      checkInStatus: "PENDING",
      createdAt: new Date().toISOString(),
    },
  ];

if (process.env.NODE_ENV !== "production") {
  globalForBookings.kfcBookings = bookingStore;
}

export function addBookingToStore(booking: StoredBooking) {
  bookingStore.unshift(booking);
  return booking;
}

export function findBookingByPin(pin: string) {
  return bookingStore.find((b) => b.pinCode === pin);
}

export function updateBookingCheckIn(pin: string) {
  const b = bookingStore.find((x) => x.pinCode === pin);
  if (b) {
    b.checkInStatus = "CHECKED_IN";
    b.cashDue = 0;
    return b;
  }
  return null;
}

