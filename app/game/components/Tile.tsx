'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/components/Tile.module.scss';
import { useGameStore } from '../hooks/useGameStore';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface Props {
  tileId: string;
  row: number;
  col: number;
}

function TileElement({ tileId, row, col }: Props) {
  // Select the current tile directly from the store (live!)
  const tile = useGameStore((s) => s.board[row]?.[col]);
  const status = useGameStore((s) => s.status);
  const revealTile = useGameStore((s) => s.revealTile);

  const sounds = useSoundEffects();

  if (!tile) return null;

  const isRevealed = tile.revealed;
  const isOpened = tile.opened;
  const isGem = isRevealed && !tile.hasMine;
  const isBomb = isRevealed && tile.hasMine;
  const isIdle = status === 'IDLE';

  const tileStyle = useMemo(() => {
    if (isGem) {
      return {
        backgroundColor: '#061C04',
        borderColor: '#AAFF00',
        opacity: isOpened ? 1 : 0.4
      };
    } else if (isBomb) {
      return {
        backgroundColor: '#380707',
        borderColor: '#FF4444',
        opacity: isOpened ? 1 : 0.7
      };
    } else {
      return {
        backgroundColor: '#242545',
        borderColor: '#373E65',
      };
    }
  }, [isGem, isBomb]);

  const handleClick = () => {
    if (!isRevealed && !isIdle) {
      revealTile(row, col, sounds);
    }
  };

  return (
    <motion.div
      className={
        `${styles.tile} 
        ${isRevealed ? styles.revealed : ''} 
        ${status === "LOST" || status === "WON" ? styles.notHoverable : styles.hoverable}`
      }
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
          transition={{ type: 'tween', stiffness: 300, damping: 15 }}
        />
      )}

      {isBomb && (
        <motion.img
          src="/images/bomb.png"
          alt="Bomb"
          className={styles.bomb}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1, rotate: [0, -10, 10, -5, 0] }}
          transition={{ type: 'tween', stiffness: 260, damping: 12 }}
        />
      )}
    </motion.div>
  );
}

export default TileElement;
