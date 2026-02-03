import React from "react";

function Card({ children, className }) {
  return (
    <div
      className={`bg-white p-6 rounded-2xl border border-[#C4EDFF] ${className}`}
      style={{ boxShadow: "0 0 20px 0 #CEEDFB33" }}
    >
      {children}
    </div>
  );
}

export default Card;
