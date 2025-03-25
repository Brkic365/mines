import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Tile } from "../types/Board";
import { generateBoard } from "../utils/generateBoard";

type GameStatus = "IDLE" | "IN_PROGRESS" | "LOST" | "WON";

interface SoundCallbacks {
  playClick?: () => void;
  playWin?: () => void;
  playLose?: () => void;
}

interface GameStore {
  board: Tile[][];
  rows: number;
  cols: number;
  minesCount: number;
  status: GameStatus;
  revealedCount: number;
  betAmount: number;
  finalPayout: number,

  setBetAmount: (amount: number) => void;
  startGame: () => void;
  revealTile: (row: number, col: number, sounds?: SoundCallbacks) => void;
  resetGame: () => void;
  cashout: (playWin?: () => void) => void;
}

const defaultRows = 5;
const defaultCols = 5;
const defaultMines = 3;

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    rows: defaultRows,
    cols: defaultCols,
    minesCount: defaultMines,
    board: generateBoard(defaultRows, defaultCols, 0),
    status: "IDLE",
    revealedCount: 0,
    betAmount: 10,
    finalPayout: 0,

    setBetAmount: (amount) => set({ betAmount: amount }),

    startGame: () => {
      const { rows, cols, minesCount } = get();
      const board = generateBoard(rows, cols, minesCount);
      set({ board, status: "IN_PROGRESS", revealedCount: 0 });
    },

    revealTile: (row, col, sounds) => {
      const { board, status, revealedCount, minesCount, rows, cols } = get();
      if (status !== "IN_PROGRESS") return;

      const tile = board[row][col];
      if (tile.revealed) return;

      // Clone the board deeply
      const updatedBoard = board.map((r, rIdx) =>
        r.map((t, cIdx) =>
          rIdx === row && cIdx === col
            ? { ...t, revealed: true, opened: true }
            : { ...t }
        )
      );

      const clickedTile = updatedBoard[row][col];

      sounds?.playClick?.();

      if (clickedTile.hasMine) {
        // Reveal all mines
        const allRevealed = updatedBoard.map((r) =>
          r.map((t) => ({ ...t, revealed: true }))
        );
        set({ board: allRevealed, status: "LOST" });
        sounds?.playLose?.();
        return;
      }

      const newRevealedCount = revealedCount + 1;
      const safeTiles = rows * cols - minesCount;
      const won = newRevealedCount === safeTiles;

      set({
        board: updatedBoard,
        revealedCount: newRevealedCount,
        status: won ? "WON" : status,
      });

      if (won) {
        sounds?.playWin?.();
      }
    },

    cashout: (playWin) => {
      const { status, revealedCount, betAmount } = get();
      if (status !== "IN_PROGRESS") return;

      const multiplier = 1 + 0.2 * revealedCount;

      const payout = +(betAmount * multiplier).toFixed(2);

      playWin?.();

      set({
        status: "WON",
        finalPayout: payout
      })
    },

    resetGame: () => {
      const { rows, cols, minesCount } = get();

      set({
        board: generateBoard(rows, cols, 0),
        status: "IDLE",
        revealedCount: 0,
      });
    },
  }))
);
