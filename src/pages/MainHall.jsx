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
    const [username, setUsername] = useState('Loading...'); // Initialize with loading state
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

    // Check session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch(`${BASE_URL}/src/includes/check-session.php`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                if (!data.loggedIn) {
                    toast.error('Please log in to access the game!');
                    navigate('/login');
                }
            } catch (err) {
                console.error('Error checking session:', err);
                toast.error('❌ Failed to connect to server.');
                navigate('/login');
            }
        };
        checkSession();
    }, [navigate]);

    const fetchMails = async () => {
        try {
            const response = await fetch(`${BASE_URL}/src/includes/mail.php`, { credentials: 'include' });
            const data = await response.json();
            if (data.success) {
                setMails(data.mails);
            } else {
                toast.error('❌ Cannot load mails.');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('❌ Failed to connect to server.');
        }
    };

    const fetchQuests = async () => {
        try {
            const response = await fetch(`${BASE_URL}/src/includes/quests.php`, { credentials: 'include' });
            const data = await response.json();
            if (data.success) {
                setQuests(data.quests);
            } else {
                toast.error('❌ Cannot load quests.');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('❌ Failed to connect to server.');
        }
    };

    const fetchItems = async () => {
        try {
            const response = await fetch(`${BASE_URL}/src/includes/inventory.php`, { credentials: 'include' });
            const data = await response.json();
            if (data.success) {
                setItems(data.items);
            } else {
                toast.error('❌ Cannot load inventory.');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('❌ Failed to connect to server.');
        }
    };

    const fetchUserInfo = async () => {
        try {
            const userId = localStorage.getItem('user_id');
            const response = await fetch(`${BASE_URL}/api/user.php?user_id=${userId}`, { credentials: 'include' });
            const data = await response.json();
            if (data.success && data.username) {
                setUsername(data.username);
            } else {
                setUsername('❌ Failed to load username.');
            }
        } catch (error) {
            console.error('Fetch user info error:', error);
            setUsername('❌ Failed to connect to server.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchMails(), fetchQuests(), fetchItems(), fetchUserInfo()]);
            setLoading(false);
        };
        fetchData();
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
                toast.success('👋 Logged out successfully!');
                navigate('/login');
            } else {
                toast.error(`Logout error: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Logout error:', error);
            toast.error(`❌ Logout failed: ${error.message}`);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
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
                <div className="nav-item" onClick={() => navigate('/barrack')}>
                    <FaCity className="nav-icon" title="Barrack" />
                    <span className="nav-label">Barrack</span>
                </div>
                <div className="nav-item active">
                    <FaDoorOpen className="nav-icon gate-icon" title="Gate" />
                    <span className="nav-label">Gate</span>
                </div>
                <div className="nav-item" onClick={() => navigate('/friends')}>
                    <FaUserFriends className="nav-icon" title="Friend" />
                    <span className="nav-label">Friend</span>
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
        </div>
    );
};

export default MainHall;