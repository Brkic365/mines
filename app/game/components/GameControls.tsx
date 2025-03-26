"use client";

import BetButton from "./BetButton";
import GameInputs from "./GameInputs";

import styles from "@/styles/components/GameControls.module.scss";

export default function GameControls() {
  return (
    <div className={styles.controls}>
      <BetButton />
      <GameInputs />
    </div>
  );
}
