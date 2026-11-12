import { NextRequest, NextResponse } from "next/server";

// In-memory score table for live tournament bracket updates
interface MatchScore {
  matchId: string;
  scoreA: number;
  scoreB: number;
  winner?: string;
  status: "LIVE" | "COMPLETED";
  updatedAt: string;
}

const globalForScores = globalThis as unknown as {
  kfcLiveScores: Map<string, MatchScore> | undefined;
};

const liveScores: Map<string, MatchScore> =
  globalForScores.kfcLiveScores ??
  new Map<string, MatchScore>([
    [
      "QF-M1",
      {
        matchId: "QF-M1",
        scoreA: 2,
        scoreB: 1,
        status: "LIVE",
        updatedAt: new Date().toISOString(),
      },
    ],
  ]);

if (process.env.NODE_ENV !== "production") {
  globalForScores.kfcLiveScores = liveScores;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const matchId = searchParams.get("matchId");

  if (matchId && liveScores.has(matchId)) {
    return NextResponse.json({ success: true, score: liveScores.get(matchId) });
  }

  return NextResponse.json({
    success: true,
    scores: Array.from(liveScores.values()),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { matchId, scoreA, scoreB, isFinal } = body;

    if (!matchId) {
      return NextResponse.json({ error: "Missing matchId" }, { status: 400 });
    }

    const winner = scoreA > scoreB ? "Team A" : scoreB > scoreA ? "Team B" : "TIE";

    const updated: MatchScore = {
      matchId,
      scoreA: scoreA || 0,
      scoreB: scoreB || 0,
      winner: isFinal ? winner : undefined,
      status: isFinal ? "COMPLETED" : "LIVE",
      updatedAt: new Date().toISOString(),
    };

    liveScores.set(matchId, updated);

    return NextResponse.json({
      success: true,
      score: updated,
      message: `Score updated for ${matchId}: ${scoreA} - ${scoreB}${isFinal ? " (Match Completed)" : ""}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update score" }, { status: 500 });
  }
}

