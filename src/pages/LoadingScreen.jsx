import { useEffect, useState } from 'react';
import '../assets/css/LoadingScreen.css';
import loadingMessagesJson from '../assets/json/messages.json';
import bgVideo from '../assets/video/loading.gif';
import bgm from '../assets/music/shelter.mp3';
import { FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import GameName from '../components/GameName';
import BASE_URL from '../components/BaseURL';

const LoadingScreen = () => {
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [initStarted, setInitStarted] = useState(false);
    const [audio] = useState(new Audio(bgm));
    const [volume, setVolume] = useState(1);
    const navigate = useNavigate();

    // Kiểm tra trạng thái đăng nhập ngay khi component mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch(`/api/check-session.php`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                setIsLoggedIn(data.loggedIn);
            } catch (err) {
                console.error('Error checking session:', err);
                toast.error('❌ Kết nối đến máy chủ thất bại.');
            }
        };
        checkSession();
    }, []);

    const handleStartClick = () => {
        if (isLoggedIn) {
            navigate('/mainhall');
        } else {
            toast.error('Vui lòng đăng nhập để vào game!');
            navigate('/login');
        }
    };


    useEffect(() => {
        if (!initStarted) return;

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
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    clearInterval(messageInterval);
                    setLoading(false);
                    // Chuyển hướng sau khi load xong
                    if (isLoggedIn) {
                        navigate('/mainhall');
                    } else {
                        navigate('/login');
                    }
                    return 100;
                }
                return prev + 100 / (duration * 10);
            });
        }, 100);

        // Start music
        audio.loop = true;
        audio.play().catch((err) => console.error('Audio play error:', err));
        audio.volume = volume;

        return () => {
            clearInterval(interval);
            clearInterval(messageInterval);
            audio.pause();
        };
    }, [initStarted, volume, navigate, isLoggedIn]);

    const handleVolumeChange = (event) => {
        const newVolume = event.target.value;
        setVolume(newVolume);
        audio.volume = newVolume;
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
                                <div className="dropdown-link" onClick={() => {
                                    audio.pause();
                                    audio.currentTime = 0;
                                    setShowDropdown(false); navigate('/login');
                                }}>
                                    <FaSignInAlt /> Login
                                </div>
                                <div className="dropdown-link" onClick={() => {
                                    audio.pause();
                                    audio.currentTime = 0;
                                    setShowDropdown(false); navigate('/register');
                                }}>
                                    <FaUserPlus /> Register
                                </div>
                            </>
                        ) : (
                            <div className="dropdown-link" onClick={() => {
                                audio.pause();
                                audio.currentTime = 0;
                                setShowDropdown(true); navigate('/logout');
                            }}>
                                <FaSignOutAlt /> Logout
                            </div>
                        )}
                    </div>

                )}
            </div>

            {showSettings && (
                <div className="settings-dropdown">
                    <label htmlFor="volume-slider" style={{ color: 'white' }}>
                        Volume:
                    </label>
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