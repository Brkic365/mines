// app/api/start-game/route.ts
import { NextResponse } from 'next/server';
import { sha256 } from '@/app/game/utils/sha256';
import { generateMinesFromSeed } from '@/app/game/utils/generateMinesFromSeed';
import { v4 as uuidv4 } from 'uuid';

interface StartGameBody {
  clientSeed: string;
  rows: number;
  cols: number;
  minesCount: number;
  nonce: number;
}

// TEMPORARY IN-MEMORY STORE
const games: Record<string, {
  serverSeed: string;
  clientSeed: string;
  finalSeed: string;
  serverSeedHash: string;
  mineIndices: number[];
  config: { rows: number; cols: number; minesCount: number; nonce: number };
}> = {};

export async function POST(req: Request) {
  const body = (await req.json()) as StartGameBody;
  const { clientSeed, rows, cols, minesCount, nonce } = body;

  if (!clientSeed || !rows || !cols || !minesCount || nonce == null) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const serverSeed = uuidv4();
  const serverSeedHash = await sha256(serverSeed);
  const finalSeed = await sha256(serverSeed + clientSeed + nonce);

  const mineIndices = generateMinesFromSeed(rows, cols, minesCount, finalSeed);
  const gameId = uuidv4();

  games[gameId] = {
    serverSeed,
    clientSeed,
    finalSeed,
    serverSeedHash,
    mineIndices,
    config: { rows, cols, minesCount, nonce },
  };

  return NextResponse.json({
    gameId,
    serverSeedHash,
    clientSeed,
    nonce,
    rows,
    cols,
    minesCount,
  });
}

export const gameStore = games;
