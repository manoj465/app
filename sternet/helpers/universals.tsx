import React from 'react';

export type UniversalsProps = {
  /**
   * a text to be rendered in the component.
   */
  text: string
};

export function Universals({ text }: UniversalsProps) {
  return (
    <div
      style={{ backgroundColor: "#00ffff" }}>
      <div>{text}</div>
    </div>
  );
}
