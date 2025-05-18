import React from "react";
import HeroCard from "../components/HeroCard";

const hero = {
  name: "Flame Knight",
  atk: 300,
  def: 250,
  hp: 1000,
  spell: 150,
  image: "https://via.placeholder.com/200x300.png?text=Hero",
  description: "A powerful warrior of fire with balanced attack and defense."
};

function App() {
  return (
    <div className="d-flex justify-content-center mt-5">
      <HeroCard hero={hero} />
    </div>
  );
}

export default HeroCard;
