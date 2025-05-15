import "../assets/css/MainHall.css";

const ArrowToggle = ({ showTopNav, setShowTopNav }) => {
    return (
        <div className={`arrow-container ${showTopNav ? "active" : ""}`} onClick={() => setShowTopNav(!showTopNav)}>
        </div>
    );
};

export default ArrowToggle;
