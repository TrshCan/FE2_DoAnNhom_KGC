import React, { useState } from 'react';
import { toast } from 'react-toastify';
import BASE_URL from '../components/BaseURL';

const SettingsPopup = ({ showSettingsPopup, setShowSettingsPopup, onLogout }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!showSettingsPopup) return null;

  const handleToggleSound = () => {
    setIsSoundEnabled((prev) => !prev);
    toast.success(`Âm thanh: ${!isSoundEnabled ? 'Bật' : 'Tắt'}`);
  };

  


  return (
    <div style={popupStyle} className="settings-popup unselectable">
      <div style={popupContentStyle}>
        <h3 style={titleStyle}>⚙️ Cài Đặt</h3>

        <div style={listStyle}>
          <div style={itemStyle}>
            <label style={labelStyle}>Âm thanh</label>
            <button
              onClick={handleToggleSound}
              style={isSoundEnabled ? enabledButtonStyle : disabledButtonStyle}
              disabled={isLoggingOut}
            >
              {isSoundEnabled ? 'Bật' : 'Tắt'}
            </button>
          </div>
          <div style={itemStyle}>
            <button
              onClick={onLogout}  // dùng onLogout truyền từ MainHall
              style={isLoggingOut ? { ...logoutButtonStyle, opacity: 0.6 } : logoutButtonStyle}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng Xuất'}
            </button>

          </div>
        </div>

        <div style={buttonContainerStyle}>
          <button
            onClick={() => setShowSettingsPopup(false)}
            style={closeButtonStyle}
            disabled={isLoggingOut}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
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
  borderRadius: '12px',
  width: '300px',
  maxWidth: '95%',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.7)',
  color: '#E0onadoF3',
  border: '1px solid #5D3FD3',
};

const titleStyle = {
  margin: '0 0 20px',
  fontSize: '28px',
  textAlign: 'center',
  color: '#ffe082',
};

const listStyle = {
  marginBottom: '20px',
};

const itemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 0',
  borderBottom: '1px solid #4A3B6A',
};

const labelStyle = {
  fontSize: '16px',
  fontWeight: '500',
};

const enabledButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#00b894',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
};

const disabledButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#ff5722',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
};

const logoutButtonStyle = {
  padding: '10px',
  backgroundColor: '#ff9800',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  width: '100%',
  fontSize: '16px',
  fontWeight: '500',
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
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
};

export default SettingsPopup;