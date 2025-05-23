// src/components/Card.jsx
import React from 'react';
import './Card.css';

const Card = ({ card, onSelect, isSelected, isDead }) => {
  return (
    <div
      className={`card ${isSelected ? 'selected' : ''} ${isDead ? 'dead' : ''}`}
      onClick={() => !isDead && onSelect(card)}
    >
      <img src={card.image} alt={card.name} />
      <p>{card.name}</p>
      <p>HP: {card.hp} | ATK: {card.atk} | DEF: {card.def}</p>
    </div>
  );
};

export default Card;