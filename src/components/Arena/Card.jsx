import { useDrag } from 'react-dnd';
import styles from '../Card.module.css';

const Card = ({ card, isActive, mana, playerType, playCard }) => {
  const isPlayable = isActive && mana >= card.manaCost; // Kiểm tra có thể chơi không

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { card, playerType },
    canDrag: isPlayable, // Chỉ kéo được nếu đủ mana và là lượt đúng
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={isPlayable ? drag : null}
      className={`${styles.card} ${isDragging ? styles.dragging : ''} ${!isPlayable ? styles.disabled : ''}`}
      onClick={() => isPlayable && playCard(card, playerType)}
    >
      <div>{card.name || card}</div>
      {card.manaCost && <div>Mana: {card.manaCost}</div>}
    </div>
  );
};

export default Card;