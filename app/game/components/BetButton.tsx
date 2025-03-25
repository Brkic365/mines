"use client"

import React, { useState } from 'react'

import styles from "@/styles/components/BetButton.module.scss"
import { useGameStore } from '../hooks/useGameStore';
import { usePayoutCalculator } from '../hooks/usePayoutCalculator';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useStore } from '@/app/hooks/useStore';

function BetButton() {

  const status = useGameStore((s) => s.status);
  const betAmount = useGameStore((s) => s.betAmount);
  const revealedGems = useGameStore((s) => s.revealedCount);

  const startGame = useGameStore((s) => s.startGame);
  const cashout = useGameStore((s) => s.cashout);

  const balance = useStore((s) => s.balance);
  const updateBalance = useStore((s) => s.updateBalance);

  const { multiplier, payout } = usePayoutCalculator(revealedGems, betAmount);

  const { playClick, playWin } = useSoundEffects();

  const handleClick = () => {
    playClick();

    if(status === "IN_PROGRESS") {
      cashout(playWin);
      updateBalance(payout || 0);
    } else {
      if(betAmount <= balance) {
        startGame();
        updateBalance(-betAmount);
      }
    }
  }
  
  return (
    <div className={styles.buttonHolder}>
          <button className={styles.placeBet} onClick={handleClick}>{status === "IN_PROGRESS" ? `Cashout ${payout?.toFixed(2)}$` : "Place Bet"}</button>
    </div>

  )
}

export default BetButton