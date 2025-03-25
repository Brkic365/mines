"use client"

import React, { useState } from 'react'
import styles from "@/styles/components/LabelInput.module.scss"

function LabelInput({inputable, label, value, onChange = () => {}}: {
  inputable: boolean,
  label: string,
  value: number
  onChange?: (value: string) => void
}) {
  const [inputValue, setInputValue] = useState(value.toString());

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