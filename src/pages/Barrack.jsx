import { useState, useEffect } from 'react';
import { FaTasks, FaBoxOpen, FaEnvelope, FaCog, FaCity, FaUserFriends, FaDoorOpen } from 'react-icons/fa';
import '../assets/css/Barrack.css';
import ArrowToggle from '../components/Arrow_Toggle';
import BASE_URL from '../components/BaseURL';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SettingsPopup from '../components/Setting';
import MailPopup from '../components/Mail';
import QuestPopup from '../components/Quest';
import InventoryPopup from '../components/Inventory';
import HeroCard from '../components/HeroCard';

const Barrack = () => {
    const [showTopNav, setShowTopNav] = useState(true);
    const [heroes, setHeroes] = useState([]);
    const [username, setUsername] = useState('Loading...');
    const [showMailPopup, setShowMailPopup] = useState(false);
    const [showSettingsPopup, setShowSettingsPopup] = useState(false);
    const [showQuestPopup, setShowQuestPopup] = useState(false);
    const [showInventoryPopup, setShowInventoryPopup] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [mails, setMails] = useState([]);
    const [quests, setQuests] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedMail, setSelectedMail] = useState(null);
    const [selectedQuest, setSelectedQuest] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchHeroes = async () => {
        try {
            const response = await fetch(`/api/heroes.php?user_id=${localStorage.getItem('user_id')}`, {
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                setHeroes(data.heroes);
            } else {
                toast.error('❌ Failed to load heroes.');
            }
        } catch (error) {
            console.error('Fetch heroes error:', error);
            toast.error('❌ Failed to connect to server.');
        }
    };

    const fetchUserInfo = async () => {
        try {
            const userId = localStorage.getItem('user_id');
            const response = await fetch(`/api/user.php?user_id=${userId}`, { credentials: 'include' });
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

    const fetchMails = async () => {
        try {
            const response = await fetch(`/api/mail.php`, { credentials: 'include' });
            const data = await response.json();
            if (data.success) {
                setMails(data.mails);
            } else {
                toast.error('❌ Cannot load mails.');
            }
        } catch (error) {
            console.error('Fetch mails error:', error);
            toast.error('❌ Failed to connect to server.');
        }
    };

    const fetchQuests = async () => {
        try {
            const response = await fetch(`/api/quests.php`, { credentials: 'include' });
            const data = await response.json();
            if (data.success) {
                setQuests(data.quests);
            } else {
                toast.error('❌ Cannot load quests.');
            }
        } catch (error) {
            console.error('Fetch quests error:', error);
            toast.error('❌ Failed to connect to server.');
        }
    };

    const fetchItems = async () => {
        try {
            const response = await fetch(`/api/inventory.php`, { credentials: 'include' });
            const data = await response.json();
            if (data.success) {
                setItems(data.items);
            } else {
                toast.error('❌ Cannot load inventory.');
            }
        } catch (error) {
            console.error('Fetch items error:', error);
            toast.error('❌ Failed to connect to server.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchHeroes(), fetchUserInfo(), fetchMails(), fetchQuests(), fetchItems()]);
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
            const response = await fetch(`/api/logout.php`, {
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
                toast.error('❌ Logout failed.');
            }
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('❌ Failed to connect to server.');
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

            <div className="barrack-content">
                <div className="hero-grid">
                    {heroes.length > 0 ? heroes.map((hero) => {
                        console.error(`URL: ${BASE_URL}/src/assets/img/heroes/card/${hero.card}`);
                        return <HeroCard key={hero.user_hero_id} hero={hero} />;
                    }) : (
                        <div className="no-heroes">⚔️ No heroes recruited yet.</div>
                    )}

                </div>
            </div>

            <div className="bottom-nav">
                <div className="nav-item active">
                    <FaCity className="nav-icon" title="Barrack" />
                    <span className="nav-label">Barrack</span>
                </div>
                <div className="nav-item" onClick={() => navigate('/mainhall')}>
                    <FaDoorOpen className="nav-icon gate-icon" title="Gate" />
                    <span className="nav-label">Gate</span>
                </div>
                <div className="nav-item" onClick={() => navigate('/friend')}>
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

export default Barrack;