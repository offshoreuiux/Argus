import React, { useMemo } from "react";
import Modal from "../../common/Modal";
import PrimaryButton from "../../common/PrimaryButton";

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
          <p className="text-[12px] text-[#7E7E7E]">Bundle Name</p>
          <p className="text-[14px] font-semibold text-[#00B9A7] mt-1">
            {safe.bundleName || "-"}
          </p>
        </div>

        {/* Download button */}
        <button
          type="button"
          onClick={() => onDownloadBundle?.(safe)}
          className="mt-4 w-full h-[44px] rounded-lg border border-[#CFE9FF]
            text-[#00D1BC] font-medium flex items-center justify-center gap-2 bg-white"
        >
          <DownloadIcon />
          Download Full Bundle
        </button>

        {/* Summary Details */}
        <p className="text-[14px] font-medium text-[#434343] mt-5">
          Summary Details
        </p>

        <div className="mt-3 border border-[#E7EEF7] rounded-lg bg-[#F9FBFD] overflow-hidden">
          <SummaryRow
            title="Executive Summary"
            desc="Comprehensive audit bundle containing all execution results, control validations, and exception management records for regulatory compliance reporting."
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
          />
        </div>
      </div>
    </Modal>
  );
}

function SummaryRow({ title, desc }) {
  return (
    <div className="px-4 py-3">
      <p className="text-[12px] font-medium text-[#242424]">{title}</p>
      <p className="text-[11px] text-[#7E7E7E] mt-1 leading-5">{desc}</p>
    </div>
  );
}

function Divider() {
  return <div className="h-[1px] bg-[#E7EEF7]" />;
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3v10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 11l4 4 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 17v3h16v-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
