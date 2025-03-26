import seedrandom from "seedrandom";

/**
 * Generates unique mine positions from a deterministic seed.
 * @param rows Number of rows on the board
 * @param cols Number of columns on the board
 * @param minesCount Total number of mines to place
 * @param seed Deterministic seed string (server + client + nonce)
 * @returns Array of unique mine indices (flattened from 2D to 1D)
 */
export function generateMinesFromSeed(
  rows: number,
  cols: number,
  minesCount: number,
  seed: string
): number[] {
  const totalTiles = rows * cols;

  if (minesCount > totalTiles) {
    throw new Error("Mine count cannot exceed total number of tiles");
  }

  const rng = seedrandom(seed);
  const mineIndices = new Set<number>();

  while (mineIndices.size < minesCount) {
    const index = Math.floor(rng() * totalTiles);
    mineIndices.add(index);
  }

  return Array.from(mineIndices);
}
