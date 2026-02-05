import React, { useMemo } from "react";
import Modal from "../../common/Modal";
import OutlinedButton from "../../common/OutlinedButton";
import DownloadIcon from "../../../assets/images/svg/download.svg";

export default function BundleSummaryModal({
  isOpen,
  onClose,
  bundle,
  onDownloadBundle,
}) {
  const safe = bundle || {};

  const coveragePeriod = useMemo(() => {
    // If your API sends separate start/end, use them.
    // Here we reuse `period` which is: "01-10-2023 to 31-12-2023"
    return safe.period || "-";
  }, [safe]);

  const generatedText = useMemo(() => {
    // "15-01-2024 14:30" -> "2024-01-15 14:30" if you want.
    return safe.generated || "-";
  }, [safe]);

  const regs = safe.regulations || "-";
  const hashShort = safe.hash ? `${safe.hash.slice(0, 8)}...` : "-";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bundle Summary"
      bodyClassName="!p-0"
      widthClass="w-[640px]"
    >
      <div className="px-6 py-5">
        {/* Top green card */}
        <div className="border border-[#C4EEEA] bg-[#EDFFFD] rounded-lg p-4">
          <p className="text-[14px] font-medium text-[#7E7E7E]">Bundle Name</p>
          <p className="text-[16px] font-semibold text-[#00D1BC] mt-1">
            {safe.bundleName || "-"}
          </p>
        </div>

        {/* Download button */}
        <OutlinedButton
          onClick={() => onDownloadBundle?.(safe)}
          className="w-full !border-[#00D1BC] !text-[#00D1BC] text-[14px] mt-5"
        >
          <span className="flex items-center justify-center gap-2">
            <img src={DownloadIcon} alt="" /> Download Full Bundle
          </span>
        </OutlinedButton>

        {/* Summary Details */}
        <p className="text-[16px] font-semibold text-[#434343] mt-5">
          Summary Details
        </p>

        <div className="mt-3 p-4 border border-[#E7EEF7] rounded-lg bg-[#F9FBFD] overflow-hidden">
          <SummaryRow
            title="Executive Summary"
            desc="Comprehensive audit bundle containing all execution results, control validations, and exception management records for regulatory compliance reporting."
            className={"pt-0"}
          />
          <Divider />
          <SummaryRow
            title="Regulatory Scope"
            desc={`Regulations: ${regs} | Coverage Period: ${coveragePeriod}`}
          />
          <Divider />
          <SummaryRow
            title="Statistics"
            desc={`Executions: ${safe.execution ?? "-"} | Obligations: ${
              safe.obligations ?? "-"
            } | Generated: ${generatedText}`}
          />
          <Divider />
          <SummaryRow
            title="Bundle Integrity"
            desc={`Hash: ${hashShort} | Signature: Verified ✓ | Size: ${
              safe.size || "-"
            }`}
            className={"pb-0"}
          />
        </div>
      </div>
    </Modal>
  );
}

function SummaryRow({ title, desc, className }) {
  return (
    <div className={`py-3 ${className}`}>
      <p className="text-[12px] font-medium text-[#242424]">{title}</p>
      <p className="text-[11px] text-[#7E7E7E] mt-1 leading-5">{desc}</p>
    </div>
  );
}

function Divider() {
  return <div className="h-[1px] bg-[#E7EEF7]" />;
}
