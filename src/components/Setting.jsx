import React, { useState } from 'react';
import { toast } from 'react-toastify';
import '../assets/css/SettingsPopup.css';

const SettingsPopup = ({ showSettingsPopup, setShowSettingsPopup, onLogout }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!showSettingsPopup) return null;

  const handleToggleSound = () => {
    setIsSoundEnabled((prev) => !prev);
    toast.success(`Âm thanh: ${!isSoundEnabled ? 'Bật' : 'Tắt'}`);
  };

  return (
    <div className="settings-popup-overlay" onClick={() => setShowSettingsPopup(false)}>
      <div className="settings-popup unselectable" onClick={(e) => e.stopPropagation()}>
        <div className="popup-content">
          <h3 className="popup-title">⚙️ Cài Đặt</h3>

          <div className="settings-list">
            <div className="settings-item">
              <label className="settings-label">Âm thanh</label>
              <button
                onClick={handleToggleSound}
                className={`settings-button ${isSoundEnabled ? 'enabled' : 'disabled'}`}
                disabled={isLoggingOut}
              >
                {isSoundEnabled ? 'Bật' : 'Tắt'}
              </button>
            </div>
            <div className="settings-item">
              <button
                onClick={onLogout}
                className="logout-button"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng Xuất'}
              </button>
            </div>
          </div>

          <div className="popup-buttons">
            <button
              className="close-btn"
              onClick={() => setShowSettingsPopup(false)}
              disabled={isLoggingOut}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPopup;