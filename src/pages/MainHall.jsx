import { useState, useEffect } from 'react';
import { FaTasks, FaBoxOpen, FaEnvelope, FaCog, FaChevronUp, FaChevronDown, FaCity, FaUserFriends, FaDoorOpen } from 'react-icons/fa';
import '../assets/css/MainHall.css';
import ArrowToggle from "../components/Arrow_Toggle"; // Adjust the path as necessary
import illustration from '../assets/img/heroes/illustration/NPC_Illust_Luminesera.png'; // Adjust the path as necessary
import BASE_URL from '../components/BaseURL';
import { toast } from 'react-toastify';
import SettingsPopup from '../components/Setting';
import MailPopup from '../components/Mail';
import QuestPopup from '../components/Quest';
import InventoryPopup from '../components/Inventory';

const MainHall = () => {
    const [showTopNav, setShowTopNav] = useState(true);
    const username = "Something"; // Replace with actual username from session/user data
    const [showMailPopup, setShowMailPopup] = useState(false);
    const [showSettingsPopup, setShowSettingsPopup] = useState(false);
    const [showQuestPopup, setShowQuestPopup] = useState(false);
    const [showInventoryPopup, setShowInventoryPopup] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [selectedMail, setSelectedMail] = useState(null);
    const [mails, setMails] = useState([]);
    const [quests, setQuests] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedQuest, setSelectedQuest] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log("MainHall rendered");

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

    const fetchQuests = async () => {
        try {
            const response = await fetch(`${BASE_URL}/src/includes/quests.php`);
            const data = await response.json();

            if (data.success) {
                setQuests(data.quests);
            } else {
                toast.error('❌ Không thể tải danh sách nhiệm vụ.');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('❌ Kết nối đến máy chủ thất bại.');
        }
    };

    const fetchItems = async () => {
        try {
            const response = await fetch(`${BASE_URL}/src/includes/inventory.php`);
            const data = await response.json();

            if (data.success) {
                setItems(data.items);
            } else {
                toast.error('❌ Không thể tải danh sách vật phẩm.');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('❌ Kết nối đến máy chủ thất bại.');
        }
    };

    useEffect(() => {
        fetchMails();
        fetchQuests();
        fetchItems();
    }, []);

    const handleMailClick = (mail) => {
        setSelectedMail(mail);
    };

    const handleQuestClick = (quest) => {
        setSelectedQuest(quest);
    };

    const handleLogoutClick = async () => {
        setIsLoggingOut(true);
        try {
            const response = await fetch(`${BASE_URL}/src/includes/logout.php`, {
                method: 'POST',
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            if (data.success) {
                toast.success('👋 Đăng Xuất Thành Công!');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1000);
            } else {
                toast.error('Lỗi khi đăng xuất!');
            }
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('❌ Đăng Xuất Thất Bại.');
        } finally {
            setIsLoggingOut(false);
        }
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
                    <div className="nav-item" onClick={() => setShowSettingsPopup(true)}>
                        <FaCog className="nav-icon" title="Setting" />
                        <span className="nav-label">Setting</span>
                    </div>
                    <div className="nav-item" onClick={() => setShowQuestPopup(true)}>
                        <FaTasks className="nav-icon" title="Quest" />
                        <span className="nav-label">Quest</span>
                    </div>
                    <div className="nav-item" onClick={() => setShowInventoryPopup(true)}>
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
            <MailPopup
                showMailPopup={showMailPopup}
                setShowMailPopup={setShowMailPopup}
                mails={mails}
                loading={loading}
                onMailClick={handleMailClick}
                selectedMail={selectedMail}
            />
            <SettingsPopup
                showSettingsPopup={showSettingsPopup}
                setShowSettingsPopup={setShowSettingsPopup}
                onLogout={handleLogoutClick}
            />
            <QuestPopup
                showQuestPopup={showQuestPopup}
                setShowQuestPopup={setShowQuestPopup}
                quests={quests}
                loading={loading}
                onQuestClick={handleQuestClick}
                selectedQuest={selectedQuest}
            />
            <InventoryPopup
                showInventoryPopup={showInventoryPopup}
                setShowInventoryPopup={setShowInventoryPopup}
                items={items}
                loading={loading}
            />
        </>
    );
};

export default MainHall;

