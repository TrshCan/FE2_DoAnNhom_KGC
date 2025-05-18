import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PlayerArea from './Arena/PlayerArena';
import Battlefield from './Arena/Battlefield';
import styles from './Arena.module.css';

const Arena = () => {
  const [gameState, setGameState] = useState({
    currentTurn: 'player',
    cardsPlayedThisTurn: 0, // Theo dõi số lá bài đã chơi trong lượt
    errorMessage: '', // Lưu thông báo lỗi
    player: {
      hp: 30,
      mana: 5,
      maxMana: 5,
      deckCount: 20,
      hand: [
        { id: 1, name: 'Thẻ 1', manaCost: 2 },
        { id: 2, name: 'Thẻ 2', manaCost: 3 },
        { id: 3, name: 'Thẻ 3', manaCost: 1 },
        { id: 4, name: 'Thẻ 4', manaCost: 4 },
      ],
    },
    opponent: {
      hp: 30,
      mana: 5,
      maxMana: 5,
      deckCount: 20,
      hand: [
        { id: 5, name: 'Thẻ ẩn 1', manaCost: 2 },
        { id: 6, name: 'Thẻ ẩn 2', manaCost: 3 },
        { id: 7, name: 'Thẻ ẩn 3', manaCost: 1 },
      ],
    },
  });

  const endTurn = () => {
    setGameState((prev) => {
      const newTurn = prev.currentTurn === 'player' ? 'opponent' : 'player';
      const newState = {
        ...prev,
        currentTurn: newTurn,
        cardsPlayedThisTurn: 0, // Reset số lá bài đã chơi
        errorMessage: '', // Xóa thông báo lỗi
      };

      // Reset mana
      if (newTurn === 'player') {
        newState.player.mana = newState.player.maxMana;
      } else {
        newState.opponent.mana = newState.opponent.maxMana;
      }

      // Rút 1 lá bài (đề xuất cải tiến)
      if (newTurn === 'player' && newState.player.deckCount > 0) {
        newState.player.deckCount -= 1;
        newState.player.hand.push({
          id: Date.now(), // ID tạm, nên thay bằng logic thực
          name: `Thẻ mới ${newState.player.hand.length + 1}`,
          manaCost: Math.floor(Math.random() * 3) + 1,
        });
      }

      return newState;
    });
  };

  const playCard = (card, playerType) => {
    setGameState((prev) => {
      const player = playerType === 'player' ? prev.player : prev.opponent;
      // Kiểm tra lỗi
      if (prev.currentTurn !== playerType) {
        return { ...prev, errorMessage: 'Không phải lượt của bạn!' };
      }
      if (player.mana < card.manaCost) {
        return { ...prev, errorMessage: `Không đủ mana (cần ${card.manaCost}, còn ${player.mana})!` };
      }
      if (prev.cardsPlayedThisTurn >= 1) {
        return { ...prev, errorMessage: 'Bạn chỉ được chơi 1 lá bài mỗi lượt!' };
      }

      // Logic chơi thẻ
      const newHand = player.hand.filter((c) => c.id !== card.id);
      const newMana = player.mana - card.manaCost;
      const updatedPlayer = {
        ...player,
        mana: newMana,
        hand: newHand,
      };

      return {
        ...prev,
        [playerType]: updatedPlayer,
        cardsPlayedThisTurn: prev.cardsPlayedThisTurn + 1,
        errorMessage: '',
      };
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.arena}>
        <PlayerArea
          isOpponent={true}
          hp={gameState.opponent.hp}
          mana={gameState.opponent.mana}
          deckCount={gameState.opponent.deckCount}
          hand={gameState.opponent.hand}
          isActive={gameState.currentTurn === 'opponent'}
          playCard={playCard}
          errorMessage={gameState.currentTurn === 'opponent' ? gameState.errorMessage : ''}
        />
        <Battlefield playCard={playCard} />
        <PlayerArea
          isOpponent={false}
          hp={gameState.player.hp}
          mana={gameState.player.mana}
          deckCount={gameState.player.deckCount}
          hand={gameState.player.hand}
          isActive={gameState.currentTurn === 'player'}
          endTurn={endTurn}
          playCard={playCard}
          errorMessage={gameState.currentTurn === 'player' ? gameState.errorMessage : ''}
        />
      </div>
    </DndProvider>
  );
};

export default Arena;