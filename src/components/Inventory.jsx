import React from 'react';
import '../assets/css/InventoryPopup.css';

const InventoryPopup = ({ showInventoryPopup, setShowInventoryPopup, items, loading }) => {
  if (!showInventoryPopup) return null;

  return (
    <div className="inventory-popup-overlay" onClick={() => setShowInventoryPopup(false)}>
      <div className="inventory-popup unselectable" onClick={(e) => e.stopPropagation()}>
        <div className="popup-content">
          <h3 className="popup-title">🎒 Kho Đồ</h3>

          <div className="inventory-list">
            {loading ? (
              <p>⏳ Đang tải kho đồ...</p>
            ) : items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="inventory-item">
                  <h4 className="item-name">
                    {item.name} <span className="item-quantity">(x{item.quantity})</span>
                  </h4>
                  <p className="item-description">{item.description}</p>
                </div>
              ))
            ) : (
              <p>📭 Kho đồ trống.</p>
            )}
          </div>

          <div className="popup-buttons">
            <button className="close-btn" onClick={() => setShowInventoryPopup(false)}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPopup;