import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0E2A20",
};

export const metadata: Metadata = {
  title: "Kamil Football Club | Multi-Sport & Ground Booking System Pakistan",
  description:
    "Pakistan's premier sports facility platform. Book 11-a-side football turf, 7-a-side futsal cages, Padel tennis courts, badminton, table tennis, and cricket nets in Islamabad, Rawalpindi, Lahore, and Karachi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${outfit.variable}`}>
      <body className="bg-[#F4F5F3] text-[#0E2A20] min-h-screen flex flex-col font-sans selection:bg-[#C8A838] selection:text-[#0E2A20] pb-16 md:pb-0">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
