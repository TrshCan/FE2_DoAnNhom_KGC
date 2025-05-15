import { useState, useEffect } from 'react';
import { FaTasks, FaBoxOpen, FaEnvelope, FaCog, FaChevronUp, FaChevronDown, FaCity, FaUserFriends, FaDoorOpen } from 'react-icons/fa';
import '../assets/css/MainHall.css'; // Reuse MainHall styling
import '../assets/css/Barrack.css'; // Add new specific Barrack styling
import ArrowToggle from "../components/Arrow_Toggle";
import BASE_URL from '../components/BaseURL';
import { toast } from 'react-toastify';
import SettingsPopup from '../components/Setting';
import MailPopup from '../components/Mail';
import QuestPopup from '../components/Quest';
import InventoryPopup from '../components/Inventory';
import bgm from '../assets/music/shelter.mp3';

const Barrack = () => {
    const [showTopNav, setShowTopNav] = useState(true);
    const [heroes, setHeroes] = useState([]);
    const [username, setUsername] = useState('');
    const [showMailPopup, setShowMailPopup] = useState(false);
    const [showSettingsPopup, setShowSettingsPopup] = useState(false);
    const [showQuestPopup, setShowQuestPopup] = useState(false);
    const [showInventoryPopup, setShowInventoryPopup] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [mails, setMails] = useState([]);
    const [quests, setQuests] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [audio] = useState(new Audio(bgm));
    audio.pause();
    audio.currentTime = 0;

    const fetchHeroes = async () => {
        try {
            const response = await fetch(`${BASE_URL}/src/includes/heroes.php?user_id=${localStorage.getItem('user_id')}`);
            const data = await response.json();
            if (data.success) {
                setHeroes(data.heroes);
            } else {
                toast.error('❌ Failed to load heroes.');
            }
        } catch (error) {
            console.error(error);
            toast.error('❌ Connection error.');
        }
    };

    const fetchUserInfo = async () => {
        try {
            const userId = localStorage.getItem('user_id');
            const response = await fetch(`/api/user.php?user_id=${userId}`);
            const data = await response.json();
            if (data.success && data.username) {
                setUsername(data.username);
            } else {
                setUsername('❌ Failed to load username.');
            }
        } catch (error) {
            console.log(error);
            setUsername('❌ Connection error.');
        }
    };

    const fetchMails = async () => {
        try {
            const response = await fetch(`${BASE_URL}/src/includes/mail.php`);
            const data = await response.json();
            if (data.success) {
                setMails(data.mails);
            } else {
                toast.error('❌ Cannot load mails.');
            }
        } catch (error) {
            console.error(error);
            toast.error('❌ Connection error.');
        }
    };

    const fetchQuests = async () => {
        try {
            const response = await fetch(`${BASE_URL}/src/includes/quests.php`);
            const data = await response.json();
            if (data.success) {
                setQuests(data.quests);
            } else {
                toast.error('❌ Cannot load quests.');
            }
        } catch (error) {
            console.error(error);
            toast.error('❌ Connection error.');
        }
    };

    const fetchItems = async () => {
        try {
            const response = await fetch(`${BASE_URL}/src/includes/inventory.php`);
            const data = await response.json();
            if (data.success) {
                setItems(data.items);
            } else {
                toast.error('❌ Cannot load inventory.');
            }
        } catch (error) {
            console.error(error);
            toast.error('❌ Connection error.');
        }
    };

    useEffect(() => {
        fetchHeroes();
        fetchUserInfo();
        fetchMails();
        fetchQuests();
        fetchItems();
    }, []);

    const handleLogoutClick = async () => {
        setIsLoggingOut(true);
        try {
            const response = await fetch(`${BASE_URL}/src/includes/logout.php`, { method: 'POST' });
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            const data = await response.json();
            if (data.success) {
                toast.success('👋 Logged out successfully!');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1000);
            } else {
                toast.error('❌ Logout failed.');
            }
        } catch (error) {
            console.error(error);
            toast.error('❌ Logout error.');
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

                {/* HERO GRID */}
                <div className="barrack-content">
                    <div className="hero-grid">
                        {heroes.length > 0 ? heroes.map((hero) => (
                            <div key={hero.id} className="hero-card">
                                <div
                                    className="hero-image"
                                    style={{
                                        backgroundImage: `url(${BASE_URL}/src/assets/img/heroes/illustration/${hero.illustration})`,
                                    }}
                                ></div>
                                <div className="hero-info">
                                    <h3 className="hero-name">{hero.name}</h3>
                                    <div className="badges">
                                        <span className="badge level">Lv. {hero.level}</span>
                                        <span className="badge region">{hero.region}</span>
                                        <span className="badge class">{hero.class}</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="no-heroes">⚔️ No heroes recruited yet.</div>
                        )}
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="bottom-nav">
                    <div className="nav-item active">
                        <FaCity className="nav-icon" title="Barrack" />
                        <span className="nav-label">Barrack</span>
                    </div>
                    <div className="nav-item" onClick={() => window.location.href = '/gate'}>
                        <FaDoorOpen className="nav-icon gate-icon" title="Gate" />
                        <span className="nav-label">Gate</span>
                    </div>
                    <div className="nav-item">
                        <FaUserFriends className="nav-icon" title="Friend" />
                        <span className="nav-label">Friend</span>
                    </div>
                </div>
            </div>

            {/* Popups */}
            <MailPopup
                showMailPopup={showMailPopup}
                setShowMailPopup={setShowMailPopup}
                mails={mails}
                loading={loading}
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

export default Barrack;
