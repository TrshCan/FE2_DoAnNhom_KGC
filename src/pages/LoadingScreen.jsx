import { useEffect, useState } from 'react';
import '../assets/css/LoadingScreen.css';
import loadingMessagesJson from '../assets/json/messages.json';
import bgVideo from '../assets/video/loading.gif';
import bgm from '../assets/music/shelter.mp3';
import { FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import GameName from '../components/GameName';


const LoadingScreen = () => {
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSettings, setShowSettings] = useState(false); // To toggle settings menu
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [initStarted, setInitStarted] = useState(false);
    const [audio] = useState(new Audio(bgm));
    const [volume, setVolume] = useState(1); // Volume state (1 is max volume)
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate('/mainhall');
    };

    useEffect(() => {
        if (!initStarted) return;

        // Simulate session check
        fetch('../includes/check-session.php')
            .then(res => res.json())
            .then(data => setIsLoggedIn(data.loggedIn));

        const { loadingMessages } = loadingMessagesJson;
        const shuffled = [...loadingMessages].sort(() => 0.5 - Math.random());
        let msgIndex = 0;
        setMessage(shuffled[msgIndex]);

        const messageInterval = setInterval(() => {
            msgIndex++;
            if (msgIndex < shuffled.length) {
                setMessage(shuffled[msgIndex]);
            }
        }, Math.floor(Math.random() * 2000) + 1000);

        // Simulate loading
        const duration = Math.floor(Math.random() * 15) + 15;
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    clearInterval(messageInterval);
                    setLoading(false);
                    return 100;
                }
                return prev + (100 / (duration * 10));
            });
        }, 100);
        // Start music
        audio.loop = true;
        audio.play();
        audio.volume = volume; // Set initial volume
    }, [initStarted, volume]); // Re-run when volume changes

    const handleVolumeChange = (event) => {
        const newVolume = event.target.value;
        setVolume(newVolume);
        audio.volume = newVolume; // Update audio volume
    };

    return (
        <div className="loading-screen unselectable">
            <img src={bgVideo} alt="Loading Background" className="bg-video" />

            <div className="user-menu">
                <FaCog onClick={() => setShowSettings(!showSettings)} className="icon-btn settings-icon" />
                <FaUser onClick={() => setShowDropdown(!showDropdown)} className="icon-btn" />
                {showDropdown && (
                    <div className="dropdown-menu">
                        {!isLoggedIn ? (
                            <>
                                <a href="pages/login.php"><FaSignInAlt /> Login</a>
                                <a href="pages/signup.php"><FaUserPlus /> Register</a>
                            </>
                        ) : (
                            <a href="includes/logout.php"><FaSignOutAlt /> Logout</a>
                        )}
                    </div>
                )}
            </div>

            {/* Volume settings dropdown positioned to top-left */}
            {showSettings && (
                <div className="settings-dropdown">
                    <label htmlFor="volume-slider" style={{ color: 'white' }}>Volume:</label>
                    <input
                        type="range"
                        id="volume-slider"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        style={{ width: '100%' }}
                    />
                </div>
            )}

            {!initStarted ? (
                <div className="click-start" onClick={() => setInitStarted(true)}>
                    <p className="blinking">Click to Load</p>
                </div>
            ) : loading ? (
                <div className="loading-container">
                    <div className="progress-bar">
                        <div className="bar" style={{ width: `${progress}%` }}></div>
                        <span className="progress-percent">{Math.floor(progress)}%</span>
                    </div>
                    <p className="loading-message">{message}</p>
                </div>
            ) : (
                <>
                    <GameName />
                    <div className="click-start" onClick={handleStartClick}>
                        <p className="blinking">Click to Start</p>
                    </div>
                </>

            )}
        </div>
    );
};

export default LoadingScreen;
