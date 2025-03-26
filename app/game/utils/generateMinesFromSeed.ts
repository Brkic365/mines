import seedrandom from "seedrandom";

export function generateMinesFromSeed(
  rows: number,
  cols: number,
  minesCount: number,
  seed: string
): number[] {
  const totalTiles = rows * cols;
  const rng = seedrandom(seed);
  const mineIndices = new Set<number>();

  while (mineIndices.size < minesCount) {
    const index = Math.floor(rng() * totalTiles);
    mineIndices.add(index);
  }

  return [...mineIndices];
}
