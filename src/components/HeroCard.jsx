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
                <div className="card-overlay"></div>
                <Card.Img
                    variant="top"
                    src={`${BASE_URL}/src/assets/img/heroes/cards/${hero.card}`}
                    alt={`${hero.name} card`}
                    className="hero-card-image"
                />
                <Card.Body>
                    <div className="hero-card-name-container">
                        <Card.Title className="hero-card-name">{hero.name}</Card.Title>
                    </div>
                    <div className="hero-card-stats">
                        <div className="corner top-left">❤️ {hero.HP}</div>
                        <div className="corner top-right">🛡 {hero.Mighty_Block}</div>
                        <div className="corner bottom-left">⚔ {hero.ATK}</div>
                        <div className="corner bottom-right">✨ {hero.Spell}</div>
                    </div>
                </Card.Body>
            </Card>

            <Modal show={showModal} centered onHide={handleClose} className="hero-modal">
                <Modal.Header closeButton className="modal-header-custom">
                    <Modal.Title>{hero.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body-custom">
                    <div className="modal-image-container">
                        <img
                            src={`${BASE_URL}/src/assets/img/heroes/illustration/${hero.illustration}`}
                            alt={`${hero.name} modal`}
                            className="modal-hero-image"
                        />
                    </div>
                    <p><strong>Level:</strong> {hero.level}</p>
                    <p><strong>Region:</strong> {hero.region}</p>
                    <p><strong>Class:</strong> {hero.class}</p>
                    <hr />
                    <p><strong>HP:</strong> {hero.HP}</p>
                    <p><strong>ATK:</strong> {hero.ATK}</p>
                    <p><strong>Spell:</strong> {hero.Spell}</p>
                    <p><strong>DEF:</strong> {hero.Physical_DEF}</p>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default HeroCard;