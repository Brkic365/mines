// store/gameStore.ts
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Tile } from "../types/Board";
import { createEmptyBoard } from "../utils/createEmptyBoard";

export type GameStatus = "IDLE" | "IN_PROGRESS" | "LOST" | "WON";

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
  finalPayout: number;

  clientSeed: string;
  serverSeedHash: string;
  nonce: number;
  gameId: string;

  isRevealing: boolean;

  // Actions
  setBetAmount: (amount: number) => void;
  setClientSeed: (seed: string) => void;
  setGameId: (id: string) => void;
  startGame: () => Promise<number | undefined>;
  revealTile: (row: number, col: number, sounds?: SoundCallbacks) => Promise<"WON" | null>;
  cashout: (playWin?: () => void) => Promise<number | undefined>;
  resetGame: () => void;
}

const defaultRows = 5;
const defaultCols = 5;
const defaultMines = 3;

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    rows: defaultRows,
    cols: defaultCols,
    minesCount: defaultMines,
    board: createEmptyBoard(defaultRows, defaultCols),
    status: "IDLE",
    revealedCount: 0,
    betAmount: 10,
    finalPayout: 0,

    clientSeed: "user123",
    serverSeedHash: "",
    nonce: 0,
    gameId: "",

    isRevealing: false,

    setBetAmount: (amount) => set({ betAmount: amount }),
    setClientSeed: (seed) => set({ clientSeed: seed }),
    setGameId: (id) => set({ gameId: id }),

    startGame: async () => {
      const { rows, cols, minesCount, clientSeed, nonce, betAmount } = get();

      const response = await fetch("/api/game/start-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientSeed, rows, cols, minesCount, nonce, betAmount }),
      });

      if (!response.ok) {
        console.error("Failed to start game");
        return;
      }

      const {
        serverSeedHash,
        gameId,
        rows: r,
        cols: c,
        minesCount: m,
        nonce: nextNonce,
        balance,
      } = await response.json();

      const board = createEmptyBoard(r, c);

      set({
        board,
        gameId,
        serverSeedHash,
        nonce: nextNonce,
        status: "IN_PROGRESS",
        revealedCount: 0,
        finalPayout: 0,
      });

      return balance;
    },

    revealTile: async (row, col, sounds) => {
      const { gameId, board, status, revealedCount, minesCount, rows, cols, isRevealing } = get();
      if (status !== "IN_PROGRESS" || isRevealing) return null;

      set({ isRevealing: true });

      try {
        const tile = board[row][col];
        if (tile.revealed) return null;

        const response = await fetch("/api/game/reveal-tile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId, row, col }),
        });

        if (!response.ok) {
          console.error("Reveal tile failed");
          return null;
        }

        const { isMine } = await response.json();
        sounds?.playClick?.();

        if (isMine) {
          const mineRevealRes = await fetch("/api/game/cashout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameId, revealedCount, betAmount: 0 }),
          });

          const { mineIndices } = await mineRevealRes.json();
          const mineSet = new Set(mineIndices);

          const lostBoard = board.map((r, rIdx) =>
            r.map((t, cIdx) => {
              const index = rIdx * cols + cIdx;

              if(rIdx === row && cIdx === col) {
                return {
                  ...t,
                  revealed: true,
                  isMine: true,
                  clicked: true
                }
              }

              return {
                ...t,
                revealed: true,
                isMine: mineSet.has(index),
              };
            })
          );

          set({ board: lostBoard, status: "LOST" });
          sounds?.playLose?.();
          return null;
        }

        const updatedBoard = board.map((r, rIdx) =>
          r.map((t, cIdx) =>
            rIdx === row && cIdx === col
              ? { ...t, revealed: true, isMine: false, clicked: true }
              : t
          )
        );

        const newRevealed = revealedCount + 1;
        const totalSafe = rows * cols - minesCount;
        const won = newRevealed === totalSafe;

        set({
          board: updatedBoard,
          revealedCount: newRevealed,
          status: won ? "WON" : status,
        });

        if (won) {
          sounds?.playWin?.();
          return "WON";
        }

        return null;
      } finally {
        set({ isRevealing: false });
      }
    },

    cashout: async (playWin) => {
      const { gameId, revealedCount, betAmount, board, cols } = get();
      if (!gameId) return;

      const response = await fetch("/api/game/cashout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, revealedCount, betAmount }),
      });

      if (!response.ok) {
        console.error("Cashout failed");
        return;
      }

      const { payout, mineIndices, balance } = await response.json();
      const mineSet = new Set(mineIndices);

      const revealedBoard = board.map((r, rIdx) =>
        r.map((t, cIdx) => {
          const idx = rIdx * cols + cIdx;
          return {
            ...t,
            revealed: true,
            isMine: mineSet.has(idx),
          };
        })
      );

      set({
        board: revealedBoard,
        finalPayout: payout,
        status: "WON",
      });

      playWin?.();
      return balance;
    },

    resetGame: () => {
      set({
        board: createEmptyBoard(defaultRows, defaultCols),
        status: "IDLE",
        revealedCount: 0,
        finalPayout: 0,
        serverSeedHash: "",
        gameId: "",
      });
    },
  }))
);
