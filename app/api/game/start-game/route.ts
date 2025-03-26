// app/api/start-game/route.ts
import { NextResponse } from 'next/server';
import { sha256 } from '@/app/game/utils/sha256';
import { generateMinesFromSeed } from '@/app/game/utils/generateMinesFromSeed';
import { v4 as uuidv4 } from 'uuid';

import { saveGame } from '@/lib/gameStore';
import { placeBet } from '@/lib/wallet';
import type { StartGameRequest, Game } from '@/app/game/types/Game';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as StartGameRequest;
    const { clientSeed, rows, cols, minesCount, nonce, betAmount } = body;

    if (
      !clientSeed ||
      rows <= 0 ||
      cols <= 0 ||
      minesCount <= 0 ||
      minesCount >= rows * cols ||
      betAmount <= 0 ||
      nonce == null
    ) {
      return NextResponse.json({ error: 'Invalid input parameters' }, { status: 400 });
    }

    // Provably fair seed generation
    const serverSeed = uuidv4();
    const serverSeedHash = await sha256(serverSeed);
    const finalSeed = await sha256(serverSeed + clientSeed + nonce);

    // Generate mine positions
    const mineIndices = generateMinesFromSeed(rows, cols, minesCount, finalSeed);
    const gameId = uuidv4();

    // Wallet transaction
    const balance = await placeBet(betAmount);

    // Store game server-side (Redis)
    const gameData: Game = {
      serverSeed,
      clientSeed,
      finalSeed,
      serverSeedHash,
      mineIndices,
      config: { rows, cols, minesCount, nonce },
    };

    await saveGame(gameId, gameData);

    return NextResponse.json({
      gameId,
      serverSeedHash,
      clientSeed,
      nonce,
      rows,
      cols,
      minesCount,
      balance,
    });
  } catch (err: any) {
    console.error("Start game error:", err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
