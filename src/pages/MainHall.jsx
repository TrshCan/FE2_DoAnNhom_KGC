import { useState } from 'react';
import { FaTasks, FaBoxOpen, FaEnvelope, FaChevronUp, FaChevronDown, FaCity, FaUserFriends, FaDoorOpen } from 'react-icons/fa';
import '../assets/css/MainHall.css';
import ArrowToggle from "../components/Arrow_Toggle"; // Adjust the path as necessary
import illustration from '../assets/img/heroes/illustration/NPC_Illust_Luminesera.png'; // Adjust the path as necessary


const MainHall = () => {
    const [showTopNav, setShowTopNav] = useState(true);
    const username = "Something"; // Replace with actual username from session/user data
    console.log("MainHall rendered");

    return (
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
                <div className="nav-item">
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
    );
};

export default MainHall;
