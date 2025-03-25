// components/GameControls.tsx

"use client";

import { useGameStore } from "../hooks/useGameStore";
import BetButton from "./BetButton";

import styles from "@/styles/components/GameControls.module.scss"
import GameInputs from "./GameInputs";

export default function GameControls() {
  const status = useGameStore((s) => s.status);
  const startGame = useGameStore((s) => s.startGame);
  const resetGame = useGameStore((s) => s.resetGame);

  return (
    <div>
      <BetButton />
      <GameInputs />
    </div>
  );
}
