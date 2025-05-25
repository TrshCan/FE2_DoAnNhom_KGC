import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import '../assets/css/CardGameBoard.css';
import BASE_URL from './BaseURL';

const socket = io('http://localhost:4000', {
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 500,
});

const Card = ({ card, onClick, isPlayable, isOpponent, isFaceDown, isSelected, isPreview }) => {
  console.log(`Rendering Card: ${card?.name || 'Unknown'}, ID: ${card?.id}, FaceDown: ${isFaceDown}, Preview: ${isPreview}`);
  return (
    <div
      className={`card ${isPlayable ? 'playable' : ''} ${isOpponent ? 'opponent' : ''} ${isFaceDown ? 'card-back' : ''} ${isSelected ? 'selected' : ''} ${isPreview ? 'preview' : ''}`}
      onClick={isPlayable ? onClick : undefined}
      role="button"
      tabIndex={isPlayable ? 0 : -1}
      onKeyDown={(e) => isPlayable && e.key === 'Enter' && onClick()}
      aria-label={isFaceDown ? 'Bài úp' : `Bài: ${card.name}, Tấn công: ${card.atk}`}
    >
      {(!isFaceDown || isPreview) && (
        <>
          <div className="card-icon card">
            <img
              src={`${BASE_URL}/src/assets/img/heroes/cards/${card.icon}`}
              alt={card.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/60x80/cccccc/333333?text=Card';
              }}
            />
          </div>
          <div className="card-stats">
            <span className="attack">⚔ {card.atk}</span>
          </div>
        </>
      )}
    </div>
  );
};

const CardGameBoard = () => {
  const [gamePhase, setGamePhase] = useState('select'); // 'select', 'playing'
  const [selectedCards, setSelectedCards] = useState([]);
  const [handCards, setHandCards] = useState([]);
  const [opponentHand, setOpponentHand] = useState([]);
  const [battleZone, setBattleZone] = useState({
    player: null,
    opponent: null,
    playerFaceDown: true,
    opponentFaceDown: true,
    playerPreview: false,
    opponentPreview: false,
  });
  const [discardPile, setDiscardPile] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [gameStatus, setGameStatus] = useState('playing');
  const [message, setMessage] = useState('Đang tải bài của bạn...');
  const [countdown, setCountdown] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [userCards, setUserCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [opponentReady, setOpponentReady] = useState(false);
  const [isEndingTurn, setIsEndingTurn] = useState(false);
  const [opponent, setOpponent] = useState(null);

  const { state } = useLocation();
  const navigate = useNavigate();

  const roomId = state?.roomId;
  const username = state?.username;
  const userId = String(state?.userId);

  const validateTurn = useCallback(
    (turn) => {
      if (turn === userId) return userId;
      if (opponent && turn === opponent.userId) return opponent.userId;
      console.warn(`Invalid turn received: ${turn}. Falling back to ${currentTurn || userId}.`);
      return currentTurn || userId;
    },
    [userId, opponent, currentTurn]
  );

  const setCurrentTurnWithLog = useCallback((newTurn) => {
    console.log(`Setting currentTurn: ${newTurn}`);
    setCurrentTurn(newTurn);
  }, []);

  // Navigation state validation
  useEffect(() => {
    if (!roomId || !state?.opponent || !state.opponent.opponentName || !state.opponent.opponentId || !username || !userId) {
      setError('Thiếu thông tin cần thiết để bắt đầu trận đấu!');
      setMessage('Thiếu thông tin cần thiết để bắt đầu trận đấu!');
      setLoading(false);
      navigate('/mainhall');
      return;
    }
    setOpponent({ userId: String(state.opponent.opponentId), username: state.opponent.opponentName });
  }, [roomId, state, username, userId, navigate]);

  // Fetch user's cards
  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        setLoading(true);
        if (!userId) {
          setError('Không tìm thấy thông tin người dùng!');
          setMessage('Không tìm thấy thông tin người dùng!');
          setLoading(false);
          navigate('/login');
          return;
        }

        const response = await fetch(`/api/heroes.php`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        console.log('Heroes API response:', data);

        if (!data.success || !data.heroes || data.heroes.length === 0) {
          setError('Bạn chưa có lá bài nào!');
          setMessage('Bạn chưa có lá bài nào!');
          setLoading(false);
          return;
        }

        const mappedCards = data.heroes.map((card) => ({
          id: card.user_hero_id,
          icon: card.card,
          atk: card.ATK,
          hp: card.HP,
          name: card.name,
        }));

        setUserCards(mappedCards);
        setLoading(false);
      } catch (err) {
        setError('Lỗi khi tải dữ liệu bài: ' + err.message);
        setLoading(false);
        navigate('/login');
      }
    };

    fetchUserCards();
  }, [userId, navigate]);

  // Game logic functions
  const selectCard = (card) => {
    setSelectedCards((prev) => {
      if (prev.some((c) => c.id === card.id)) {
        return prev.filter((c) => c.id !== card.id);
      } else if (prev.length < 2) {
        return [...prev, card];
      } else {
        setMessage('Bạn chỉ có thể chọn tối đa 2 lá bài!');
        return prev;
      }
    });
  };

  const startGame = () => {
    if (selectedCards.length !== 2) {
      setMessage('Vui lòng chọn đúng 2 lá bài!');
      return;
    }
    setHandCards([...selectedCards]);
    setGamePhase('playing');
    socket.emit('playerReady', {
      roomId,
      username,
      userId,
      cardCount: selectedCards.length,
    });
  };

  const playCard = (index) => {
    if (currentTurn !== userId) {
      setMessage('Chưa đến lượt của bạn!');
      return;
    }
    if (gameStatus !== 'playing') {
      setMessage('Trò chơi đã kết thúc!');
      return;
    }
    if (battleZone.player) {
      setMessage('Bạn đã đặt một lá bài cho lượt này!');
      return;
    }
    if (handCards.length === 0 || !handCards[index]) {
      setGameStatus('lost');
      setMessage('Bạn thua! Hết bài để chơi.');
      socket.emit('gameEnd', { roomId, winner: opponent?.userId || null });
      return;
    }

    const cardToPlay = handCards[index];
    console.log(`Playing card: ${cardToPlay.name} (ID: ${cardToPlay.id}, ATK: ${cardToPlay.atk}, HP: ${cardToPlay.hp})`);
    console.log(`Current handCards:`, JSON.stringify(handCards));
    socket.emit('playCard', { roomId, card: cardToPlay, userId }, (response) => {
      if (response.success) {
        setHandCards((prev) => prev.filter((_, i) => i !== index));
        setBattleZone((prev) => ({
          ...prev,
          player: cardToPlay,
          playerFaceDown: false,
          playerPreview: true,
        }));
        setMessage('Đã đặt bài! Nhấn "Kết Thúc Lượt" để tiếp tục.');
      } else {
        console.error(`playCard failed: ${response.message}`);
        setMessage(response.message || 'Không thể đặt bài!');
        // Force sync to recover from desync
        socket.emit('syncState', { roomId, userId });
      }
    });
  };

  const endTurn = useCallback(() => {
    if (currentTurn !== userId) {
      setMessage('Chưa đến lượt của bạn!');
      return;
    }
    if (gameStatus !== 'playing') {
      setMessage('Trò chơi đã kết thúc!');
      return;
    }
    if (!battleZone.player) {
      setMessage('Bạn phải đặt một lá bài trước khi kết thúc lượt!');
      return;
    }
    if (isEndingTurn) {
      setMessage('Đang xử lý lượt, vui lòng đợi!');
      return;
    }

    setIsEndingTurn(true);
    console.log(`Ending turn for user ${userId} in room ${roomId}`);
    socket.emit('endTurn', { roomId, userId }, (response) => {
      setIsEndingTurn(false);
      if (response.success) {
        setBattleZone((prev) => ({
          ...prev,
          playerFaceDown: true,
          playerPreview: false,
        }));
        setMessage('Đợi đối thủ đặt bài...');
      } else {
        setMessage(response.message || 'Không thể kết thúc lượt!');
      }
    });
  }, [currentTurn, gameStatus, battleZone.player, roomId, userId, isEndingTurn]);

  const resetGame = () => {
    socket.emit('resetGame', { roomId });
    navigate('/mainhall');
  };

  const forceGameStart = () => {
    socket.emit('debugGameStart', { roomId });
  };

  // Socket.IO event listeners
  useEffect(() => {
    if (!roomId || !opponent) return;

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err);
      setMessage('Lỗi kết nối server!');
      navigate('/mainhall');
    });

    socket.on('error', (data) => {
      console.error('Server error:', data);
      setMessage(data.message || 'Lỗi từ server!');
    });

    socket.on('matchFound', (data) => {
      console.log('matchFound received:', data);
      socket.emit('playerReady', {
        roomId: data.roomId,
        username,
        userId,
        cardCount: 2,
      });
    });

    socket.on('opponentReady', (data) => {
      console.log('opponentReady received:', data);
      if (data.success) {
        setOpponentReady(true);
        setOpponentHand(Array(data.cardCount || 2).fill(null).map((_, i) => ({ id: `opponent-placeholder-${i}-${Date.now()}-${Math.random()}` })));
      } else {
        setMessage(data.message || 'Đối thủ chưa sẵn sàng!');
      }
    });

    socket.on('gameStart', (data) => {
      console.log('gameStart received:', data);
      if (data.success && data.currentTurn) {
        setCurrentTurnWithLog(validateTurn(data.currentTurn));
        setGamePhase('playing');
        setGameStatus('playing');
        if (!handCards.length && selectedCards.length) {
          setHandCards([...selectedCards]);
        }
      } else {
        setMessage(data.message || 'Lỗi khi bắt đầu trò chơi!');
      }
    });

    socket.on('opponentPlayed', (data) => {
      console.log('opponentPlayed received:', data);
      if (data.success) {
        setBattleZone((prev) => ({
          ...prev,
          opponent: { id: `temp-opponent-card-${Math.random()}` },
          opponentFaceDown: true,
          opponentPreview: true,
        }));
        setMessage(`${opponent?.username || 'Đối thủ'} đã đặt bài!`);
        setTimeout(() => {
          setBattleZone((prev) => ({ ...prev, opponentPreview: false }));
        }, 1000);
      } else {
        setMessage(data.message || 'Đối thủ không thể đặt bài!');
      }
    });

    socket.on('startComparison', (data) => {
      console.log('startComparison received:', data);
      if (data.success) {
        setBattleZone((prev) => ({
          ...prev,
          player: data.playerCard,
          opponent: data.opponentCard,
          playerFaceDown: false,
          opponentFaceDown: false,
        }));
        setCountdown(5);
        setShowComparison(true);
        setMessage('So sánh bài...');

        let timer = 5;
        const countdownInterval = setInterval(() => {
          timer--;
          setCountdown(timer);
          if (timer <= 0) {
            clearInterval(countdownInterval);
          }
        }, 1000);
      } else {
        setMessage(data.message || 'Lỗi khi bắt đầu so sánh!');
      }
    });

    socket.on('comparisonResult', (data) => {
      console.log('comparisonResult received:', JSON.stringify(data));
      if (data.success) {
        // Clear battle zone
        setBattleZone({
          player: null,
          opponent: null,
          playerFaceDown: true,
          opponentFaceDown: true,
          playerPreview: false,
          opponentPreview: false,
        });

        // Update hand with returned cards
        if (data.updatedCards && Array.isArray(data.updatedCards)) {
          data.updatedCards.forEach((updatedCard) => {
            if (updatedCard.ownerId === userId) {
              console.log(`Adding card ${updatedCard.name} (ID: ${updatedCard.id}) to handCards`);
              setHandCards((prev) => {
                const newHand = [...prev, updatedCard];
                console.log(`Updated handCards:`, JSON.stringify(newHand));
                return newHand;
              });
            }
          });
        }

        // Update discard pile
        if (data.discardedCards && Array.isArray(data.discardedCards)) {
          console.log(`Adding ${data.discardedCards.length} cards to discardPile`);
          setDiscardPile((prev) => [...prev, ...data.discardedCards]);
        }

        // Update opponent hand size
        if (data.opponentHandSize !== undefined) {
          console.log(`Updating opponentHand size to ${data.opponentHandSize}`);
          setOpponentHand(
            Array(data.opponentHandSize).fill(null).map((_, i) => ({
              id: `opponent-placeholder-${i}-${Date.now()}-${Math.random()}`,
            }))
          );
        }

        setCurrentTurnWithLog(validateTurn(data.currentTurn));
        setMessage(data.message);
        setShowComparison(false);
        setCountdown(0);
      } else {
        setMessage(data.message || 'Lỗi khi xử lý kết quả so sánh!');
      }
    });

    socket.on('turnChange', (data) => {
      console.log('turnChange received:', data);
      if (data.success && data.currentTurn) {
        setCurrentTurnWithLog(validateTurn(data.currentTurn));
        setBattleZone((prev) => ({
          ...prev,
          player: null,
          opponent: null,
          playerFaceDown: true,
          opponentFaceDown: true,
          playerPreview: false,
          opponentPreview: false,
        }));
        setMessage(data.message);
      } else {
        setMessage(data.message || 'Lỗi khi chuyển lượt!');
      }
    });

    socket.on('gameEnd', (data) => {
      console.log('gameEnd received:', data);
      if (data.success) {
        setGameStatus(data.winner === userId ? 'won' : data.winner === null ? 'draw' : 'lost');
        setMessage(
          data.winner === userId
            ? 'Bạn thắng!'
            : data.winner === null
              ? 'Hòa! Cả hai hết bài.'
              : 'Bạn thua!'
        );
        setCurrentTurn(null);
      } else {
        setMessage(data.message || 'Lỗi khi kết thúc trò chơi!');
      }
    });

    socket.on('playerDisconnected', (data) => {
      console.log('playerDisconnected received:', data);
      setGameStatus('ended');
      setMessage(data.message || `${opponent?.username || 'Đối thủ'} đã ngắt kết nối.`);
      setCurrentTurn(null);
      setOpponentReady(false);
      setTimeout(() => navigate('/mainhall'), 3000);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('error');
      socket.off('matchFound');
      socket.off('opponentReady');
      socket.off('gameStart');
      socket.off('opponentPlayed');
      socket.off('startComparison');
      socket.off('comparisonResult');
      socket.off('turnChange');
      socket.off('gameEnd');
      socket.off('playerDisconnected');
    };
  }, [roomId, navigate, opponent, userId, handCards, selectedCards, validateTurn, setCurrentTurnWithLog]);

  // Sync state periodically
  useEffect(() => {
    if (gamePhase !== 'playing' || !roomId || !userId) return;

    socket.emit('syncState', { roomId, userId }, (response) => {
      console.log('syncState response:', JSON.stringify(response));
      if (response.success) {
        if (response.currentTurn !== currentTurn) {
          setCurrentTurnWithLog(validateTurn(response.currentTurn));
        }
        setGameStatus(response.gameStatus);
        const playerData = response.players.find((p) => p.userId === userId);
        const opponentData = response.players.find((p) => p.userId !== userId);
        if (playerData && playerData.cards) {
          console.log(`Syncing handCards:`, JSON.stringify(playerData.cards));
          setHandCards(playerData.cards);
        }
        if (opponentData) {
          setOpponentHand(
            Array(opponentData.cardCount || 2).fill(null).map((_, i) => ({
              id: `opponent-placeholder-${i}-${Date.now()}-${Math.random()}`,
            }))
          );
          if (opponentData.cardPlayed && !battleZone.opponent) {
            setBattleZone((prev) => ({
              ...prev,
              opponent: { id: `temp-${Math.random()}` },
              opponentFaceDown: true,
              opponentPreview: true,
            }));
            setTimeout(() => {
              setBattleZone((prev) => ({ ...prev, opponentPreview: false }));
            }, 1000);
          }
        }
      } else {
        setMessage(response.message || 'Lỗi khi đồng bộ trạng thái!');
      }
    });

    const syncInterval = setInterval(() => {
      socket.emit('syncState', { roomId, userId }, (response) => {
        console.log('Periodic syncState response:', JSON.stringify(response));
        if (response.success) {
          if (response.currentTurn !== currentTurn) {
            setCurrentTurnWithLog(validateTurn(response.currentTurn));
          }
          setGameStatus(response.gameStatus);
          const playerData = response.players.find((p) => p.userId === userId);
          const opponentData = response.players.find((p) => p.userId !== userId);
          if (playerData && playerData.cards) {
            console.log(`Syncing handCards:`, JSON.stringify(playerData.cards));
            setHandCards(playerData.cards);
          }
          if (opponentData) {
            setOpponentHand(
              Array(opponentData.cardCount || 2).fill(null).map((_, i) => ({
                id: `opponent-placeholder-${i}-${Date.now()}-${Math.random()}`,
              }))
            );
            if (opponentData.cardPlayed && !battleZone.opponent) {
              setBattleZone((prev) => ({
                ...prev,
                opponent: { id: `temp-${Math.random()}` },
                opponentFaceDown: true,
                opponentPreview: true,
              }));
              setTimeout(() => {
                setBattleZone((prev) => ({ ...prev, opponentPreview: false }));
              }, 1000);
            }
          }
        }
      });
    }, 2000);

    return () => clearInterval(syncInterval);
  }, [gamePhase, roomId, userId, opponent, battleZone.opponent, currentTurn, validateTurn, setCurrentTurnWithLog]);

  // Fallback to clear battle zone if stuck
  useEffect(() => {
    if (gamePhase === 'playing' && !showComparison && countdown === 0 && (battleZone.player || battleZone.opponent)) {
      const timeout = setTimeout(() => {
        console.warn('Fallback: Clearing stuck battle zone');
        setBattleZone({
          player: null,
          opponent: null,
          playerFaceDown: true,
          opponentFaceDown: true,
          playerPreview: false,
          opponentPreview: false,
        });
        setMessage('Battle zone cleared due to delay. Please continue.');
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [battleZone, showComparison, countdown, gamePhase]);

  // Message management
  useEffect(() => {
    if (loading) {
      setMessage('Đang tải bài của bạn...');
      return;
    }
    if (error) {
      setMessage(error);
      return;
    }

    if (gamePhase === 'select') {
      if (selectedCards.length === 2 && !opponentReady) {
        setMessage('Đang đợi đối thủ sẵn sàng...');
      } else {
        setMessage(`Chọn 3 lá bài để bắt đầu trận đấu! (${selectedCards.length}/3)`);
      }
    } else if (gamePhase === 'playing') {
      if (showComparison) {
        // Preserve comparison messages
      } else if (isEndingTurn) {
        setMessage('Đang xử lý lượt, vui lòng đợi!');
      } else if (battleZone.player && !battleZone.opponent) {
        setMessage('Đã đặt bài! Đợi đối thủ đặt bài hoặc nhấn "Kết Thúc Lượt".');
      } else if (currentTurn === userId) {
        setMessage('Lượt của bạn! Chọn một lá bài để đặt.');
      } else if (currentTurn === opponent?.userId) {
        setMessage(`${opponent?.username} đang chọn bài...`);
      } else {
        setMessage('Đang chờ lượt...');
      }
    } else if (gameStatus === 'won') {
      setMessage('Bạn thắng!');
    } else if (gameStatus === 'lost') {
      setMessage('Bạn thua!');
    } else if (gameStatus === 'draw') {
      setMessage('Hòa! Cả hai hết bài.');
    } else if (gameStatus === 'ended') {
      setMessage((prev) => (prev.includes('ngắt kết nối') ? prev : 'Trận đấu đã kết thúc.'));
    }
  }, [
    gamePhase,
    gameStatus,
    currentTurn,
    userId,
    opponent,
    selectedCards.length,
    opponentReady,
    battleZone.player,
    battleZone.opponent,
    isEndingTurn,
    showComparison,
    loading,
    error,
  ]);

  // Opponent timeout in select phase
  useEffect(() => {
    if (gamePhase === 'select' && selectedCards.length === 2 && !opponentReady) {
      const timeout = setTimeout(() => {
        setMessage('Đối thủ chưa sẵn sàng sau 30 giây. Vui lòng thử lại.');
        navigate('/mainhall');
      }, 30000);
      return () => clearTimeout(timeout);
    }
  }, [gamePhase, selectedCards, opponentReady, navigate]);

  if (loading) {
    return <div className="card-game-board">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="card-game-board">
        <h2>Lỗi</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/mainhall')} aria-label="Quay lại">
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="card-game-board">
      {gamePhase === 'select' ? (
        <div className="select-phase">
          <h2>Chọn 3 Lá Bài</h2>
          <p className="game-message">{message}</p>
          <div className="card-selection">
            {userCards.map((card) => (
              <Card
                key={card.id}
                card={card}
                onClick={() => selectCard(card)}
                isPlayable={
                  selectedCards.length < 2 || selectedCards.some((c) => c.id === card.id)
                }
                isSelected={selectedCards.some((c) => c.id === card.id)}
              />
            ))}
          </div>
          <button
            className="btn-start"
            onClick={startGame}
            disabled={selectedCards.length !== 2}
            aria-label="Sẵn sàng"
          >
            Sẵn Sàng
          </button>
        </div>
      ) : (
        <>
          <h2>
            Lượt hiện tại:{' '}
            {currentTurn === userId ? 'Bạn' : opponent?.username || 'Đối thủ'}
          </h2>
          {countdown > 0 && showComparison && <div className="countdown">So sánh: {countdown}s</div>}
          <p className="game-message">{message}</p>

          <div className="game-controls">
            <button
              className="btn-sync"
              onClick={() => socket.emit('syncState', { roomId, userId })}
              aria-label="Đồng bộ trạng thái trò chơi"
            >
              Đồng Bộ Trò Chơi
            </button>
            <button
              className="btn-debug"
              onClick={forceGameStart}
              aria-label="Debug: Force game start"
            >
              Debug: Force Game Start
            </button>
            {gameStatus !== 'playing' && (
              <button className="btn-reset" onClick={resetGame} aria-label="Chơi lại">
                Chơi Lại
              </button>
            )}
          </div>

          <div className="opponent-area">
            <h3>
              Tay Đối Thủ ({opponentHand.length}) - {opponent?.username || 'Đối thủ'}
            </h3>
            <div className="opponent-hand">
              {opponentHand.map((card) => (
                <Card
                  key={`opponent-${card.id}-${roomId}`}
                  card={card}
                  isOpponent
                  isPlayable={false}
                  isFaceDown={true}
                />
              ))}
            </div>
          </div>

          <div className="battle-zone">
            <h3>Khu Vực Chiến Đấu</h3>
            <div className="battle-field">
              <div className="player-battle">
                {battleZone.player ? (
                  <div className="battle-card-container">
                    <Card
                      key={battleZone.player.id}
                      card={battleZone.player}
                      isPlayable={false}
                      isFaceDown={battleZone.playerFaceDown}
                      isPreview={battleZone.playerPreview}
                    />
                    <span className="hp-display">❤️ {battleZone.player.hp}</span>
                  </div>
                ) : (
                  <div className="empty-field">Chưa có bài của bạn</div>
                )}
              </div>
              <div className="vs">🆚</div>
              <div className="opponent-battle">
                {battleZone.opponent ? (
                  <div className="battle-card-container">
                    <Card
                      key={battleZone.opponent.id}
                      card={battleZone.opponent}
                      isOpponent
                      isPlayable={false}
                      isFaceDown={battleZone.opponentFaceDown}
                      isPreview={battleZone.opponentPreview}
                    />
                    <span className="hp-display">❤️ {battleZone.opponent.hp}</span>
                  </div>
                ) : (
                  <div className="empty-field">Chưa có bài của đối thủ</div>
                )}
              </div>
            </div>
          </div>

          <div className="game-deck">
            <div className="deck-discard">
              <div
                className="card discard"
                aria-label={`Mộ: ${discardPile.length} lá`}
              >
                ♻️ ({discardPile.length})
              </div>
            </div>
          </div>

          <div className="player-area">
            <h3>Tay Bạn ({handCards.length}) - {username}</h3>
            <div className="player-hand">
              {handCards.map((card, index) => (
                <div key={card.id} className="player-card-container">
                  <Card
                    card={card}
                    onClick={() => playCard(index)}
                    isPlayable={currentTurn === userId && gameStatus === 'playing' && !battleZone.player}
                  />
                  <span className="hp-display">❤️ {card.hp}</span>
                </div>
              ))}
            </div>
            <button
              className="btn-end-turn"
              onClick={endTurn}
              disabled={
                currentTurn !== userId ||
                gameStatus !== 'playing' ||
                !battleZone.player ||
                isEndingTurn
              }
              aria-label="Kết thúc lượt của bạn"
            >
              {isEndingTurn ? 'Đang Kết Thúc...' : 'Kết Thúc Lượt'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CardGameBoard;