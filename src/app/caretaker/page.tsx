import React from "react";
import CaretakerQuickCheckin from "@/components/CaretakerQuickCheckin";

export const metadata = {
  title: "Field Caretaker Portal | Kamil Football Club",
  description: "High-contrast mobile check-in portal for ground caretakers and pitch managers.",
};

export default function CaretakerPage() {
  return (
    <main className="min-h-screen bg-[#090D10] py-6 sm:py-10">
      <CaretakerQuickCheckin />
    </main>
  );
}

