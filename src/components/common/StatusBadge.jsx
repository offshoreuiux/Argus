import React from "react";

function StatusBadge({ status }) {
  const statusStyles = {
    Active: "bg-[#DFFFDF] border border-[#00800033] text-[#008000]",
    Draft: "bg-[#FFF7D6] border border-[#DAB51C33] text-[#DAB51C]",
    Failed: "bg-[#FFEBEB] border border-[#E4323233] text-[#E43232]",
    Inactive: "bg-gray-100 border border-gray-300 text-gray-600",
  };

  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs font-semibold
        ${statusStyles[status] || "bg-gray-100 text-gray-600"}
      `}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
