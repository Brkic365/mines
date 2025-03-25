// components/BetInput.tsx

"use client";

import { useGameStore } from "../hooks/useGameStore";
import { shallow } from 'zustand/shallow';

import styles from "@/styles/components/GameInputs.module.scss"
import LabelInput from "./LabelInput";
import { useMemo } from "react";
import { usePayoutCalculator } from "../hooks/usePayoutCalculator";

export default function GameInputs() {
  const status = useGameStore((s) => s.status);
  const betAmount = useGameStore((s) => s.betAmount);
  const setBetAmount = useGameStore((s) => s.setBetAmount);
  const minesCount = useGameStore((s) => s.minesCount);
  const revealedGems = useGameStore((s) => s.revealedCount);
  const rows = useGameStore((s) => s.rows);
  const cols = useGameStore((s) => s.cols);

  const gemsCount = useMemo(
    () => rows * cols - revealedGems - minesCount,
    [rows, cols, revealedGems, minesCount]
  );
  

  const handleBetChange = (value: string) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setBetAmount(numericValue);
    }
  }

  const { multiplier, payout } = usePayoutCalculator(revealedGems, betAmount);

  return (
    <section className={styles.gameInputs}>
      <LabelInput inputable={true} label={"Bet Amount"} value={betAmount} onChange={handleBetChange} />
      {
        status === "IN_PROGRESS" && 
        <>
          <section className={styles.twoInputs}>
            <LabelInput inputable={false} label={"Mines"} value={minesCount} />
            <LabelInput inputable={false} label={"Gems"} value={gemsCount} />
          </section>
          <LabelInput inputable={false} label={`Total Profit (${multiplier.toFixed(2)}x)`} value={payout || 0} />
        </>
      }

    </section>
  );
}
