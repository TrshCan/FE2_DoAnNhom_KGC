import { useState, useEffect } from 'react';
import { FaTasks, FaBoxOpen, FaEnvelope, FaCog, FaCity, FaUserFriends, FaDoorOpen } from 'react-icons/fa';
import '../assets/css/MainHall.css';
import ArrowToggle from '../components/Arrow_Toggle';
import illustration from '../assets/img/heroes/illustration/NPC_Illust_Luminesera.png';
import BASE_URL from '../components/BaseURL';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SettingsPopup from '../components/Setting';
import MailPopup from '../components/Mail';
import QuestPopup from '../components/Quest';
import InventoryPopup from '../components/Inventory';

const MainHall = () => {
    const [showTopNav, setShowTopNav] = useState(true);
    const username = 'Something'; // Thay bằng username thực từ session
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
    const navigate = useNavigate();

    // Kiểm tra trạng thái đăng nhập khi component mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch(`${BASE_URL}/src/includes/check-session.php`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                if (!data.loggedIn) {
                    toast.error('Vui lòng đăng nhập để vào game!');
                    navigate('/login');
                }
            } catch (err) {
                console.error('Error checking session:', err);
                toast.error('❌ Kết nối đến máy chủ thất bại.');
                navigate('/login');
            }
        };
        checkSession();
    }, [navigate]);

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
            console.log('Fetching items from:', `${BASE_URL}/src/includes/inventory.php`);
            const response = await fetch(`${BASE_URL}/src/includes/inventory.php`);
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);
    
            if (data.success) {
                setItems(data.items);
            } else {
                toast.error('❌ Không thể tải danh sách vật phẩm.');
                console.error('API error:', data.message);
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
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                toast.success('👋 Đăng Xuất Thành Công!');
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else {
                toast.error(`Lỗi khi đăng xuất: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Logout error:', error);
            toast.error(`❌ Đăng Xuất Thất Bại: ${error.message}`);
        } finally {
            setIsLoggingOut(false);
        }
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
                    <div className="nav-item">
                        <FaUserFriends className="nav-icon" title="Friend" />
                        <span className="nav-label">Friend</span>
                    </div>
                </div>
            </div>

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