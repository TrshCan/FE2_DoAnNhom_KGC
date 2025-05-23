import React, { useState, useEffect, useCallback } from 'react';
import '../assets/css/CardGameBoard.css';

const initialDeck = [
  { id: 1, icon: '🔥', atk: 5, hp: 3 },
  { id: 2, icon: '⚔️', atk: 3, hp: 4 },
  { id: 3, icon: '🧠', atk: 2, hp: 6 },
  { id: 4, icon: '💧', atk: 4, hp: 3 },
  { id: 5, icon: '🌪️', atk: 3, hp: 5 },
  { id: 6, icon: '🌟', atk: 4, hp: 3 },
  { id: 7, icon: '🌙', atk: 3, hp: 5 },
  { id: 8, icon: '🔥', atk: 5, hp: 2 },
  { id: 9, icon: '⚔️', atk: 3, hp: 3 },
  { id: 10, icon: '🧠', atk: 2, hp: 5 },
];

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Card = ({ card, onClick, isPlayable, isOpponent, isFaceDown, isSelected, isPreview }) => (
  <div
    className={`card ${isPlayable ? 'playable' : ''} ${isOpponent ? 'opponent' : ''} ${isFaceDown ? 'card-back' : ''} ${isSelected ? 'selected' : ''} ${isPreview ? 'preview' : ''}`}
    onClick={onClick}
    role="button"
    tabIndex={isPlayable ? 0 : -1}
    onKeyDown={(e) => isPlayable && e.key === 'Enter' && onClick()}
    aria-label={isFaceDown ? 'Bài úp' : `Bài: ${card.icon}, Tấn công: ${card.atk}, Máu: ${card.hp}`}
  >
    {(!isFaceDown || isPreview) && (
      <>
        <div className="card-icon">{card.icon}</div>
        <div className="card-stats">
          <span className="attack">⚔ {card.atk}</span>
          <span className="hp">❤️ {card.hp}</span>
        </div>
      </>
    )}
  </div>
);

const CardGameBoard = () => {
  const [gamePhase, setGamePhase] = useState('select');
  const [selectedCards, setSelectedCards] = useState([]);
  const [handCards, setHandCards] = useState([]);
  const [opponentHand, setOpponentHand] = useState([]);
  const [battleZone, setBattleZone] = useState({ 
    player: null, 
    opponent: null, 
    playerFaceDown: true, 
    opponentFaceDown: true,
    playerPreview: false,
    opponentPreview: false
  });
  const [discardPile, setDiscardPile] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('player');
  const [gameStatus, setGameStatus] = useState('playing');
  const [message, setMessage] = useState('Chọn 5 lá bài để bắt đầu trận đấu!');
  const [compareStat, setCompareStat] = useState('atk');
  const [countdown, setCountdown] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  // Reset game
  const resetGame = () => {
    setGamePhase('select');
    setSelectedCards([]);
    setHandCards([]);
    setOpponentHand([]);
    setBattleZone({ 
      player: null, 
      opponent: null, 
      playerFaceDown: true, 
      opponentFaceDown: true,
      playerPreview: false,
      opponentPreview: false
    });
    setDiscardPile([]);
    setCurrentTurn('player');
    setGameStatus('playing');
    setMessage('Chọn 5 lá bài để bắt đầu trận đấu!');
    setCompareStat('atk');
    setCountdown(0);
    setShowComparison(false);
  };

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && showComparison) {
      compareCards();
      setShowComparison(false);
    }
  }, [countdown, showComparison]);

  // Select card in selection phase
  const selectCard = (card) => {
    if (selectedCards.some((c) => c.id === card.id)) {
      setSelectedCards(selectedCards.filter((c) => c.id !== card.id));
      setMessage(`Đã bỏ chọn bài ${card.icon}. Chọn ${5 - selectedCards.length + 1} lá bài nữa.`);
    } else if (selectedCards.length < 5) {
      setSelectedCards([...selectedCards, card]);
      setMessage(`Đã chọn bài ${card.icon}. Chọn ${5 - selectedCards.length - 1} lá bài nữa.`);
    } else {
      setMessage('Đã chọn đủ 5 lá bài! Nhấn "Bắt Đầu Trận Đấu" để tiếp tục.');
    }
  };

  // Toggle compare stat
  const toggleCompareStat = () => {
    setCompareStat((prev) => (prev === 'atk' ? 'hp' : 'atk'));
    setMessage(`So sánh theo ${compareStat === 'atk' ? 'Máu (HP)' : 'Tấn công (ATK)'}.`);
  };

  // Start game
  const startGame = () => {
    if (selectedCards.length !== 5) {
      setMessage('Vui lòng chọn đúng 5 lá bài!');
      return;
    }
    setHandCards(selectedCards);
    const shuffledDeck = shuffleArray(initialDeck.filter((card) => !selectedCards.some((c) => c.id === card.id)));
    const opponentCards = shuffledDeck
      .sort((a, b) => b.atk - a.atk)
      .slice(0, 5);
    setOpponentHand(opponentCards);
    setGamePhase('playing');
    setMessage(`Trò chơi bắt đầu! Chọn một lá bài để đặt vào khu vực chiến đấu. So sánh theo ${compareStat === 'atk' ? 'Tấn công (ATK)' : 'Máu (HP)'}.`);
  };

  // Player plays a card
  const playCard = (index) => {
    if (currentTurn !== 'player' || gameStatus !== 'playing') {
      setMessage('Chưa đến lượt bạn hoặc trò chơi đã kết thúc!');
      return;
    }
    if (battleZone.player) {
      setMessage('Bạn đã đặt một lá bài cho lượt này!');
      return;
    }
    if (handCards.length === 0) {
      setGameStatus('lost');
      setMessage('Bạn thua! Hết bài để chơi.');
      return;
    }

    const cardToPlay = handCards[index];
    setHandCards(handCards.filter((_, i) => i !== index));
    setBattleZone({ 
      ...battleZone, 
      player: cardToPlay, 
      playerFaceDown: false,
      playerPreview: true
    });
    setMessage('Đã đặt bài! Nhấn "Kết Thúc Lượt" để tiếp tục.');
  };

  // Player ends turn
  const endTurn = useCallback(() => {
    if (currentTurn !== 'player' || gameStatus !== 'playing') {
      setMessage('Chưa đến lượt bạn hoặc trò chơi đã kết thúc!');
      return;
    }
    if (!battleZone.player) {
      setMessage('Bạn phải đặt một lá bài trước khi kết thúc lượt!');
      return;
    }

    // Hide player's card preview
    setBattleZone(prev => ({ 
      ...prev, 
      playerFaceDown: true,
      playerPreview: false 
    }));
    
    setCurrentTurn('opponent');
    setMessage('Đối thủ đang chọn bài...');
    
    // AI plays a card after a short delay
    setTimeout(() => {
      opponentTurn();
    }, 1000);
  }, [currentTurn, gameStatus, battleZone.player]);

  // Opponent's turn
  const opponentTurn = useCallback(() => {
    if (gameStatus !== 'playing') return;

    if (opponentHand.length > 0 && !battleZone.opponent) {
      // AI chooses card (70% highest stat, 30% random)
      let cardToPlay;
      const randomChoice = Math.random();
      if (randomChoice < 0.7) {
        cardToPlay = opponentHand.reduce((max, card) => 
          (!max || card[compareStat] > max[compareStat] ? card : max), null);
      } else {
        const randomIndex = Math.floor(Math.random() * opponentHand.length);
        cardToPlay = opponentHand[randomIndex];
      }

      setOpponentHand(opponentHand.filter(card => card.id !== cardToPlay.id));
      setBattleZone(prev => ({ 
        ...prev, 
        opponent: cardToPlay,
        opponentFaceDown: true,
        opponentPreview: true
      }));
      
      // After AI plays, start countdown
      setTimeout(() => {
        setBattleZone(prev => ({ 
          ...prev, 
          opponentPreview: false 
        }));
        setCountdown(5);
        setShowComparison(true);
        setMessage('Chuẩn bị so sánh bài...');
      }, 1000);
    }
  }, [gameStatus, opponentHand, battleZone.opponent, compareStat]);

  // Compare cards after countdown
  const compareCards = useCallback(() => {
    const playerCard = battleZone.player;
    const opponentCard = battleZone.opponent;
    
    if (!playerCard || !opponentCard) {
      setMessage('Không đủ bài để so sánh!');
      setCurrentTurn('player');
      setBattleZone({ 
        player: null, 
        opponent: null, 
        playerFaceDown: true, 
        opponentFaceDown: true,
        playerPreview: false,
        opponentPreview: false
      });
      return;
    }

    // Show both cards
    setBattleZone(prev => ({ 
      ...prev, 
      playerFaceDown: false,
      opponentFaceDown: false 
    }));

    const statLabel = compareStat === 'atk' ? 'Tấn công (ATK)' : 'Máu (HP)';
    let newPlayerCard = { ...playerCard };
    let newOpponentCard = { ...opponentCard };
    let newMessage = '';

    // Compare stats
    if (playerCard[compareStat] > opponentCard[compareStat]) {
      const difference = playerCard[compareStat] - opponentCard[compareStat];
      newOpponentCard.hp -= difference;
      newMessage = `Bài của bạn mạnh hơn! Đối thủ mất ${difference} HP.`;
    } else if (opponentCard[compareStat] > playerCard[compareStat]) {
      const difference = opponentCard[compareStat] - playerCard[compareStat];
      newPlayerCard.hp -= difference;
      newMessage = `Bài đối thủ mạnh hơn! Bạn mất ${difference} HP.`;
    } else {
      newMessage = `Hòa! Cả hai bài có ${statLabel} bằng nhau.`;
    }

    // Update cards
    setTimeout(() => {
      // Check if cards are destroyed
      if (newPlayerCard.hp <= 0) {
        setDiscardPile(prev => [...prev, playerCard]);
        newMessage += ' Bài của bạn bị phá hủy!';
        newPlayerCard = null;
      }
      
      if (newOpponentCard && newOpponentCard.hp <= 0) {
        setDiscardPile(prev => [...prev, opponentCard]);
        newMessage += ' Bài đối thủ bị phá hủy!';
        newOpponentCard = null;
      }

      setBattleZone({
        player: newPlayerCard,
        opponent: newOpponentCard,
        playerFaceDown: true,
        opponentFaceDown: true,
        playerPreview: false,
        opponentPreview: false
      });

      setMessage(newMessage);

      // Check win conditions
      const playerHasCards = handCards.length > 0 || newPlayerCard;
      const opponentHasCards = opponentHand.length > 0 || newOpponentCard;

      if (!playerHasCards && !opponentHasCards) {
        setGameStatus('draw');
        setMessage('Hòa! Cả hai hết bài.');
      } else if (!playerHasCards) {
        setGameStatus('lost');
        setMessage('Bạn thua! Hết bài để chơi.');
      } else if (!opponentHasCards) {
        setGameStatus('won');
        setMessage('Bạn thắng! Đối thủ hết bài.');
      } else {
        setCurrentTurn('player');
        setMessage('Lượt của bạn! Chọn một lá bài để đặt.');
      }
    }, 1000);
  }, [battleZone.player, battleZone.opponent, compareStat, handCards, opponentHand]);

  return (
    <div className="card-game-board">
      {gamePhase === 'select' ? (
        <div className="select-phase">
          <h2>Chọn 5 Lá Bài</h2>
          <p className="game-message">{message}</p>
          <div className="card-selection">
            {initialDeck.map((card) => (
              <Card
                key={card.id}
                card={card}
                onClick={() => selectCard(card)}
                isPlayable={selectedCards.length < 5 || selectedCards.some((c) => c.id === card.id)}
                isSelected={selectedCards.some((c) => c.id === card.id)}
              />
            ))}
          </div>
          <button
            className="btn-start"
            onClick={startGame}
            disabled={selectedCards.length !== 5}
            aria-label="Bắt đầu trận đấu"
          >
            Bắt Đầu Trận Đấu
          </button>
        </div>
      ) : (
        <>
          <h2>Lượt hiện tại: {currentTurn === 'player' ? 'Bạn' : 'Đối thủ'}</h2>
          {countdown > 0 && <div className="countdown">Mở bài sau: {countdown}s</div>}
          <p className="game-message">{message}</p>
          
          <button
            className="btn-reset"
            onClick={toggleCompareStat}
            disabled={currentTurn !== 'player' || gameStatus !== 'playing'}
            aria-label={`Chuyển sang so sánh theo ${compareStat === 'atk' ? 'Máu (HP)' : 'Tấn công (ATK)'}`}
          >
            So sánh theo {compareStat === 'atk' ? 'Máu (HP)' : 'Tấn công (ATK)'}
          </button>
          
          {gameStatus !== 'playing' && (
            <button className="btn-reset" onClick={resetGame} aria-label="Chơi lại">
              Chơi Lại
            </button>
          )}

          <div className="opponent-area">
            <h3>Tay Đối Thủ ({opponentHand.length})</h3>
            <div className="opponent-hand">
              {opponentHand.map((card) => (
                <div key={card.id} className="card card-back" aria-label="Bài ẩn của đối thủ"></div>
              ))}
            </div>
          </div>

          <div className="battle-zone">
            <h3>Khu Vực Chiến Đấu</h3>
            <div className="battle-field">
              <div className="player-battle">
                {battleZone.player ? (
                  <Card
                    key={battleZone.player.id}
                    card={battleZone.player}
                    isPlayable={false}
                    isFaceDown={battleZone.playerFaceDown}
                    isPreview={battleZone.playerPreview}
                  />
                ) : (
                  <div className="empty-field">Chưa có bài của bạn</div>
                )}
              </div>
              <div className="vs">🆚</div>
              <div className="opponent-battle">
                {battleZone.opponent ? (
                  <Card
                    key={battleZone.opponent.id}
                    card={battleZone.opponent}
                    isOpponent
                    isPlayable={false}
                    isFaceDown={battleZone.opponentFaceDown}
                    isPreview={battleZone.opponentPreview}
                  />
                ) : (
                  <div className="empty-field">Chưa có bài của đối thủ</div>
                )}
              </div>
            </div>
          </div>

          <div className="game-deck">
            <div className="deck-discard">
              <div className="card discard" aria-label={`Mộ: ${discardPile.length} lá`}>♻️ ({discardPile.length})</div>
            </div>
          </div>

          <div className="player-area">
            <h3>Tay Bạn ({handCards.length})</h3>
            <div className="player-hand">
              {handCards.map((card, index) => (
                <Card
                  key={card.id}
                  card={card}
                  onClick={() => playCard(index)}
                  isPlayable={currentTurn === 'player' && gameStatus === 'playing' && !battleZone.player}
                />
              ))}
            </div>
            <button
              className="btn-end-turn"
              onClick={endTurn}
              disabled={currentTurn !== 'player' || gameStatus !== 'playing' || !battleZone.player}
              aria-label="Kết thúc lượt của bạn"
            >
              Kết Thúc Lượt
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CardGameBoard;