import React from "react";
import UploadRegulation from "../components/regulation/UploadRegulation";
import RegulationLibrary from "../components/regulation/RegulationLibrary";
import { useRegulationContext } from "../contexts/RegulationContext";
import RegulationDocumentModal from "../components/regulation/modal/RegulationDocumentModal";

function RegulationIngestion() {
  const { regulationModal, setRegulationModal, regulationDocument } =
    useRegulationContext();

  return (
    <div className="h-screen p-[24px] bg-[#F0F2F6] flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-[24px] font-bold text-[#242424]">
          Regulation Ingestion
        </p>
        <p className="text-[16px] text-[#7E7E7E] mt-1">
          Upload and process regulatory documents for AI-powered obligation
          extraction
        </p>
      </div>

      <div className="flex gap-6 items-start">
        <div className="w-[550px]">
          <UploadRegulation />
        </div>
        <div className="flex-1">
          <RegulationLibrary />
        </div>
      </div>

      {/* Modal */}
      <RegulationDocumentModal
        isOpen={regulationModal}
        onClose={() => setRegulationModal(false)}
        document={regulationDocument}
      />
    </div>
  );
}

export default RegulationIngestion;
