import Card from './Card';
import styles from '../PlayerArea.module.css';

const PlayerArea = ({ isOpponent, hp, mana, deckCount, hand, isActive, endTurn, playCard, errorMessage }) => {
  return (
    <div className={`${styles.playerArea} ${isOpponent ? styles.opponent : ''}`}>
      <div className={styles.info}>
        <span>{isOpponent ? 'Đối thủ' : 'Người chơi'} HP: {hp}</span>
        <span>Mana: {mana}</span>
        <span>Deck: {deckCount}</span>
      </div>
      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
      <div className={styles.hand}>
        {hand.map((card, index) => (
          <Card
            key={card.id || index}
            card={card}
            isActive={isActive}
            mana={mana} // Truyền mana để kiểm tra kéo-thả
            playerType={isOpponent ? 'opponent' : 'player'}
            playCard={playCard}
          />
        ))}
      </div>
      {!isOpponent && (
        <button
          className={styles.endTurnButton}
          disabled={!isActive}
          onClick={endTurn}
        >
          Kết thúc lượt
        </button>
      )}
    </div>
  );
};

export default PlayerArea;