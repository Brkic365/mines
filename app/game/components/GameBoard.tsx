"use client";

import { useGameStore } from "../hooks/useGameStore";
import GameControls from "./GameControls";
import TileElement from "./Tile";
import WinModal from "./WinModal";

import styles from "@/styles/components/GameBoard.module.scss";

export default function GameBoard() {
  const board = useGameStore((s) => s.board);
  const status = useGameStore((s) => s.status);

  const isBoardReady = board.length > 0 && board[0]?.length > 0;

  if (!isBoardReady) return null;

  const columnCount = board[0].length;
  const gridStyle = { gridTemplateColumns: `repeat(${columnCount}, 1fr)` };

  return (
    <div className={styles.gameBoard} style={gridStyle}>
      <WinModal />
      {board.map((row, rowIndex) =>
        row.map((tile, colIndex) => (
          <TileElement
            key={tile.id}
            tileId={tile.id}
            row={rowIndex}
            col={colIndex}
          />
        ))
      )}
    </div>
  );
}
