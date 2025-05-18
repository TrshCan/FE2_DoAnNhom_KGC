import { useDrop } from 'react-dnd';
import { useState } from 'react';
import Card from './Card';
import styles from '../Battlefield.module.css';

const Battlefield = ({ playCard }) => {
  const [playedCards, setPlayedCards] = useState([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: (item) => {
      playCard(item.card, item.playerType);
      setPlayedCards((prev) => [...prev, item.card]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`${styles.battlefield} ${isOver ? styles.highlight : ''}`}
    >
      <h2>Battlefield</h2>
      <div className={styles.playedCards}>
        {playedCards.map((card, index) => (
          <Card
            key={card.id || index}
            card={card}
            isActive={false}
            mana={0} // Không cần mana trên sàn đấu
            playerType={null}
            playCard={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default Battlefield;