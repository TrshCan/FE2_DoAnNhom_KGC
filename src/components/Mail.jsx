
import React from 'react';
import '../assets/css/MailPopup.css'; 

const MailPopup = ({ showMailPopup, setShowMailPopup, mails, loading, onMailClick, selectedMail }) => {
  if (!showMailPopup) return null; 

  return (
    <div className="mail-popup unselectable">
      <div className="popup-content">
        <h3 className="popup-title">📧 Hòm Thư</h3>

        <div className="mail-list">
          {loading ? (
            <p>⏳ Đang tải thư...</p>
          ) : mails.length > 0 ? (
            mails.map((mail) => (
              <div
                key={mail.id}
                className="mail-item"
                onClick={() => onMailClick(mail)}
              >
                <h4 className="mail-title">{mail.title}</h4>
                {selectedMail?.id === mail.id && (
                  <div className="mail-content-expanded">
                    <p className="mail-content">{mail.content}</p>
                    <div className="mail-sender">
                      <span className="mail-sender-label">From:</span>
                      <span className="mail-sender-name">{mail.sender_email}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>📭 Không có thư nào.</p>
          )}
        </div>

        <div className="popup-buttons">
          <button className="close-btn" onClick={() => setShowMailPopup(false)}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default MailPopup;