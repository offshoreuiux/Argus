import React from "react";

function StatCard({ item }) {
  const isTotal = item.id === "total";
  const isPending = item.id === "pending";

  return (
    <div
      className="h-[120px] p-4 rounded-lg border flex"
      style={{ backgroundColor: item.bgColor, borderColor: item.borderColor }}
    >
      <div className="flex items-start justify-between w-full">
        <div className="w-full h-full">
          {/* Value (bigger for simple cards) */}
          <div className="flex flex-col gap-1">
            {!isTotal && !isPending && (
              <p className="text-[20px] font-semibold text-[#242424]">
                {item.value}
              </p>
            )}
            <p className="text-[14px] text-[#5F5F5F]">{item.title}</p>
          </div>

          {/* Total Obligations */}
          {isTotal && (
            <div className="flex items-center gap-3 mt-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-semibold"
                style={{
                  backgroundColor: item.circleBg,
                  border: `4px solid ${item.circleBorder}`,
                  color: item.circleText,
                }}
              >
                {item.value}
              </div>
              <p className="text-[13px] text-[#808080] mt-auto">
                {item.description}
              </p>
            </div>
          )}

          {/* Pending Review */}
          {isPending && (
            <div className="flex items-center gap-3 mt-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-semibold"
                style={{
                  backgroundColor: item.circleBg,
                  border: `4px solid ${item.circleBorder}`,
                  color: item.circleText,
                }}
              >
                {item.value}
              </div>
              <p className="text-[13px] text-[#808080] mt-auto">
                {item.description}
              </p>
            </div>
          )}
        </div>

        {/* Right icon box (only for icon cards) */}
        {item.icon && (
          <div className="flex items-center justify-center mt-auto">
            <img src={item.icon} alt="" />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
