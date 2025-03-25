// components/GameBoard.tsx

"use client";
import GameControls from "./GameControls";
import GameBoard from "./GameBoard";

import styles from "@/styles/components/GameDisplay.module.scss"
import WinModal from "./WinModal";

export default function GameDisplay() {
  return (
    <section className={styles.gameDisplay}>
      <GameBoard />
      <GameControls />
    </section>
  );
}
