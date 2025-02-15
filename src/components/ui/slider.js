import React from 'react';

/**
 * A simple placeholder for a "Slider" component.
 * Right now, it's just an <input type="range">.
 * We forward the props and use onChange to call onValueChange.
 */
export function Slider({ value, onValueChange, min, max, step, className }) {
  // value is an array in your code (e.g. [shortStrike]) so we'll assume [0] is the actual numeric value
  const numericValue = Array.isArray(value) ? value[0] : value || 0;

  return (
    <input
      type="range"
      className={className}
      min={min}
      max={max}
      step={step}
      value={numericValue}
      onChange={(e) => onValueChange([Number(e.target.value)])}
      style={{ width: '100%' }}
    />
  );
}