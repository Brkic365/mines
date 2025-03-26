"use client";

import React, { useCallback, useState } from "react";
import styles from "@/styles/components/BetButton.module.scss";
import { useGameStore } from "../hooks/useGameStore";
import { useWalletStore } from "@/app/hooks/useWalletStore";
import { usePayoutCalculator } from "../hooks/usePayoutCalculator";
import { useSoundEffects } from "../hooks/useSoundEffects";

function BetButton() {
  const [loading, setLoading] = useState(false);

  const status = useGameStore((s) => s.status);
  const betAmount = useGameStore((s) => s.betAmount);
  const revealedCount = useGameStore((s) => s.revealedCount);
  const startGame = useGameStore((s) => s.startGame);
  const cashout = useGameStore((s) => s.cashout);
  
  const balance = useWalletStore((s) => s.balance);
  const currency = useWalletStore((s) => s.currency);
  const updateBalance = useWalletStore((s) => s.updateBalance);
  

  const { playClick, playWin } = useSoundEffects();

  const { payout } = usePayoutCalculator(revealedCount, betAmount);

  const handleClick = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    playClick();

    try {
      // If game is in progress, button click activates cashout
      if (status === "IN_PROGRESS") {
        const newBalance = await cashout(playWin);
        updateBalance(newBalance || 0);
      // Else it activates start of the game
      } else {
        if (betAmount <= balance) {
          const newBalance = await startGame();
          updateBalance(newBalance || 0);
        }
      }
    } catch (err) {
      console.error("Bet error:", err);
    } finally {
      setLoading(false);
    }
  }, [status, betAmount, balance, cashout, playClick, playWin, startGame, updateBalance, loading]);

  const buttonText =
    status === "IN_PROGRESS"
      ? `Cashout ${(payout || 0).toFixed(2)} ${currency}`
      : "Place Bet";

  return (
    <div className={styles.buttonHolder}>
      <button
        className={styles.placeBet}
        onClick={handleClick}
        disabled={loading}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default BetButton;
