import React from 'react';
import { toast } from 'react-toastify';
import '../assets/css/QuestPopup.css';

const QuestPopup = ({ showQuestPopup, setShowQuestPopup, quests, loading, onQuestClick, selectedQuest }) => {
  if (!showQuestPopup) return null;

  return (
    <div className="quest-popup-overlay" onClick={() => setShowQuestPopup(false)}>
      <div className="quest-popup unselectable" onClick={(e) => e.stopPropagation()}>
        <div className="popup-content">
          <h3 className="popup-title">📜 Nhiệm Vụ</h3>

          <div className="quest-list">
            {loading ? (
              <p>⏳ Đang tải nhiệm vụ...</p>
            ) : quests.length > 0 ? (
              quests.map((quest) => (
                <div
                  key={quest.id}
                  className="quest-item"
                  onClick={() => onQuestClick(quest)}
                >
                  <h4 className="quest-title">
                    {quest.title} <span className={`quest-status ${quest.status.toLowerCase()}`}>({quest.status})</span>
                  </h4>
                  {selectedQuest?.id === quest.id && (
                    <div className="quest-content-expanded">
                      <p className="quest-description">{quest.description}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>📭 Không có nhiệm vụ nào.</p>
            )}
          </div>

          <div className="popup-buttons">
            <button className="close-btn" onClick={() => setShowQuestPopup(false)}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestPopup;