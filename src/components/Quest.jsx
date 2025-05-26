import React, { useState } from 'react';
import { toast } from 'react-toastify';

const QuestPopup = ({ showQuestPopup, setShowQuestPopup, quests, loading, onQuestClick, selectedQuest }) => {
  const [activeTab, setActiveTab] = useState('daily');

  if (!showQuestPopup) return null;

  const filteredQuests = quests.filter((quest) => quest.type === activeTab);

  return (
    <div className="quest-popup unselectable" style={popupStyle}>
      <div className="popup-content" style={popupContentStyle}>
        <h3 className="popup-title" style={titleStyle}>📜 Nhiệm Vụ</h3>

        {/* Tabs */}
        <div style={tabContainerStyle}>
          <button
            style={activeTab === 'daily' ? tabButtonActiveStyle : tabButtonStyle}
            onClick={() => setActiveTab('daily')}
          >
            🗓 Hằng Ngày
          </button>
          <button
            style={activeTab === 'weekly' ? tabButtonActiveStyle : tabButtonStyle}
            onClick={() => setActiveTab('weekly')}
          >
            📅 Hằng Tuần
          </button>
        </div>

        {/* Danh sách nhiệm vụ */}
        <div className="quest-list" style={listStyle}>
          {loading ? (
            <p>⏳ Đang tải nhiệm vụ...</p>
          ) : filteredQuests.length > 0 ? (
            filteredQuests.map((quest) => (
              <div
                key={quest.id}
                className="quest-item"
                onClick={() => onQuestClick(quest)}
                style={itemStyle}
              >
                <h4 className="quest-title" style={itemTitleStyle}>
                  {quest.title} <span style={statusStyle(quest.status)}>({quest.status})</span>
                </h4>
                {selectedQuest?.id === quest.id && (
                  <div className="quest-content-expanded" style={contentExpandedStyle}>
                    <p className="quest-description" style={contentStyle}>{quest.description}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>📭 Không có nhiệm vụ nào.</p>
          )}
        </div>

        <div className="popup-buttons" style={buttonContainerStyle}>
          <button
            className="close-btn"
            onClick={() => setShowQuestPopup(false)}
            style={closeButtonStyle}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// Tab styles
const tabContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '15px',
  gap: '10px',
};

const tabButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#6A4C93',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const tabButtonActiveStyle = {
  ...tabButtonStyle,
  backgroundColor: '#FFB74D',
  color: '#000',
};

const popupStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const popupContentStyle = {
  backgroundColor: '#2C1E4A',
  padding: '20px',
  borderRadius: '8px',
  width: '400px',
  maxWidth: '90%',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
};

const titleStyle = {
  margin: '0 0 20px',
  fontSize: '24px',
  textAlign: 'center',
  color: '#ffe082',
};

const listStyle = {
  marginBottom: '20px',
  maxHeight: '300px',
  overflowY: 'auto',
  backgroundColor: '#4A3B6A',
  padding: '10px',
  borderRadius: '8px',
};

const itemStyle = {
  padding: '10px',
  borderBottom: '1px solid #4A3B6A',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
};

const itemTitleStyle = {
  margin: 0,
  fontSize: '18px',
  color: '#ffe082',
};

const statusStyle = (status) => ({
  color: status === 'Completed' ? '#4CAF50' : '#FF9800',
  fontSize: '14px',
  marginLeft: '10px',
});

const contentExpandedStyle = {
  marginTop: '10px',
  backgroundColor: '#4A3B6A',
  padding: '10px',
  borderRadius: '8px',
};

const contentStyle = {
  fontSize: '14px',
  color: '#ddd',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
};

const closeButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#d32f2f',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default QuestPopup;
