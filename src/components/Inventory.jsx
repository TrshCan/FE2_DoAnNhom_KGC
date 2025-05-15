import React from 'react';

const InventoryPopup = ({ showInventoryPopup, setShowInventoryPopup, items, loading }) => {
  if (!showInventoryPopup) return null;

  return (
    <div className="inventory-popup unselectable" style={popupStyle}>
      <div className="popup-content" style={popupContentStyle}>
        <h3 className="popup-title" style={titleStyle}>🎒 Kho Đồ</h3>

        <div className="inventory-list" style={listStyle}>
          {loading ? (
            <p>⏳ Đang tải kho đồ...</p>
          ) : items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="inventory-item" style={itemStyle}>
                <h4 className="item-name" style={itemTitleStyle}>
                  {item.name} <span style={quantityStyle}>(x{item.quantity})</span>
                </h4>
                <p className="item-description" style={contentStyle}>{item.description}</p>
              </div>
            ))
          ) : (
            <p>📭 Kho đồ trống.</p>
          )}
        </div>

        <div className="popup-buttons" style={buttonContainerStyle}>
          <button
            className="close-btn"
            onClick={() => setShowInventoryPopup(false)}
            style={closeButtonStyle}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// Inline styles (move to Inventory.css for production)
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
};

const itemStyle = {
  padding: '10px',
  borderBottom: '1px solid #4A3B6A',
};

const itemTitleStyle = {
  margin: '0 0 5px',
  fontSize: '18px',
  color: '#ffe082',
};

const quantityStyle = {
  color: '#ffca28',
  fontSize: '14px',
};

const contentStyle = {
  fontSize: '14px',
  color: '#ccc',
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

export default InventoryPopup;