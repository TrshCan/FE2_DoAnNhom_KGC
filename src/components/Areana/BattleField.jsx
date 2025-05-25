import React from "react";
import "../../assets/css/Arena.css"; // Import your CSS styles

const Battlefield = () => {
  return (
    <div
      className="w-full h-screen bg-center bg-cover relative flex items-center justify-center"
      style={{
        backgroundImage: "url('../src/assets/img/battlefield.jpg')",
      }}
    >
      <div className="arena-container">
        {/* Enemy Area */}
        <div className="card-row top">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`enemy-${index}`}
              className="card-slot enemy"
            >
              {/* Enemy card */}
            </div>
          ))}
        </div>

        {/* VS Zone */}
        <div className="vs-zone">
          <div className="vs-circle">VS</div>
        </div>

        {/* Player Area */}
        <div className="card-row bottom">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`player-${index}`}
              className="card-slot player"
            >
              {/* Player card */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Battlefield;
