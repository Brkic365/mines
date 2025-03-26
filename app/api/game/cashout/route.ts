// app/api/cashout/route.ts
import { NextResponse } from 'next/server';
import { getGame } from '@/lib/gameStore';
import { processCashout } from '@/lib/wallet';

interface CashoutRequest {
  gameId: string;
  revealedCount: number;
  betAmount: number;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CashoutRequest;
    const { gameId, revealedCount, betAmount } = body;

    // Validate input
    if (!gameId || revealedCount < 0) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Get game from server (Redis)
    const game = await getGame(gameId);
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const { mineIndices, serverSeed } = game;

    // Calculate payout
    const multiplier = +(1 + 0.2 * revealedCount).toFixed(2);
    const payout = +(betAmount * multiplier).toFixed(2);

    const balance = await processCashout(payout);

    return NextResponse.json({
      payout,
      multiplier,
      mineIndices,
      serverSeed,
      balance
    });
  } catch (err: any) {
    console.error("Cashout error:", err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
