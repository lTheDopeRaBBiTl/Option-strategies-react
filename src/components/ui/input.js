import React from 'react';

/**
 * A simple placeholder for an "Input" component.
 * Right now, it's just a basic <input> that forwards props.
 */
export function Input(props) {
  return (
    <input
      {...props}
      style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: 4 }}
    />
  );
}