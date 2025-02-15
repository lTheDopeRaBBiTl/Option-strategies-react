import React from 'react';

export function Button({ onClick, children, variant, disabled }) {
  // Basic styling placeholders
  const style = {
    padding: '0.5rem 1rem',
    border: '1px solid #ccc',
    background: variant === 'destructive' ? '#ff4d4f' : '#007bff',
    color: '#fff',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    borderRadius: '4px',
    marginTop: '1rem'
  };

  return (
    <button onClick={onClick} style={style} disabled={disabled}>
      {children}
    </button>
  );
}