import React from "react";
import CaretakerShiftHandover from "@/components/CaretakerShiftHandover";

export const metadata = {
  title: "Night Shift Handover Reconciliation | Kamil Football Club",
  description: "Caretaker cash drawer balance and shift handover reconciliation.",
};

export default function CaretakerHandoverPage() {
  return (
    <main className="min-h-screen bg-[#090D10] py-6 sm:py-10">
      <CaretakerShiftHandover />
    </main>
  );
}

