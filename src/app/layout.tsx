import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
  themeColor: "#090D10",
};

export const metadata: Metadata = {
  title: "Kamil Football Club | Multi-Sport & Ground Booking System Pakistan",
  description:
    "Pakistan's premier sports facility platform. Book 11-a-side football turf, 7-a-side futsal cages, Padel tennis courts, cricket nets, and running tracks in Karachi, Lahore, and Islamabad.",
  keywords: [
    "Football turf booking Karachi",
    "11-a-side ground booking Pakistan",
    "Padel court booking Lahore",
    "Futsal ground DHA Phase 6",
    "Cricket nets Islamabad",
    "Raast sports booking",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="bg-[#090D10] text-slate-100 min-h-screen flex flex-col font-sans selection:bg-[#00E575] selection:text-black">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

