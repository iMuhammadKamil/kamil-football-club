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
      captainName: "Hamza Tariq (Karachi Strikers)",
      captainPhone: "0321-4455667",
      groundId: "kamil-fc-arena",
      venueName: "Kamil FC Mega Sports Complex",
      pitchName: "Main Stadium (11-a-Side)",
      slotTime: "20:00 - 20:50 (10m Buffer)",
      slotDate: new Date().toISOString().split("T")[0],
      totalAmount: 14000,
      depositAmount: 4200,
      cashDue: 9800,
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
      groundId: "kamil-fc-arena",
      venueName: "Kamil FC Mega Sports Complex",
      pitchName: "Padel Court 1 (Panoramic)",
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
      groundId: "kamil-fc-arena",
      venueName: "Kamil FC Mega Sports Complex",
      pitchName: "The Cage Alpha (7-a-Side)",
      slotTime: "22:00 - 22:50 (10m Buffer)",
      slotDate: new Date().toISOString().split("T")[0],
      totalAmount: 6000,
      depositAmount: 1800,
      cashDue: 4200,
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

