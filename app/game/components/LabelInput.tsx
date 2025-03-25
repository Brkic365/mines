"use client"

import React, { useState } from 'react'
import styles from "@/styles/components/LabelInput.module.scss"
import { useGameStore } from '../hooks/useGameStore'

function LabelInput({inputable, label, value, onChange = () => {}}: {
  inputable: boolean,
  label: string,
  value: number
  onChange?: (value: string) => void
}) {
  const status = useGameStore((s) => s.status);

  const [inputValue, setInputValue] = useState(value.toFixed(2).toString());

  const handleBlur = () => {
    const num = parseFloat(inputValue);
    if (!isNaN(num)) {
      const formatted = num.toFixed(2);
      setInputValue(formatted);
      onChange?.(formatted);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  console.log(status);
  
  return (
    <div className={styles.labelInput}>
    <label>{label}</label>
    {
      inputable ? 
      <input
        type="number"
        min={1}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={status === "IN_PROGRESS"}
      />
    : 
    <div>
      <p>{value.toFixed(2)}</p>
    </div>
    }
  </div>
  )
}

export default LabelInput