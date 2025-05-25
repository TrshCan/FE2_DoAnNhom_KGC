import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTasks, FaBoxOpen, FaEnvelope, FaChevronUp, FaChevronDown, FaCity, FaUserFriends, FaDoorOpen } from 'react-icons/fa';
import '../assets/css/MainHall.css';
import ArrowToggle from "../components/Arrow_Toggle";
import illustration from '../assets/img/heroes/illustration/NPC_Illust_Luminesera.png';
import BASE_URL from '../components/BaseURL';

const MainHall = () => {
  const navigate = useNavigate();
  const [showTopNav, setShowTopNav] = useState(true);
  const username = "Something";
  const [showMailPopup, setShowMailPopup] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMails = async () => {
    try {
      const response = await fetch(`${BASE_URL}/src/includes/mail.php`);
      const data = await response.json();
      if (data.success) {
        setMails(data.mails);
      } else {
        toast.error('❌ Không thể tải danh sách thư.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('❌ Kết nối đến máy chủ thất bại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMails();
  }, []);

  const handleMailClick = (mail) => {
    setSelectedMail(mail);
  };

  const handleFriendClick = () => {
    if (!localStorage.getItem("currentUserId")) {
      toast.error("🚫 Vui lòng đăng nhập để truy cập danh sách bạn bè!");
      navigate("/login");
      return;
    }
    navigate('/friend');
  };

  return (
    <>
      <div className="mainhall-container unselectable">
        <div className="top-left">
          <div className="avatar-frame"></div>
          <div className="avatar-img"></div>
          <span className="username">{username}</span>
        </div>
        <div className={`top-right ${showTopNav ? 'show' : ''}`}>
          <div className="nav-item">
            <FaTasks className="nav-icon" title="Quest" />
            <span className="nav-label">Quest</span>
          </div>
          <div className="nav-item">
            <FaBoxOpen className="nav-icon" title="Inventory" />
            <span className="nav-label">Inventory</span>
          </div>
          <div className="nav-item" onClick={() => setShowMailPopup(true)}>
            <FaEnvelope className="nav-icon" title="Mail" />
            <span className="nav-label">Mail</span>
          </div>
        </div>
        <ArrowToggle showTopNav={showTopNav} setShowTopNav={setShowTopNav} />
        <div className="illustration-container">
          <img src={illustration} alt="Main Hall Illustration" className="illustration-image" />
        </div>
        <div className="bottom-nav">
          <div className="nav-item">
            <FaCity className="nav-icon" title="Barrack" />
            <span className="nav-label">Barrack</span>
          </div>
          <div className="nav-item active">
            <FaDoorOpen className="nav-icon gate-icon" title="Gate" />
            <span className="nav-label">Gate</span>
          </div>
          <div className="nav-item" onClick={handleFriendClick}>
            <FaUserFriends className="nav-icon" title="Friend" />
            <span className="nav-label">Friend</span>
          </div>
        </div>
      </div>
      {showMailPopup && (
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
                    onClick={() => handleMailClick(mail)}
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
      )}
    </>
  );
};

export default MainHall;