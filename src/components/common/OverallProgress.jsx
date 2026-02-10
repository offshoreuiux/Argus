import React from "react";

function OverallProgress({ value }) {
  return (
    <div className="bg-[#EDFFFD] border border-[#C4EEEA] rounded-lg p-4">
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-medium text-[#434343]">
          Overall Progress
        </p>
        <p className="text-[14px] font-medium text-[#434343]">{value}%</p>
      </div>

      <div className="h-2 bg-[#DCE5EE] rounded-full mt-3 overflow-hidden">
        <div
          className="h-full bg-[#00D1BC] rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default OverallProgress;
