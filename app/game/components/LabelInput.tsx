"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "@/styles/components/LabelInput.module.scss";
import { useGameStore } from "../hooks/useGameStore";

interface LabelInputProps {
  inputable: boolean;
  label: string;
  value: number;
  onChange?: (value: string) => void;
}

function LabelInput({ inputable, label, value, onChange }: LabelInputProps) {
  const status = useGameStore((s) => s.status);
  const [inputValue, setInputValue] = useState(value.toFixed(2));

  useEffect(() => {
    setInputValue(value.toFixed(2));
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    const num = parseFloat(inputValue);
    if (!isNaN(num)) {
      const formatted = num.toFixed(2);
      setInputValue(formatted);
      onChange?.(formatted);
    }
  }, [inputValue, onChange]);

  return (
    <div className={styles.labelInput}>
      <label>{label}</label>

      {inputable ? (
        <input
          type="number"
          min={1}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={status === "IN_PROGRESS"}
        />
      ) : (
        <div>
          <p>{value.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default LabelInput;
