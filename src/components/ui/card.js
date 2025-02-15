import React from 'react';

/**
 * A simple placeholder for a "Card" component.
 * Replace the <div> styles with whatever you want.
 */
export function Card({ children }) {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: 4,
      margin: '1rem 0',
      padding: '1rem'
    }}>
      {children}
    </div>
  );
}

/**
 * A simple placeholder for a "CardContent" component.
 * Right now, it's just a plain <div>.
 */
export function CardContent({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}