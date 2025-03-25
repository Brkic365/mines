// components/GameBoard.tsx

"use client";

import { useGameStore } from "../hooks/useGameStore";
import GameControls from "./GameControls";

import TileElement from "./Tile";

import styles from "@/styles/components/GameBoard.module.scss"
import WinModal from "./WinModal";

export default function GameBoard() {
  const board = useGameStore((s) => s.board);
  const revealTile = useGameStore((s) => s.revealTile);
  const startGame = useGameStore((s) => s.startGame);
  const status = useGameStore((s) => s.status);

  return (
      <div className={styles.gameBoard} style={{ gridTemplateColumns: `repeat(${board[0].length}, 1fr)` }}>
        <WinModal />
        {board.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <TileElement key={tile.id} tileId={tile.id} row={rowIndex} col={colIndex} />
          ))
        )}
      </div>
  );
}
