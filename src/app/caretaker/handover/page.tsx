import React from "react";
import AdminShell from "@/components/admin/AdminShell";
import CaretakerShiftHandover from "@/components/CaretakerShiftHandover";

export const metadata = {
  title: "Night Shift Handover Reconciliation | Kamil Football Club",
  description: "Caretaker cash drawer balance and shift handover reconciliation.",
};

export default function CaretakerHandoverPage() {
  return (
    <AdminShell
      title="Shift Handover Reconciliation"
      subtitle="Audit cash collected at pitch against expected slot bookings before closing shift."
    >
      <CaretakerShiftHandover />
    </AdminShell>
  );
}
