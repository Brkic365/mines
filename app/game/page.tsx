// app/game/page.tsx
"use client"

import styles from "@/styles/pages/Game.module.scss"
import GameDisplay from "./components/GameDisplay";

export default function GamePage() {
  return (
    <main className={styles.minesGame}>
      <GameDisplay />
    </main>
  );
}
