import React from "react";
import PrimaryButton from "../components/common/PrimaryButton";
import JobHistory from "../components/audit-expert/JobHistory";
import { useAuditExportContext } from "../contexts/AuditExportContext";
import CreateBundleModal from "../components/audit-expert/modal/CreateBundleModal";
import BundleGenerationModal from "../components/audit-expert/modal/BundleGenerationModal";

function AuditExpert() {
  const {
    createBundleModal,
    setCreateBundleModal,
    bundleGenModal,
    setBundleGenModal,
  } = useAuditExportContext();

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
        <PrimaryButton onClick={() => setCreateBundleModal(true)}>
          + Create New Bundle
        </PrimaryButton>
      </div>

      <JobHistory />

      <CreateBundleModal
        isOpen={createBundleModal}
        onClose={() => setCreateBundleModal(false)}
        onSubmit={(payload) => {
          console.log("Create bundle payload:", payload);
          setCreateBundleModal(false);
          setBundleGenModal(true);
        }}
      />

      <BundleGenerationModal
        isOpen={bundleGenModal}
        onClose={() => setBundleGenModal(false)}
        bundleName="Q4 2024 Compliance Audit Bundle"
        progress={20}
        currentStepLabel="2 of 8"
        statusLabel="Collecting Data"
        elapsed="0m 24s"
        remaining="~5s"
      />
    </div>
  );
}

export default AuditExpert;
