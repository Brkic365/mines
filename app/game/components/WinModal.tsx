"use client";

import React from "react";
import styles from "@/styles/components/WinModal.module.scss";
import { useGameStore } from "../hooks/useGameStore";
import { motion, AnimatePresence } from "framer-motion";

function WinModal() {
  const status = useGameStore((s) => s.status);
  const finalPayout = useGameStore((s) => s.finalPayout);
  const betAmount = useGameStore((s) => s.betAmount);

  const isVisible = status === "WON" && finalPayout && betAmount;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.section
          className={styles.winModal}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
        >
          <h1>{(finalPayout / betAmount).toFixed(2)}x</h1>
          <p>{finalPayout.toFixed(2)} EUR</p>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

export default WinModal;
