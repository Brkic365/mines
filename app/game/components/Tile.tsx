"use client";

import React, { useMemo, useCallback, useState } from "react";
import { motion } from "framer-motion";
import styles from "@/styles/components/Tile.module.scss";
import { useGameStore } from "../hooks/useGameStore";
import { useSoundEffects } from "../hooks/useSoundEffects";
import { useWalletStore } from "@/app/hooks/useWalletStore";

interface Props {
  tileId: string;
  row: number;
  col: number;
}

function TileElement({ row, col }: Props) {
  const tile = useGameStore((s) => s.board[row]?.[col]);
  const status = useGameStore((s) => s.status);
  const revealTile = useGameStore((s) => s.revealTile);
  const cashout = useGameStore((s) => s.cashout);

  const updateBalance = useWalletStore((s) => s.updateBalance);

  const sounds = useSoundEffects();

  const isIdle = status === "IDLE";
  const [isRevealing, setIsRevealing] = useState(false);

  if (!tile) return null;

  const { revealed, isMine, clicked } = tile;
  const isGem = revealed && !isMine;
  const isBomb = revealed && isMine;

  const tileStyle = useMemo(() => {
    const base = {
      opacity: clicked ? 1 : 0.4,
    };

    if (isGem) return { ...base, backgroundColor: "#061C04", borderColor: "#AAFF00" };
    if (isBomb) return { ...base, backgroundColor: "#380707", borderColor: "#FF4444" };
    return { ...base, backgroundColor: "#242545", borderColor: "#373E65" };
  }, [isGem, isBomb, clicked]);

  const handleClick = useCallback(async () => {
    if (revealed || isIdle || isRevealing) return;

    setIsRevealing(true);

    const result = await revealTile(row, col, sounds);
    if (result === "WON") {
      const newBalance = await cashout(sounds.playWin);
      updateBalance(newBalance || 0);
    }

    setIsRevealing(false);
  }, [revealed, isIdle, isRevealing, row, col, revealTile, sounds, updateBalance]);

  return (
    <motion.div
      className={`
        ${styles.tile}
        ${revealed ? styles.revealed : ""}
        ${status === "LOST" || status === "WON" ? styles.notHoverable : styles.hoverable}
      `}
      initial={false}
      animate={tileStyle}
      transition={{ duration: 0.15 }}
      onClick={handleClick}
    >
      {isGem && (
        <motion.img
          src="/images/gem.png"
          alt="Gem"
          className={styles.gem}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "tween", stiffness: 300, damping: 20 }}
        />
      )}
      {isBomb && (
        <motion.img
          src="/images/bomb.png"
          alt="Bomb"
          className={styles.bomb}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1, rotate: [0, -10, 10, -5, 0] }}
          transition={{ type: "tween", stiffness: 260, damping: 15 }}
        />
      )}
    </motion.div>
  );
}

export default TileElement;
