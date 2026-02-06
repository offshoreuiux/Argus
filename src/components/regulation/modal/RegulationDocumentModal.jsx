import React, { useEffect, useMemo, useState } from "react";
import Modal from "../../common/Modal";
import PrimaryButton from "../../common/PrimaryButton";
import UploadIcon from "../../../assets/images/svg/upload-file.svg";
import SmallDocIcon from "../../../assets/images/svg/file-check.svg";
import { formatDateDMY } from "../../../../helper";
import { fetchExtractedObligationsApi } from "../../../../connections/apis/regulation/regulation";

const tabsArr = [
  { label: "Documents", value: 1 },
  { label: "Obligations", value: 2 },
  { label: "History", value: 3 },
];

function RegulationDocumentModal({ isOpen, onClose, document }) {
  const [activeTab, setActiveTab] = useState(tabsArr[0].value);
  const [obligationsList, setObligationsList] = useState([]);
  console.log("document", document);
  console.log("activeTab", activeTab);

  const fetchExtractedObligationsList = async () => {
    try {
      const res = await fetchExtractedObligationsApi(document.doc_id);
      setObligationsList(res.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (activeTab === 2) {
      fetchExtractedObligationsList();
    }
  }, [activeTab]);

  // Use API data if present, otherwise fallback demo list
  const obligations = useMemo(() => {
    if (Array.isArray(document?.obligations) && document.obligations.length) {
      return document.obligations;
    }
    return [
      {
        id: 1,
        article: "Article 1",
        title: "Obligation 1",
        description:
          "Description of the regulatory obligation and its requirements...",
        status: "Mapped",
      },
      {
        id: 2,
        article: "Article 2",
        title: "Obligation 2",
        description:
          "Description of the regulatory obligation and its requirements...",
        status: "Mapped",
      },
      {
        id: 3,
        article: "Article 3",
        title: "Obligation 3",
        description:
          "Description of the regulatory obligation and its requirements...",
        status: "Mapped",
      },
      {
        id: 4,
        article: "Article 4",
        title: "Obligation 4",
        description:
          "Description of the regulatory obligation and its requirements...",
        status: "Mapped",
      },
    ];
  }, [document]);

  const history = useMemo(() => {
    if (Array.isArray(document?.history) && document.history.length) {
      return document.history;
    }

    // fallback demo list (like screenshot)
    return [
      {
        id: 1,
        title: "Document Uploaded",
        description: "User uploaded the regulation document",
        dateTime: "01/10/2026 at 12:21:04",
      },
      {
        id: 2,
        title: "Analysis Completed",
        description: "AI analysis identified all obligations",
        dateTime: "01/10/2026 at 13:26:54",
      },
      {
        id: 3,
        title: "Status Changed",
        description: "Status changed from Draft to Active",
        dateTime: "01/10/2026 at 12:21:04",
      },
      {
        id: 4,
        title: "Document Reviewed",
        description: "Compliance team reviewed the document",
        dateTime: "01/10/2026 at 13:27:54",
      },
    ];
  }, [document]);

  const obligationsCount =
    typeof document?.obligationsCount === "number"
      ? document.obligationsCount
      : obligations.length;

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return (
          <div>
            <div className="flex flex-col items-center justify-center bg-[#F9FBFD] border-2 border-[#D9D9D9] border-dashed rounded-lg p-10 text-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <img src={UploadIcon} alt="Upload Icon" className="w-12 h-12" />
                <p className="text-gray-600">{document?.filename}</p>
                <p className="text-gray-500 text-sm">
                  The original PDF document is stored securely on our servers.
                </p>
              </div>
              <PrimaryButton>Download Document</PrimaryButton>
            </div>

            {/* File Info */}
            <div className="flex gap-4 mt-5 w-full">
              <div className="bg-[#EFF6FF] h-[85px] border border-[#DCE7FF] px-4 py-2 rounded-lg flex-1">
                <p className="text-xs text-gray-500">FILE SIZE</p>
                <p className="text-gray-800 font-medium">
                  {document?.size || "2.4 MB"}
                </p>
              </div>
              <div className="bg-[#EDFFFD] h-[85px] border border-[#CDFFFA] px-4 py-2 rounded-lg flex-1">
                <p className="text-xs text-gray-500">DATE</p>
                <p className="text-gray-800 font-medium">
                  {formatDateDMY(document?.uploaded_at) || "2026-01-10"}
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col gap-4">
            {/* Info bar (exact style) */}
            <div className="flex items-center gap-2 bg-[#EFF6FF] border border-[#DCE7FF] rounded-lg px-4 py-3">
              <img src={SmallDocIcon} alt="" />
              <p className="text-sm text-[#1D4ED8]">
                <span className="font-semibold">{obligationsCount}</span>{" "}
                obligations identified in this regulation
              </p>
            </div>

            {/* Cards list */}
            <div className="flex flex-col gap-3">
              {obligations.map((item) => {
                const title =
                  item?.displayTitle ||
                  `${item?.article ? `${item.article}: ` : ""}${item?.title || "Obligation"}`;

                const statusText = item?.status || "Mapped";

                return (
                  <div
                    key={item.id || `${item.article}-${item.title}`}
                    className="bg-white border border-[#E6E6E6] rounded-lg px-4 py-4 flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#111827]">
                        {title}
                      </p>
                      <p className="text-sm text-[#6B7280] mt-1 truncate">
                        {item?.description ||
                          "Description of the regulatory obligation and its requirements..."}
                      </p>
                    </div>

                    <span className="shrink-0 bg-[#DFFFE9] text-[#15803D] text-xs font-medium px-3 py-1 rounded-full">
                      {statusText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="px-4 pb-4">
            <div className="relative flex flex-col gap-2">
              {history.map((item, index) => {
                const isLast = index === history.length - 1;

                return (
                  <div key={item.id || index} className="relative flex gap-5">
                    {/* Left: icon + vertical line */}
                    <div className="relative flex flex-col items-center">
                      {/* Check icon */}
                      <div className="h-7 w-7 rounded-full bg-[#00D1BC] flex items-center justify-center shrink-0">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M20 6L9 17l-5-5"
                            stroke="#FFFFFF"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      {/* Vertical line */}
                      {!isLast && (
                        <div className="w-[2px] flex-1 bg-[#D9E2EF] mt-2" />
                      )}
                    </div>

                    {/* Right: text */}
                    <div className="min-w-0 mb-4">
                      <p className="text-[15px] font-medium text-[#111827]">
                        {item.title}
                      </p>
                      <div className="flex flex-col gap-1 mt-1">
                        <p className="text-sm text-[#6B7280]">
                          {item.description}
                        </p>
                        <p className="text-xs text-[#9CA3AF]">
                          {item.dateTime}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={document?.title || "Document Preview"}
      description={`Version ${document?.version} • ${formatDateDMY(document?.uploaded_at)}`}
      status={document?.status}
    >
      {/* Match spacing + scroll */}
      <div className="flex flex-col max-h-[500px] overflow-y-auto">
        {/* Tabs */}
        <div className="flex border-b border-[#D4D4D4]">
          {tabsArr.map((tab) => {
            const isActive = tab.value === activeTab;

            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`py-3 px-4 text-sm font-medium border-b-2 cursor-pointer flex-1 ${
                  isActive
                    ? "text-[#00D1BC] border-[#00D1BC]"
                    : "text-gray-500 border-transparent"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content padding like screenshot */}
        <div className="pt-5">{renderTabContent()}</div>
      </div>
    </Modal>
  );
}

export default RegulationDocumentModal;
