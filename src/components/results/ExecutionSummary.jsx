import React from "react";
import Card from "../common/Card";
import PrimaryButton from "../common/PrimaryButton";
import OutlinedButton from "../common/OutlinedButton";
import DownloadIcon from "../../assets/images/svg/white-download.svg";
import ExcelIcon from "../../assets/images/svg/excel.svg";
import DocumentIcon from "../../assets/images/svg/grey-document.svg";

function ExecutionSummary({ onDownload, onExport, onAuditTrail }) {
  const statsArr = [
    { label: "Institution", value: "Bank A" },
    { label: "Execution Date", value: "20-01-2024" },
    { label: "Executed Timestamp", value: "10:30:45" },
    { label: "Duration", value: "12.4s" },
    { label: "Overall Status", value: "Completed" },
    { label: "Executed", value: "45", valueClassName: "text-[#2563EB]" },
    { label: "Passed", value: "42", valueClassName: "text-[#22C55E]" },
    { label: "Failed", value: "3", valueClassName: "text-[#FF4D4D]" },
    { label: "Errors", value: "0", valueClassName: "text-[#F59E0B]" },
    { label: "Pass Rate", value: "93.3%", valueClassName: "text-[#2563EB]" },
  ];

  return (
    <Card className="!p-0 border border-[#CFE9FF]">
      <div className="p-5">
        <p className="text-[20px] font-bold text-[#242424]">
          Execution Summary
        </p>

        {/* Stats grid */}
        <div className="mt-4 grid grid-cols-5 gap-3">
          {statsArr.map((item, i) => {
            const isStatus = item.label === "Overall Status";

            const statusColor =
              isStatus && item.value?.toLowerCase() === "completed"
                ? "text-[#00D1BC]"
                : isStatus
                  ? "text-[#FF4D4D]"
                  : item.valueClassName || "text-[#0F192E]";

            return (
              <div
                key={i}
                className="bg-white border border-[#E7EEF7] rounded-lg p-4"
              >
                <p className="text-[14px] text-[#7E7E7E] leading-4">
                  {item.label}
                </p>
                <p
                  className={`text-[16px] font-bold mt-1 leading-5 ${statusColor}`}
                >
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-3">
          <PrimaryButton
            onClick={onDownload}
            className="flex items-center gap-1 h-[40px] !text-[14px]"
          >
            <img src={DownloadIcon} alt="" />
            Download Full Report
          </PrimaryButton>

          <OutlinedButton
            onClick={onExport}
            className="!text-[#00D1BC] !border-[#00D1BC] flex items-center gap-1 h-[40px] !text-[14px]"
          >
            <img src={ExcelIcon} alt="" />
            Export to Excel
          </OutlinedButton>

          <OutlinedButton
            onClick={onAuditTrail}
            className="flex items-center gap-1 h-[40px] !text-[14px]"
          >
            <img src={DocumentIcon} alt="" />
            View Audit Trail
          </OutlinedButton>
        </div>
      </div>
    </Card>
  );
}

export default ExecutionSummary;
