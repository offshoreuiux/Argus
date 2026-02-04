import React from "react";
import PrimaryButton from "../components/common/PrimaryButton";
import JobHistory from "../components/audit-expert/JobHistory";

function AuditExpert() {
  return (
    <div className="h-screen p-[24px] flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[24px] font-bold text-[#242424]">Audit Export</p>
          <p className="text-[16px] text-[#7E7E7E] mt-1">
            Generate audit bundles for external stakeholders with multi-step
            process
          </p>
        </div>
        <PrimaryButton>+ Create New Bundle</PrimaryButton>
      </div>

      <JobHistory />
    </div>
  );
}

export default AuditExpert;
