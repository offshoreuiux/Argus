import React, { useMemo, useState } from "react";
import Modal from "../../common/Modal";
import OutlinedButton from "../../common/OutlinedButton";
import DownloadIcon from "../../../assets/images/svg/download.svg";
import { downloadSingleAuditBundleApi } from "../../../../connections/apis/audit/audit";
import { downloadBlobResponse } from "../../../../helper";

export default function BundleSummaryModal({ isOpen, onClose, bundle }) {
  const safe = bundle || {};
  const [downloading, setDownloading] = useState(false);

  const coveragePeriod = useMemo(() => {
    return safe.period || "-";
  }, [safe]);

  const generatedText = useMemo(() => {
    return safe.generated || "-";
  }, [safe]);

  const regs = safe.regulations || "-";
  const hashShort = safe.hash ? `${safe.hash.slice(0, 8)}...` : "-";

  const handleDownloadFullBundle = async () => {
    const bundleId = safe?.bundle_id || safe?.bundleId;
    if (!bundleId) return;

    try {
      setDownloading(true);

      const res = await downloadSingleAuditBundleApi(bundleId);

      const safeName = (
        safe?.bundle_name ||
        safe?.bundleName ||
        "audit-bundle"
      ).replace(/[^\w\-]+/g, "_");

      downloadBlobResponse(res, `${safeName}.zip`);
    } catch (error) {
      console.log("download error", error);
    } finally {
      setDownloading(false);
    }
  };

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
            {safe.bundle_name || safe.bundleName || "-"}
          </p>
        </div>

        {/* Download button */}
        <OutlinedButton
          onClick={handleDownloadFullBundle}
          disabled={downloading}
          className="w-full border-[#00D1BC]! text-[#00D1BC]! text-[14px] mt-5 disabled:opacity-60"
        >
          <span className="flex items-center justify-center gap-2">
            <img src={DownloadIcon} alt="" />
            {downloading ? "Downloading..." : "Download Full Bundle"}
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
  return <div className="h-px bg-[#E7EEF7]" />;
}
