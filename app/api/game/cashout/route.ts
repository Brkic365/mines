// app/api/cashout/route.ts
import { NextResponse } from 'next/server';
import { gameStore } from '../start-game/route';

interface CashoutBody {
  gameId: string;
  revealedCount: number;
  betAmount: number;
}

export async function POST(req: Request) {
  const body = (await req.json()) as CashoutBody;
  const { gameId, revealedCount, betAmount } = body;

  if (!gameId || revealedCount == null || betAmount == null) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const game = gameStore[gameId];
  if (!game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }

  const { mineIndices, serverSeed } = game;

  const multiplier = 1 + 0.2 * revealedCount;
  const payout = +(betAmount * multiplier).toFixed(2);

  return NextResponse.json({
    payout,
    multiplier,
    mineIndices,
    serverSeed
  });
}
