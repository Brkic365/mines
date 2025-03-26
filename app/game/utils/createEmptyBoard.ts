// utils/createEmptyBoard.ts
import { Tile } from "@/app/game/types/Board";

export function createEmptyBoard(rows: number, cols: number): Tile[][] {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      id: `${row}-${col}`,
      revealed: false,
      clicked: false,
      position: { row, col },
    }))
  );
}