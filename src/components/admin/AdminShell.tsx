"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SquaresFour as LayoutDashboard,
  ShieldCheck,
  FileText as FileSpreadsheet,
  Lightning,
  ArrowLeft,
} from "@phosphor-icons/react";
import { Card } from "@/components/ui";

const ADMIN_NAV = [
  {
    href: "/owner/dashboard",
    label: "Owner Overview",
    icon: LayoutDashboard,
    match: (p: string) => p.startsWith("/owner"),
  },
  {
    href: "/caretaker",
    label: "Caretaker Check-In",
    icon: ShieldCheck,
    match: (p: string) => p === "/caretaker",
  },
  {
    href: "/caretaker/rush",
    label: "Rush & Queue",
    icon: Lightning,
    match: (p: string) => p.startsWith("/caretaker/rush"),
  },
  {
    href: "/caretaker/handover",
    label: "Shift Handover",
    icon: FileSpreadsheet,
    match: (p: string) => p.startsWith("/caretaker/handover"),
  },
];

export default function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";

  return (
    <main className="min-h-screen bg-[#F4F5F3] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Dedicated Admin Left Sidebar */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24">
            <Card className="p-4 space-y-2">
              <div className="px-3 pb-3 border-b border-[#E6E7E5]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#176B3A]">
                  Administration
                </div>
                <div className="text-sm font-display font-extrabold text-[#0E2A20] mt-0.5">
                  Kamil FC Operations
                </div>
              </div>

              <nav className="space-y-1">
                {ADMIN_NAV.map((item) => {
                  const active = item.match(pathname);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        active
                          ? "bg-[#0E2A20] text-[#C8A838] shadow-sm"
                          : "text-[#5C6B64] hover:bg-[#F4F5F3] hover:text-[#0E2A20]"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-[#E6E7E5]">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#5C6B64] hover:text-[#176B3A] hover:bg-[#F4F5F3] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Player App</span>
                </Link>
              </div>
            </Card>
          </aside>

          {/* Main Admin Content */}
          <div className="lg:col-span-9 space-y-6">
            <div className="border-b border-[#E6E7E5] pb-4">
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0E2A20]">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-[#5C6B64] mt-1">{subtitle}</p>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
