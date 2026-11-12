"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Plus, 
  Minus,
  Trash2, 
  Share2, 
  QrCode, 
  Copy, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  Flame,
  Phone,
  MessageCircle,
  Banknote,
  Zap,
  ShieldAlert,
  Tag
} from "lucide-react";
import { GroundVenue, Pitch, TimeSlot, AddOnItem, BookingDetails, PaymentMethod } from "@/types";
import { formatPKR } from "@/lib/utils";
import { generateDaySlots } from "@/lib/slotEngine";
import { ADD_ONS_LIST } from "@/data/mockVenues";

interface BookingModalProps {
  venue: GroundVenue;
  initialPitch?: Pitch;
  initialSlot?: TimeSlot;
  onClose: () => void;
  onBookingConfirmed: (booking: BookingDetails) => void;
}

export default function BookingModal({
  venue,
  initialPitch,
  initialSlot,
  onClose,
  onBookingConfirmed,
}: BookingModalProps) {
  const [step, setStep] = useState<"SLOTS" | "ADDONS_SQUAD" | "PAYMENT" | "CONFIRMED">("SLOTS");

  const [selectedPitch, setSelectedPitch] = useState<Pitch>(initialPitch || venue.pitches[0]);
  const todayStr = initialSlot ? initialSlot.date : new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(initialSlot || null);
  const selectedSlotRef = React.useRef<TimeSlot | null>(selectedSlot);
  selectedSlotRef.current = selectedSlot;

  const [holdSecondsLeft, setHoldSecondsLeft] = useState<number>(600);
  const [holdTimerActive, setHoldTimerActive] = useState<boolean>(!!initialSlot);

  const [isGeneratorActive, setIsGeneratorActive] = useState<boolean>(false);
  const generatorFee = isGeneratorActive ? 1500 : 0;

  const [selectedAddOns, setSelectedAddOns] = useState<{ [id: string]: number }>({});
  const [acceptFootwearPolicy, setAcceptFootwearPolicy] = useState<boolean>(true);

  const [voucherCodeInput, setVoucherCodeInput] = useState<string>("");
  const [voucherDiscount, setVoucherDiscount] = useState<number>(0);
  const [voucherApplied, setVoucherApplied] = useState<boolean>(false);

  const [enableSquadPay, setEnableSquadPay] = useState<boolean>(false);
  const [captainName, setCaptainName] = useState<string>("");
  const [captainPhone, setCaptainPhone] = useState<string>("");
  const [squadNames, setSquadNames] = useState<string[]>([""]);

  const [acceptCaptainLiability, setAcceptCaptainLiability] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("RAAST_QR");
  const [trxRef, setTrxRef] = useState<string>("");
  const [walletPhone, setWalletPhone] = useState<string>("");
  const [walletAuthorized, setWalletAuthorized] = useState<boolean>(false);
  const [copiedIban, setCopiedIban] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [confirmedBooking, setConfirmedBooking] = useState<BookingDetails | null>(null);
  const [holdExpiredMsg, setHoldExpiredMsg] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [voucherStatus, setVoucherStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [serverBookings, setServerBookings] = useState<any[]>([]);
  const [serverLocks, setServerLocks] = useState<{ slotId: string }[]>([]);

  useEffect(() => {
    Promise.all([fetch("/api/bookings"), fetch("/api/slots/lock")])
      .then(async ([bRes, lRes]) => {
        const bData = await bRes.json();
        const lData = await lRes.json();
        if (bData.bookings) setServerBookings(bData.bookings);
        if (lData.locks) setServerLocks(lData.locks);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const activeSlot = selectedSlotRef.current;
    const generated = generateDaySlots(selectedPitch.id, selectedDate, selectedPitch.pricePerHour).map(
      (slot) => {
        const isBookedOnServer = serverBookings.some(
          (b) =>
            b.groundId === venue.id &&
            b.pitchName === selectedPitch.name &&
            b.slotDate === selectedDate &&
            b.slotTime?.startsWith(slot.startTime)
        );
        const isLockedOnServer =
          serverLocks.some((l) => l.slotId === slot.id) && activeSlot?.id !== slot.id;
        if (isBookedOnServer) return { ...slot, status: "BOOKED" as const };
        if (isLockedOnServer && slot.status === "AVAILABLE") {
          return { ...slot, status: "HOLD_LOCKED" as const };
        }
        return slot;
      }
    );
    setSlots(generated);
    if (!initialSlot || initialSlot.pitchId !== selectedPitch.id || initialSlot.date !== selectedDate) {
      if (!activeSlot || activeSlot.pitchId !== selectedPitch.id || activeSlot.date !== selectedDate) {
        setSelectedSlot(null);
        setHoldTimerActive(false);
      }
    }
  }, [venue.id, initialSlot, selectedPitch, selectedDate, serverBookings, serverLocks]);

  useEffect(() => {
    if (!holdTimerActive) return;
    const interval = setInterval(() => {
      setHoldSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [holdTimerActive]);

  useEffect(() => {
    if (holdTimerActive && holdSecondsLeft === 0) {
      setHoldTimerActive(false);
      setSelectedSlot(null);
      setHoldSecondsLeft(600);
      setHoldExpiredMsg("Your 10-minute slot hold expired. Please reselect a slot.");
    }
  }, [holdTimerActive, holdSecondsLeft]);

  const handleSelectSlot = async (slot: TimeSlot) => {
    if (slot.status === "BOOKED") return;
    setHoldExpiredMsg(null);
    if (selectedSlot && selectedSlot.id !== slot.id) {
      fetch("/api/slots/lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId: selectedSlot.id, action: "RELEASE" }),
      }).catch(() => {});
    }
    setSelectedSlot(slot);
    setHoldSecondsLeft(600);
    setHoldTimerActive(true);

    try {
      await fetch("/api/slots/lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId: slot.id, phone: captainPhone || "CAPTAIN_APP" }),
      });
    } catch {
      console.warn("Synced locally");
    }
  };

  const handleCloseModal = () => {
    if (selectedSlot && step !== "CONFIRMED") {
      fetch("/api/slots/lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId: selectedSlot.id, action: "RELEASE" }),
      }).catch(() => {});
    }
    onClose();
  };

  const updateAddOnQty = (addOnId: string, delta: number) => {
    setSelectedAddOns((prev) => {
      const current = prev[addOnId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [addOnId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [addOnId]: next };
    });
  };

  const handleApplyVoucher = () => {
    if (voucherCodeInput.toUpperCase().includes("VOUCH")) {
      setVoucherDiscount(4500);
      setVoucherApplied(true);
      setVoucherStatus({ ok: true, text: "Voucher Applied! Rs. 4,500 credit deducted from total." });
    } else {
      setVoucherStatus({ ok: false, text: "Invalid voucher code. Example format: KFC-VOUCH-1234" });
    }
  };

  const addOnsTotal = Object.entries(selectedAddOns).reduce((acc, [id, qty]) => {
    const item = ADD_ONS_LIST.find((a) => a.id === id);
    return acc + (item ? item.price * qty : 0);
  }, 0);

  const slotPrice = selectedSlot ? selectedSlot.price : 0;
  const subTotal = slotPrice + addOnsTotal + generatorFee;
  const grandTotal = Math.max(0, subTotal - voucherDiscount);

  const validSquad = squadNames.filter((n) => n.trim().length > 0);
  const totalPlayersCount = 1 + validSquad.length;
  const perPlayerShare = Math.ceil(grandTotal / totalPlayersCount);

  // SERVER-SIDE SYNCED CONFIRMATION
  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;
    setFormError(null);
    if (!captainName.trim() || !captainPhone.trim()) {
      setFormError("Please enter Captain Name and WhatsApp Mobile Number.");
      return;
    }

    if (!acceptFootwearPolicy) {
      setFormError("Please accept the Footwear Stud Policy.");
      return;
    }

    if (!acceptCaptainLiability) {
      setFormError("Please accept the Captain Liability agreement.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Post to backend booking API
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groundId: venue.id,
          groundName: venue.name,
          pitchName: selectedPitch.name,
          slotDate: selectedSlot.date,
          slotTime: `${selectedSlot.startTime} - ${selectedSlot.endTime}`,
          totalAmount: grandTotal,
          depositAmount: paymentMethod === "CASH_ON_ARRIVAL" ? 0 : Math.round(grandTotal * 0.3),
          captainName,
          captainPhone,
          paymentMethod,
          transactionRef: trxRef || undefined,
          squadMembers: enableSquadPay ? validSquad : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create booking");
      }

      const generatedBooking: BookingDetails = {
        id: data.booking.id,
        pinCode: data.booking.pinCode,
        ground: venue,
        pitch: selectedPitch,
        slot: selectedSlot,
        totalAmount: grandTotal,
        depositAmount: data.booking.depositAmount,
        remainingAmount: data.booking.cashDue,
        paymentMethod,
        paymentStatus: data.booking.paymentStatus,
        addOns: Object.entries(selectedAddOns).map(([id, qty]) => ({
          addOn: ADD_ONS_LIST.find((a) => a.id === id)!,
          quantity: qty,
        })),
        squadSplits: (enableSquadPay ? [captainName, ...validSquad] : [captainName]).map((name, i) => ({
          id: `sq-${i}`,
          name,
          phone: i === 0 ? captainPhone : undefined,
          shareAmount: perPlayerShare,
          isPaid: i === 0 && paymentMethod !== "CASH_ON_ARRIVAL",
        })),
        createdAt: data.booking.createdAt,
        captainName,
        captainPhone,
        raastIban: "PK36MEZN0001020304050607",
      };

      setConfirmedBooking(generatedBooking);
      setHoldTimerActive(false);
      setStep("CONFIRMED");
      fetch("/api/slots/lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId: selectedSlot.id, action: "RELEASE" }),
      }).catch(() => {});
      window.dispatchEvent(new Event("kfc:bookings-updated"));
      onBookingConfirmed(generatedBooking);
    } catch (e: any) {
      setFormError(e.message || "Failed to connect to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    try {
      navigator.clipboard?.writeText(text);
    } catch {
      // ignore clipboard errors
    }
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2500);
  };

  const minutes = Math.floor(holdSecondsLeft / 60);
  const seconds = holdSecondsLeft % 60;
  const formattedHoldTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0C1611] border border-dark-border rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-dark-border bg-dark-card flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30">
                {venue.city}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                {venue.name}
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {venue.area} • 50m Match Play + 10m Buffer Changeover
            </p>
          </div>

          <button
            onClick={handleCloseModal}
            className="p-1.5 rounded-lg bg-dark-elevated text-gray-400 hover:text-white border border-dark-border"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 10-Minute Lock Banner */}
        {holdTimerActive && selectedSlot && step !== "CONFIRMED" && (
          <div className="px-4 py-2.5 bg-yellow-500/10 border-b border-yellow-500/30 flex items-center justify-between text-xs text-yellow-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neon-yellow animate-pulse" />
              <span>
                Slot <strong>{selectedSlot.startTime} - {selectedSlot.endTime}</strong> locked. Complete checkout before timer ends.
              </span>
            </div>
            <div className="font-mono font-bold bg-dark text-neon-yellow px-2 py-0.5 rounded border border-neon-yellow/30">
              {formattedHoldTime}
            </div>
          </div>
        )}

        {holdExpiredMsg && (
          <div className="px-4 py-2 bg-[#E94A10]/15 border-b border-[#E94A10]/30 text-xs text-[#FF7A4D]">
            {holdExpiredMsg}
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {step === "SLOTS" && (
            <div className="space-y-5">
              {/* Pitch Selector */}
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                  1. Select Pitch or Court
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {venue.pitches.map((pitch) => {
                    const active = selectedPitch.id === pitch.id;
                    const is11Side = pitch.sportType === "FOOTBALL_11A_SIDE";
                    return (
                      <button
                        key={pitch.id}
                        onClick={() => setSelectedPitch(pitch)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          active
                            ? "bg-neon-green/10 border-neon-green text-white shadow-neon-green/10 shadow-md"
                            : "bg-dark-card border-dark-border text-gray-300 hover:border-gray-500"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold font-display line-clamp-1">
                            {pitch.name}
                          </span>
                          {is11Side && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-neon-green text-[#090D10]">
                              11v11 Full Stadium
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2 text-[11px] text-gray-400">
                          <span>{pitch.dimensions || "Standard"}</span>
                          <span className="font-bold text-neon-green">
                            {formatPKR(pitch.pricePerHour)}/hr
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Selector */}
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                  2. Select Match Date
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                    const d = new Date();
                    d.setDate(d.getDate() + offset);
                    const dStr = d.toISOString().split("T")[0];
                    const active = selectedDate === dStr;
                    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
                    const dayNum = d.getDate();
                    const monthName = d.toLocaleDateString("en-US", { month: "short" });

                    return (
                      <button
                        key={dStr}
                        onClick={() => setSelectedDate(dStr)}
                        className={`px-3 py-2 rounded-xl border text-center min-w-[70px] shrink-0 transition-all ${
                          active
                            ? "bg-neon-green text-[#090D10] border-neon-green font-bold shadow-md"
                            : "bg-dark-card text-gray-300 border-dark-border hover:border-gray-500"
                        }`}
                      >
                        <span className="block text-[10px] uppercase font-semibold">
                          {offset === 0 ? "Today" : dayName}
                        </span>
                        <span className="block text-sm font-extrabold">{dayNum}</span>
                        <span className="block text-[9px] opacity-75">{monthName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Generator Surcharge Toggle */}
              <div className="p-3 bg-dark-card rounded-xl border border-dark-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Zap className={`w-4 h-4 ${isGeneratorActive ? "text-neon-yellow" : "text-gray-500"}`} />
                  <div>
                    <span className="font-bold text-white block">K-Electric / LESCO Outage Mode</span>
                    <span className="text-[10px] text-gray-400">
                      {isGeneratorActive ? "200kVA Heavy Diesel Generator Active (+Rs. 1,500 fuel surcharge)" : "Normal Grid Power (Standard rate)"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsGeneratorActive(!isGeneratorActive)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                    isGeneratorActive
                      ? "bg-neon-yellow text-dark border-neon-yellow"
                      : "bg-dark-elevated text-gray-400 border-dark-border"
                  }`}
                >
                  {isGeneratorActive ? "+Rs. 1,500 ON" : "Grid ON"}
                </button>
              </div>

              {/* Slots Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    3. Select Available Slot (50m Play + 10m Buffer)
                  </label>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-neon-green" /> Open
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-yellow-400" /> Locked
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500" /> Booked
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {slots.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    const isBooked = slot.status === "BOOKED";
                    const isLocked = slot.status === "HOLD_LOCKED" && !isSelected;

                    let btnClasses = "bg-dark-card border-dark-border text-white hover:border-neon-green";
                    if (isSelected) {
                      btnClasses = "bg-neon-green text-[#090D10] border-neon-green font-bold shadow-neon-green/20 shadow-lg";
                    } else if (isBooked) {
                      btnClasses = "bg-red-950/20 border-red-900/30 text-gray-500 cursor-not-allowed line-through";
                    } else if (isLocked) {
                      btnClasses = "bg-yellow-950/20 border-yellow-800/40 text-yellow-500 cursor-not-allowed";
                    }

                    return (
                      <button
                        key={slot.id}
                        disabled={isBooked || isLocked}
                        onClick={() => handleSelectSlot(slot)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${btnClasses}`}
                      >
                        <div className="text-xs font-mono font-bold">
                          {slot.startTime} - {slot.endTime}
                        </div>
                        <div className={`text-[10px] mt-0.5 ${isSelected ? "text-dark" : "text-gray-400"}`}>
                          {isBooked ? "Booked" : isLocked ? "On Hold" : formatPKR(slot.price + generatorFee)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === "ADDONS_SQUAD" && (
            <div className="space-y-6">
              {/* Captain Details */}
              <div className="bg-dark-card p-4 rounded-xl border border-dark-border space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-neon-green" />
                  Captain Credentials (For Booking Verification)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Captain Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ali Raza"
                      value={captainName}
                      onChange={(e) => setCaptainName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-dark-elevated border border-dark-border text-white text-xs focus:outline-none focus:border-neon-green"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">WhatsApp / Phone Number</label>
                    <input
                      type="tel"
                      placeholder="0300-1234567"
                      value={captainPhone}
                      onChange={(e) => setCaptainPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-dark-elevated border border-dark-border text-white text-xs focus:outline-none focus:border-neon-green"
                    />
                  </div>
                </div>

                {/* Footwear Stud Disclaimer */}
                <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-lg flex items-start gap-2 text-[11px] text-red-200">
                  <input
                    type="checkbox"
                    id="footwear-check"
                    checked={acceptFootwearPolicy}
                    onChange={(e) => setAcceptFootwearPolicy(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-red-500 cursor-pointer shrink-0"
                  />
                  <label htmlFor="footwear-check" className="cursor-pointer">
                    <strong>Mandatory Turf Preservation Policy:</strong> I confirm our players will wear <strong>rubber studs (TF) or indoor trainers only</strong>. Metal screw-in cleats are strictly prohibited and caretakers inspect footwear at the gate.
                  </label>
                </div>

                {/* 2-Strike Khata Policy Notice */}
                <div className="pt-2 border-t border-dark-border/60 flex items-start gap-2 text-[11px] text-gray-300">
                  <input
                    type="checkbox"
                    id="liability-check"
                    checked={acceptCaptainLiability}
                    onChange={(e) => setAcceptCaptainLiability(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-neon-green cursor-pointer shrink-0"
                  />
                  <label htmlFor="liability-check" className="cursor-pointer">
                    <strong>Captain Liability Agreement:</strong> I understand that if any squad members default on Squad Pay, I am personally responsible for settling the cash balance. Unpaid balances incur <strong>+1 Strike</strong> (2 strikes = booking blacklist across all partner grounds).
                  </label>
                </div>
              </div>

              {/* Match-Day Add-ons with Quantity Controls */}
              <div>
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                  Match-Day Add-Ons (Hydration & Equipment)
                </h4>
                <div className="space-y-2">
                  {ADD_ONS_LIST.map((addon) => {
                    const qty = selectedAddOns[addon.id] || 0;
                    return (
                      <div
                        key={addon.id}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                          qty > 0
                            ? "bg-neon-green/10 border-neon-green text-white"
                            : "bg-dark-card border-dark-border text-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${qty > 0 ? "bg-neon-green text-dark font-bold" : "bg-dark-elevated text-neon-green"}`}>
                            {qty > 0 ? `${qty}x` : <CheckCircle2 className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold">{addon.name}</div>
                            <div className="text-[10px] text-gray-400">{addon.description}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-neon-green">
                            +{formatPKR(addon.price * (qty || 1))}
                          </span>
                          <div className="flex items-center gap-1 bg-dark-elevated p-1 rounded-lg border border-dark-border">
                            <button
                              onClick={() => updateAddOnQty(addon.id, -1)}
                              className="p-1 rounded text-gray-400 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center text-white">{qty}</span>
                            <button
                              onClick={() => updateAddOnQty(addon.id, 1)}
                              className="p-1 rounded text-neon-green hover:bg-neon-green hover:text-dark"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Squad Pay (Split Bill) */}
              <div className="bg-dark-card p-4 rounded-xl border border-dark-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-neon-cyan" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Squad Pay (Split Bill)
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Generate formatted WhatsApp cards with your Raast IBAN
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableSquadPay}
                    onChange={(e) => setEnableSquadPay(e.target.checked)}
                    className="w-4 h-4 accent-neon-green cursor-pointer"
                  />
                </div>

                {enableSquadPay && (
                  <div className="pt-3 border-t border-dark-border/80 space-y-3">
                    <div className="bg-dark-elevated p-2.5 rounded-lg flex items-center justify-between text-xs">
                      <span className="text-gray-300">Total Players: <strong>{totalPlayersCount}</strong></span>
                      <span className="font-bold text-neon-cyan">
                        {formatPKR(perPlayerShare)} <span className="text-[10px] font-normal text-gray-400">/ player</span>
                      </span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-gray-400">
                        Add Squad Teammates
                      </label>
                      {squadNames.map((name, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            placeholder={`Player ${idx + 2} Name`}
                            value={name}
                            onChange={(e) => {
                              const updated = [...squadNames];
                              updated[idx] = e.target.value;
                              setSquadNames(updated);
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-dark border border-dark-border text-white text-xs focus:outline-none focus:border-neon-cyan"
                          />
                          {squadNames.length > 1 && (
                            <button
                              onClick={() => {
                                setSquadNames(squadNames.filter((_, i) => i !== idx));
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => setSquadNames([...squadNames, ""])}
                        className="text-xs text-neon-cyan hover:underline flex items-center gap-1 font-semibold pt-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Another Player
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === "PAYMENT" && (
            <div className="space-y-5">
              {/* Reschedule Voucher Code Input */}
              <div className="space-y-1.5">
                <div className="bg-dark-card p-3 rounded-xl border border-dark-border flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-neon-cyan absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Have a Weather Reschedule Voucher? (e.g. KFC-VOUCH-1234)"
                      value={voucherCodeInput}
                      onChange={(e) => setVoucherCodeInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-dark border border-dark-border text-white text-xs font-mono uppercase focus:outline-none focus:border-neon-cyan"
                    />
                  </div>
                  <button
                    onClick={handleApplyVoucher}
                    className="px-3 py-1.5 rounded-lg bg-neon-cyan text-dark font-bold text-xs hover:bg-neon-cyan/90 shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {voucherStatus && (
                  <p className={`text-[11px] px-1 ${voucherStatus.ok ? "text-neon-green" : "text-[#FF7A4D]"}`}>
                    {voucherStatus.text}
                  </p>
                )}
              </div>

              {/* Bill Summary */}
              <div className="bg-dark-card p-4 rounded-xl border border-dark-border space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-400 pb-1.5 border-b border-dark-border/60">
                  <span>Pitch ({selectedPitch.name})</span>
                  <span>{formatPKR(slotPrice)}</span>
                </div>
                {isGeneratorActive && (
                  <div className="flex justify-between text-neon-yellow py-1 border-b border-dark-border/60">
                    <span>200kVA Heavy Generator Surcharge</span>
                    <span>+{formatPKR(generatorFee)}</span>
                  </div>
                )}
                {addOnsTotal > 0 && (
                  <div className="flex justify-between text-gray-400 py-1 border-b border-dark-border/60">
                    <span>Match-Day Add-ons</span>
                    <span>+{formatPKR(addOnsTotal)}</span>
                  </div>
                )}
                {voucherApplied && (
                  <div className="flex justify-between text-neon-green py-1 border-b border-dark-border/60">
                    <span>Weather Voucher Credit</span>
                    <span>-{formatPKR(voucherDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-white pt-2">
                  <span>Total Payable</span>
                  <span className="text-neon-green">{formatPKR(grandTotal)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod("RAAST_QR")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === "RAAST_QR"
                        ? "bg-emerald-950/40 border-neon-green text-white shadow-neon-green/10 shadow-md"
                        : "bg-dark-card border-dark-border text-gray-300 hover:border-gray-500"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-neon-green" />
                      <span className="text-xs font-bold">Raast Instant</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Zero fees • Any Bank App</p>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("JAZZCASH")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === "JAZZCASH"
                        ? "bg-red-950/40 border-red-500 text-white"
                        : "bg-dark-card border-dark-border text-gray-300 hover:border-gray-500"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full bg-red-600" />
                      <span className="text-xs font-bold">JazzCash</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Mobile Wallet / Sandbox</p>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("CASH_ON_ARRIVAL")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === "CASH_ON_ARRIVAL"
                        ? "bg-cyan-950/40 border-neon-cyan text-white"
                        : "bg-dark-card border-dark-border text-gray-300 hover:border-gray-500"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-neon-cyan" />
                      <span className="text-xs font-bold">Cash on Arrival</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Pay caretaker at pitch</p>
                  </button>
                </div>
              </div>

              {/* Raast QR Code View & Bank Transaction Reference Input */}
              {paymentMethod === "RAAST_QR" && (
                <div className="bg-dark-card p-4 rounded-xl border border-dark-border space-y-4">
                  <div className="text-center">
                    <span className="text-xs font-bold text-neon-green block">
                      State Bank Raast Instant Transfer
                    </span>
                    <p className="text-[11px] text-gray-400">
                      Scan or copy IBAN to pay from HBL, Meezan, Nayapay, SadaPay, or Easypaisa
                    </p>
                  </div>

                  <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-lg">
                    <div className="w-full h-full border-2 border-black border-dashed flex flex-col items-center justify-center text-center p-1">
                      <QrCode className="w-16 h-16 text-black" />
                      <span className="text-[9px] font-mono text-black font-extrabold uppercase">
                        RAAST P2P PAY
                      </span>
                    </div>
                  </div>

                  <div className="bg-dark-elevated p-2.5 rounded-lg border border-dark-border flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 block">Kamil FC Raast IBAN</span>
                      <span className="font-mono font-bold text-white">PK36MEZN0001020304050607</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard("PK36MEZN0001020304050607")}
                      className="px-2.5 py-1.5 rounded bg-dark border border-dark-border text-neon-green text-xs font-semibold flex items-center gap-1"
                    >
                      {copiedIban ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedIban ? "Copied" : "Copy"}
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-300 block">
                      Bank Transaction ID / Reference (TRX ID)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 98124891823"
                      value={trxRef}
                      onChange={(e) => setTrxRef(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-dark border border-dark-border text-white text-xs font-mono focus:outline-none focus:border-neon-green"
                    />
                    <p className="text-[10px] text-gray-400">
                      Entering your bank TRX ID grants an extended 30-minute verification window so your slot cannot be stolen.
                    </p>
                  </div>
                </div>
              )}

              {/* JazzCash / EasyPaisa Mobile Sandbox */}
              {paymentMethod === "JAZZCASH" && (
                <div className="bg-dark-card p-4 rounded-xl border border-dark-border space-y-4">
                  <div className="text-center">
                    <span className="text-xs font-bold text-red-500 block">
                      JazzCash / EasyPaisa Sandbox Wallet
                    </span>
                    <p className="text-[11px] text-gray-400">
                      Direct mobile account instant payment gateway
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-300 block mb-1">
                        JazzCash / EasyPaisa Mobile Number
                      </label>
                      <input
                        type="tel"
                        placeholder="0300-1234567"
                        value={walletPhone || captainPhone}
                        onChange={(e) => setWalletPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-dark border border-dark-border text-white text-xs focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="bg-dark-elevated p-3 rounded-xl border border-dark-border space-y-2">
                      <div className="flex justify-between text-xs text-gray-300">
                        <span>Payable Amount:</span>
                        <strong className="text-white">{formatPKR(grandTotal)}</strong>
                      </div>
                      <div className="flex justify-between text-xs text-gray-300">
                        <span>Gateway:</span>
                        <span className="text-red-400 font-semibold">JazzCash Sandbox API</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setWalletAuthorized(true);
                        setTrxRef(`JC-SANDBOX-${Math.floor(100000 + Math.random() * 900000)}`);
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        walletAuthorized
                          ? "bg-emerald-500/20 text-neon-green border border-emerald-500/40"
                          : "bg-red-600 hover:bg-red-500 text-white shadow-lg"
                      }`}
                    >
                      {walletAuthorized ? (
                        <>
                          <Check className="w-4 h-4" /> Wallet Pre-Authorized ({trxRef})
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" /> Simulate MPIN / OTP Authorization
                        </>
                      )}
                    </button>
                    {walletAuthorized && (
                      <p className="text-[10px] text-neon-green text-center">
                        ✓ Sandbox payment verified. Ready to lock slot!
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Cash On Arrival Panel */}
              {paymentMethod === "CASH_ON_ARRIVAL" && (
                <div className="bg-dark-card p-4 rounded-xl border border-cyan-500/30 space-y-4">
                  <div className="text-center">
                    <span className="text-xs font-bold text-neon-cyan block">
                      Cash on Arrival (At Pitch Floodlights)
                    </span>
                    <p className="text-[11px] text-gray-400">
                      Zero advance online payment required today
                    </p>
                  </div>

                  <div className="bg-cyan-950/20 border border-cyan-500/30 p-3.5 rounded-xl space-y-2 text-xs text-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Online Deposit Required Now:</span>
                      <strong className="text-neon-cyan">Rs. 0 (Free Lock)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Physical Cash Due at Ground:</span>
                      <strong className="text-neon-yellow text-sm">{formatPKR(grandTotal)}</strong>
                    </div>
                    <p className="text-[11px] text-gray-400 pt-1 border-t border-cyan-500/20">
                      ⚠️ Ground Caretaker will verify your <strong>4-digit PIN</strong> and collect full cash under floodlights before opening court doors.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === "CONFIRMED" && confirmedBooking && (
            <div className="space-y-6 text-center py-2 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-neon-green/20 text-neon-green border border-neon-green/40 flex items-center justify-center mx-auto shadow-neon-green/30 shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-neon-green text-dark">
                  Slot Locked & Confirmed
                </span>
                <h3 className="text-xl font-bold text-white mt-3 font-display">
                  Booking ID: #{confirmedBooking.id}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {confirmedBooking.ground.name} • {confirmedBooking.pitch.name}
                </p>
              </div>

              {/* 4-Digit Caretaker PIN Code Box */}
              <div className="bg-dark-card border-2 border-neon-green/60 p-5 rounded-2xl max-w-sm mx-auto shadow-neon-green/10 shadow-lg">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Caretaker On-Arrival Check-In PIN
                </span>
                <div className="text-4xl font-mono font-extrabold tracking-widest text-neon-green my-2">
                  {confirmedBooking.pinCode}
                </div>
                <p className="text-[11px] text-gray-400">
                  Recite this 4-digit code to the ground caretaker under the floodlights to unlock pitch access.
                </p>
              </div>

              <div className="bg-dark-card p-4 rounded-xl border border-dark-border text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="flex justify-between text-gray-300">
                  <span>Match Timing:</span>
                  <strong className="text-white">
                    {confirmedBooking.slot.date} @ {confirmedBooking.slot.startTime} - {confirmedBooking.slot.endTime}
                  </strong>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Captain:</span>
                  <span className="text-white">{confirmedBooking.captainName} ({confirmedBooking.captainPhone})</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Total Amount:</span>
                  <strong className="text-neon-green">{formatPKR(confirmedBooking.totalAmount)}</strong>
                </div>
                {confirmedBooking.remainingAmount > 0 && (
                  <div className="flex justify-between text-neon-yellow font-bold pt-1 border-t border-dark-border">
                    <span>Cash Due at Pitch:</span>
                    <span>{formatPKR(confirmedBooking.remainingAmount)}</span>
                  </div>
                )}
              </div>

              {confirmedBooking.squadSplits.length > 1 && (
                <div className="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-xl max-w-sm mx-auto space-y-3">
                  <div className="flex items-center gap-2 text-neon-green text-xs font-bold">
                    <Share2 className="w-4 h-4" />
                    Share Squad Bill to WhatsApp
                  </div>
                  <p className="text-[11px] text-gray-300 text-left">
                    Send one-tap breakdown so everyone transfers their {formatPKR(perPlayerShare)} to your Raast IBAN.
                  </p>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `⚽ *Match Confirmed at ${confirmedBooking.ground.name}*!\n` +
                      `📅 Date: ${confirmedBooking.slot.date}\n` +
                      `⏰ Time: ${confirmedBooking.slot.startTime} - ${confirmedBooking.slot.endTime} (50m Play + 10m Buffer)\n` +
                      `🏟️ Pitch: ${confirmedBooking.pitch.name}\n` +
                      `💰 Your Share: Rs. ${perPlayerShare}\n` +
                      `💳 Pay to Captain (${confirmedBooking.captainName}) via Raast: ${confirmedBooking.raastIban}\n` +
                      `🔑 Caretaker PIN: ${confirmedBooking.pinCode}\n` +
                      `👟 Reminder: Rubber studs/trainers only. Metal studs strictly prohibited.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:bg-emerald-400"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Share via WhatsApp
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Validation Error */}
        {formError && step !== "CONFIRMED" && (
          <div className="px-4 py-2 bg-[#E94A10]/15 border-t border-[#E94A10]/30 text-xs text-[#FF7A4D]">
            {formError}
          </div>
        )}

        {/* Footer Navigation CTAs */}
        <div className="p-4 border-t border-dark-border bg-dark-card flex items-center justify-between">
          {step === "SLOTS" && (
            <>
              <div>
                <span className="text-[10px] text-gray-400 block">Selected Slot</span>
                <span className="text-xs font-bold text-white">
                  {selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : "None selected"}
                </span>
              </div>
              <button
                disabled={!selectedSlot}
                onClick={() => {
                  setFormError(null);
                  setStep("ADDONS_SQUAD");
                }}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-neon-green text-dark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neon-green/90 transition-all flex items-center gap-2 glow-neon-green"
              >
                Next: Add-ons & Squad
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === "ADDONS_SQUAD" && (
            <>
              <button
                onClick={() => {
                  setFormError(null);
                  setStep("SLOTS");
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (!captainName.trim() || !captainPhone.trim()) {
                    setFormError("Please enter Captain Name and WhatsApp Phone Number.");
                    return;
                  }
                  if (!acceptFootwearPolicy) {
                    setFormError("Please accept the Footwear Stud Inspection disclaimer.");
                    return;
                  }
                  if (!acceptCaptainLiability) {
                    setFormError("Please accept the Captain Liability agreement.");
                    return;
                  }
                  setFormError(null);
                  setStep("PAYMENT");
                }}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-neon-green text-dark hover:bg-neon-green/90 transition-all flex items-center gap-2 glow-neon-green"
              >
                Next: Payment ({formatPKR(grandTotal)})
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === "PAYMENT" && (
            <>
              <button
                onClick={() => {
                  setFormError(null);
                  setStep("ADDONS_SQUAD");
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
              >
                Back
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleConfirmBooking}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-neon-green text-dark hover:bg-neon-green/90 transition-all flex items-center gap-2 glow-neon-green disabled:opacity-50"
              >
                {isSubmitting ? "Locking Slot..." : "Lock & Confirm Booking"}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </>
          )}

          {step === "CONFIRMED" && (
            <div className="w-full flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  onClose();
                  const el = document.getElementById("my-bookings");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = "/#my-bookings";
                  }
                }}
                className="flex-1 py-3 rounded-xl text-xs sm:text-sm font-extrabold bg-neon-green text-dark hover:bg-neon-green/90 transition-all flex items-center justify-center gap-1.5 glow-neon-green"
              >
                <CheckCircle2 className="w-4 h-4" />
                View in My Bookings Hub
              </button>
              <a
                href="/caretaker"
                className="px-4 py-3 rounded-xl text-xs sm:text-sm font-bold bg-dark-elevated text-neon-cyan hover:text-white border border-dark-border text-center flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                Test PIN at Caretaker Portal
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
