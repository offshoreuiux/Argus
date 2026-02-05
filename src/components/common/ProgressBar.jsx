import React from "react";

export default function ProgressBar({ value = 0, className = "" }) {
  const safe = Number.isFinite(Number(value)) ? Number(value) : 0;
  const percent = Math.max(0, Math.min(100, safe));

  return (
    <div className={`w-[140px] ${className}`}>
      <div className="w-full h-[8px] bg-[#E6E6E6] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#00D1BC] rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
