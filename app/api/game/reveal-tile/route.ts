// app/api/reveal-tile/route.ts
import { NextResponse } from 'next/server';
import { gameStore } from '../start-game/route'; // ✅ shared in-memory store

interface RevealTileBody {
  gameId: string;
  row: number;
  col: number;
}

export async function POST(req: Request) {
  const body = (await req.json()) as RevealTileBody;
  const { gameId, row, col } = body;

  if (!gameId || row == null || col == null) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const game = gameStore[gameId];
  if (!game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }

  const { mineIndices, config } = game;
  const { rows, cols, minesCount } = config;

  const tileIndex = row * cols + col;
  const isMine = mineIndices.includes(tileIndex);

  return NextResponse.json({
    isMine,
    tileIndex,
  });
}
