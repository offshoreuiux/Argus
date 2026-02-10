import React, { useState } from "react";
import UploadRegulation from "../components/regulation/UploadRegulation";
import RegulationLibrary from "../components/regulation/RegulationLibrary";
import { useRegulationContext } from "../contexts/RegulationContext";
import RegulationDocumentModal from "../components/regulation/modal/RegulationDocumentModal";
import { fetchRegulationListApi } from "../../connections/apis/regulation/regulation";

function RegulationIngestion() {
  const {
    regulationModal,
    setRegulationModal,
    regulationDocument,
    setRegulationList,
  } = useRegulationContext();
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    sort: "newest",
  });
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchRegulationsList = async () => {
    const res = await fetchRegulationListApi({
      status: filters.status === "all" ? undefined : filters.status,
      page,
      limit,
    });

    setRegulationList(res?.data?.regulations || []);
  };

  return (
    <div className="h-screen p-[24px] flex flex-col gap-6">
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
          <UploadRegulation fetchRegulationsList={fetchRegulationsList} />
        </div>
        <div className="flex-1">
          <RegulationLibrary
            fetchRegulationsList={fetchRegulationsList}
            filters={filters}
            setFilters={setFilters}
            page={page}
            setPage={setPage}
            limit={limit}
          />
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
