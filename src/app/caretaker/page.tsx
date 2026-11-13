import React from "react";
import AdminShell from "@/components/admin/AdminShell";
import CaretakerQuickCheckin from "@/components/CaretakerQuickCheckin";

export const metadata = {
  title: "Field Caretaker Portal | Kamil Football Club",
  description: "Check-in and pitch operations portal for ground caretakers and pitch managers.",
};

export default function CaretakerPage() {
  return (
    <AdminShell
      title="Caretaker Quick Check-In"
      subtitle="Verify guest booking passes, collect cash at pitch, and manage floodlight status."
    >
      <CaretakerQuickCheckin />
    </AdminShell>
  );
}
