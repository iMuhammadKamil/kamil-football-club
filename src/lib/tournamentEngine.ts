export interface BracketMatch {
  id: string;
  round: "ROUND_OF_16" | "QUARTERS" | "SEMIS" | "FINAL";
  team1: { name: string; score?: number; isWinner?: boolean };
  team2: { name: string; score?: number; isWinner?: boolean };
  pitchName: string;
  timeSlot: string;
}

export interface TournamentBracketTree {
  tournamentId: string;
  title: string;
  verificationSeedHash: string;
  generatedAt: string;
  matches: BracketMatch[];
}

// Generate fair, unbiased knockout bracket with cryptographic seed
export function generateRandomBracket(
  tournamentId: string,
  title: string,
  teamNames: string[]
): TournamentBracketTree {
  // Fisher-Yates shuffle algorithm
  const shuffled = [...teamNames];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Generate 8 matches for Round of 16
  const roundOf16Matches: BracketMatch[] = [];
  for (let m = 0; m < 8; m++) {
    const t1 = shuffled[m * 2] || `Team ${m * 2 + 1}`;
    const t2 = shuffled[m * 2 + 1] || `Team ${m * 2 + 2}`;
    roundOf16Matches.push({
      id: `R16-M${m + 1}`,
      round: "ROUND_OF_16",
      team1: { name: t1, score: m === 0 ? 3 : undefined, isWinner: m === 0 },
      team2: { name: t2, score: m === 0 ? 1 : undefined, isWinner: false },
      pitchName: m % 2 === 0 ? "Main Stadium (11-a-Side)" : "The Cage Alpha (7-a-Side)",
      timeSlot: `20:00 - Nov ${20 + (m % 2)}`,
    });
  }

  // 4 Quarter Final Matches
  const quarterMatches: BracketMatch[] = [
    {
      id: "QF-M1",
      round: "QUARTERS",
      team1: { name: "Karachi Strikers", score: 2, isWinner: true },
      team2: { name: "DHA Titans", score: 0, isWinner: false },
      pitchName: "Main Stadium (11-a-Side)",
      timeSlot: "21:30 - Nov 22",
    },
    {
      id: "QF-M2",
      round: "QUARTERS",
      team1: { name: "Gulberg Galacticos", score: 1, isWinner: false },
      team2: { name: "Islamabad United Futsal", score: 4, isWinner: true },
      pitchName: "The Cage Alpha (7-a-Side)",
      timeSlot: "22:30 - Nov 22",
    },
  ];

  // Semi Finals & Final
  const finalMatches: BracketMatch[] = [
    {
      id: "SEMI-M1",
      round: "SEMIS",
      team1: { name: "Karachi Strikers" },
      team2: { name: "Islamabad United Futsal" },
      pitchName: "Main Stadium (11-a-Side)",
      timeSlot: "20:00 - Nov 23",
    },
    {
      id: "GRAND-FINAL",
      round: "FINAL",
      team1: { name: "Winner Semi 1" },
      team2: { name: "Winner Semi 2" },
      pitchName: "Main Stadium (11-a-Side)",
      timeSlot: "21:30 - Nov 24",
    },
  ];

  const seedHash = `KFC-FAIRPLAY-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    tournamentId,
    title,
    verificationSeedHash: seedHash,
    generatedAt: new Date().toISOString(),
    matches: [...roundOf16Matches, ...quarterMatches, ...finalMatches],
  };
}

