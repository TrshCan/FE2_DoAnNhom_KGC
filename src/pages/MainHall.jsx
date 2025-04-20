import { useState, useEffect } from 'react';
import { FaTasks, FaBoxOpen, FaEnvelope, FaChevronUp, FaChevronDown, FaCity, FaUserFriends, FaDoorOpen } from 'react-icons/fa';
import '../assets/css/MainHall.css';
import ArrowToggle from "../components/Arrow_Toggle"; // Adjust the path as necessary
import illustration from '../assets/img/heroes/illustration/NPC_Illust_Luminesera.png'; // Adjust the path as necessary

const MainHall = () => {
    const [showTopNav, setShowTopNav] = useState(true);
    const username = "Something"; // Replace with actual username from session/user data
    const [showMailPopup, setShowMailPopup] = useState(false);
    const [selectedMail, setSelectedMail] = useState(null);
    const [mails, setMails] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log("MainHall rendered");

    const fetchMails = async () => {
        try {
            const response = await fetch('http://localhost/FE2_DOANNHOM_KGC/src/includes/mail.php');
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

    // Gọi API để lấy thư khi component được mount
    useEffect(() => {
        fetchMails();
    }, []);

    const handleMailClick = (mail) => {
        setSelectedMail(mail);
    };

    return (
        <>
            <div className="mainhall-container unselectable">
                {/* Top Left Avatar */}
                <div className="top-left">
                    <div className="avatar-frame"></div>
                    <div className="avatar-img"></div>

                    <span className="username">{username}</span>
                </div>

                {/* Top Right Navigation */}
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

                {/* Toggle Arrow */}
                <ArrowToggle showTopNav={showTopNav} setShowTopNav={setShowTopNav} />

                <div className="illustration-container">
                    <img src={illustration} alt="Main Hall Illustration" className="illustration-image" />
                </div>

                {/* Bottom Navigation */}
                <div className="bottom-nav">
                    <div className="nav-item">
                        <FaCity className="nav-icon" title="Barrack" />
                        <span className="nav-label">Barrack</span>
                    </div>
                    <div className="nav-item active">
                        <FaDoorOpen className="nav-icon gate-icon" title="Gate" />
                        <span className="nav-label">Gate</span>
                    </div>
                    <div className="nav-item">
                        <FaUserFriends className="nav-icon" title="Friend" />
                        <span className="nav-label">Friend</span>
                    </div>
                </div>
            </div>
            {/* Mail Popup */}
            {showMailPopup && (
                <div className="mail-popup">
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
                                                {/* <p>{mail.content}</p> */}
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
