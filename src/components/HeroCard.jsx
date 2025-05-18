import { useState } from 'react';
import { Card, Modal } from 'react-bootstrap';
import '../assets/css/HeroCard.css';

import BASE_URL from './BaseURL';

const HeroCard = ({ hero }) => {
    const [showModal, setShowModal] = useState(false);

    const handleClick = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    return (
        <>
            <Card className="hero-card-component" onClick={handleClick}>
                <div
                    className="hero-card-image"
                    style={{
                        backgroundImage: `url(${BASE_URL}/src/assets/img/heroes/cards/${hero.card})`,
                    }}
                />
                <div className="corner top-left">⚔ {hero.ATK}</div>
                <div className="corner top-right">🛡 {hero.Physical_DEF}</div>
                <div className="corner bottom-left">❤️ {hero.HP}</div>
                <div className="corner bottom-right">✨ {hero.Spell}</div>
                <div className="hero-card-name">{hero.name}</div>
            </Card>

            <Modal show={showModal} centered onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{hero.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Level:</strong> {hero.level}</p>
                    <p><strong>Region:</strong> {hero.region}</p>
                    <p><strong>Class:</strong> {hero.class}</p>
                    <hr />
                    <p><strong>HP:</strong> {hero.HP}</p>
                    <p><strong>ATK:</strong> {hero.ATK}</p>
                    <p><strong>Spell:</strong> {hero.Spell}</p>
                    <p><strong>DEF:</strong> {hero.Physical_DEF}</p>
                    {/* Add more stats if desired */}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default HeroCard;
