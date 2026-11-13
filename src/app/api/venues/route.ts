import { NextRequest, NextResponse } from "next/server";
import { MOCK_VENUES } from "@/data/mockVenues";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const sport = searchParams.get("sport");
    const query = searchParams.get("q")?.toLowerCase();

    let filtered = [...MOCK_VENUES];

    if (city && city !== "ALL") {
      filtered = filtered.filter((v) => v.city.toLowerCase() === city.toLowerCase());
    }

    if (sport && sport !== "ALL") {
      filtered = filtered.filter((v) => v.pitches.some((p) => p.sportType === sport));
    }

    if (query) {
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.area.toLowerCase().includes(query) ||
          v.city.toLowerCase().includes(query) ||
          v.pitches.some((p) => p.name.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      venues: filtered,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch venues" }, { status: 500 });
  }
}

