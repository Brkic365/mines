// app/api/reveal-tile/route.ts
import { NextResponse } from 'next/server';
import { getGame } from '@/lib/gameStore';
import type { Game } from '@/app/game/types/Game';

interface RevealTileBody {
  gameId: string;
  row: number;
  col: number;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RevealTileBody;
    const { gameId, row, col } = body;

    // Validate input
    if (!gameId || row == null || col == null || row < 0 || col < 0) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Get game from server (Redis)
    const game: Game | null = await getGame(gameId);
    if (!game || !game.mineIndices || !game.config) {
      return NextResponse.json({ error: 'Game not found or malformed' }, { status: 404 });
    }

    const { mineIndices, config } = game;
    const { cols } = config;

    // Check if the tile is a mine
    const tileIndex = row * cols + col;
    const isMine = mineIndices.includes(tileIndex);

    return NextResponse.json({ isMine, tileIndex });
  } catch (err: any) {
    console.error("Reveal tile error:", err);
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
