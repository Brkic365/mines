export const gameStore: Record<string, {
    serverSeed: string;
    clientSeed: string;
    finalSeed: string;
    serverSeedHash: string;
    mineIndices: number[];
    config: { rows: number; cols: number; minesCount: number; nonce: number };
  }> = {};