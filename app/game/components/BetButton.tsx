"use client"

import React from 'react'

import styles from "@/styles/components/BetButton.module.scss"
import { useGameStore } from '../hooks/useGameStore';
import { usePayoutCalculator } from '../hooks/usePayoutCalculator';
import { useSoundEffects } from '../hooks/useSoundEffects';

function BetButton() {

  const status = useGameStore((s) => s.status);
  const betAmount = useGameStore((s) => s.betAmount);
  const revealedGems = useGameStore((s) => s.revealedCount);

  const startGame = useGameStore((s) => s.startGame);
  const cashout = useGameStore((s) => s.cashout);

  const { multiplier, payout } = usePayoutCalculator(revealedGems, betAmount);

  const { playClick, playWin } = useSoundEffects();

  const handleClick = () => {
    playClick();

    if(status === "IN_PROGRESS") {
      cashout(playWin);
    } else {
      startGame();
    }
  }
  
  return (
    <div className={styles.buttonHolder}>
          <button className={styles.placeBet} onClick={handleClick}>{status === "IN_PROGRESS" ? `Cashout ${payout?.toFixed(2)}$` : "Place Bet"}</button>
    </div>

  )
}

export default BetButton