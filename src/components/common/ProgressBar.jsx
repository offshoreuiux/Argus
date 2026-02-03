import React from "react";

function ProgressBar({ value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-[120px] h-[8px] bg-[#EAEAEA] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#76D1CA] rounded-full"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <span className="text-sm text-[#4A4A4A]">{value}%</span>
    </div>
  );
}

export default ProgressBar;
