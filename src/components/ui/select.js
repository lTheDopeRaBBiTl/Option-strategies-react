import React from 'react';

// Basic <select> that calls onValueChange when user picks a value
export function Select({ value, onValueChange, children }) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      style={{ padding: '0.25rem', border: '1px solid #ccc', borderRadius: '4px' }}
    >
      {children}
    </select>
  );
}

// For now, these sub-components can be placeholders.
// We'll just pass children through. 
export function SelectContent({ children }) {
  return <>{children}</>;
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}

export function SelectTrigger({ children }) {
  return <>{children}</>;
}

export function SelectValue({ children }) {
  return <>{children}</>;
}