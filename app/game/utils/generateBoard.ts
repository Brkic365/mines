// utils/generateBoard.ts

import { Tile } from "../types/Board";

export function generateBoard(rows: number, cols: number, minesCount: number): Tile[][] {
  const board: Tile[][] = [];
  const totalTiles = rows * cols;
  const minePositions = new Set<number>();

  while (minePositions.size < minesCount) {
    minePositions.add(Math.floor(Math.random() * totalTiles));
  }

  let tileIndex = 0;

  for (let row = 0; row < rows; row++) {
    const rowTiles: Tile[] = [];
    for (let col = 0; col < cols; col++) {
      rowTiles.push({
        id: `${row}-${col}`,
        hasMine: minePositions.has(tileIndex),
        revealed: false,
        position: { row, col },
        opened: false
      });
      tileIndex++;
    }
    board.push(rowTiles);
  }

  return board;
}
