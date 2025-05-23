import React from "react";

const Battlefield = () => {
  return (
    <div
      className="w-full h-screen bg-cover bg-center relative flex flex-col justify-between items-center"
      style={{
        backgroundImage: "url('../src/assets/img/battlefield.jpg')", // Đổi URL theo hình bạn có
      }}
    >
      {/* Enemy Area */}
      <div className="w-full flex justify-center mt-10">
        <div className="flex space-x-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="w-24 h-36 bg-gray-300 rounded shadow-md border-2 border-red-500 hover:scale-105 transition"
            >
              {/* Enemy card slot */}
            </div>
          ))}
        </div>
      </div>

      {/* Middle Arena Line */}
      <div className="w-full border-t-4 border-yellow-500 my-10" />

      {/* Player Area */}
      <div className="w-full flex justify-center mb-10">
        <div className="flex space-x-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="w-24 h-36 bg-gray-100 rounded shadow-md border-2 border-blue-500 hover:scale-105 transition"
            >
              {/* Player card slot */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Battlefield;
