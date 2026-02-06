import React, { useMemo, useState, useEffect } from "react";
import Card from "../common/Card";
import Accordion from "../common/Accordion";
import SelectField from "../common/SelectField";
import GreenCheckIcon from "../../assets/images/svg/green-outline-check.svg";
import RedCrossIcon from "../../assets/images/svg/red-outline-x.svg";
import OutlinedButton from "../common/OutlinedButton";
import { useResultsContext } from "../../contexts/ResultsContext";
import ExceptionManagementModal from "./modal/ExceptionModal";
import HistoricalTrendModal from "./modal/HistoricalTrendModal";

const apiMock = [
  {
    id: "obl-001",
    status: "pass",
    code: "OBL-001",
    meta: "• Art. 28",
    title: "Maintain detailed records",
    rightTop: "20-01-2024 / 10:30",
    rightBottom: "2.5s",
    controlPattern: "Threshold Check",
    dataSource: "Processing Log",
    evidence: { records_found: 1250, compliance: 98 },
  },
  {
    id: "obl-002",
    status: "fail",
    code: "OBL-002",
    meta: "• Art. 32",
    title: "Implement security measures",
    rightTop: "20-01-2024 / 10:32",
    rightBottom: "3.2s",
    controlPattern: "Formula Check",
    dataSource: "Security Metrics",
    evidence: { encryption: 89, required: 95 },
    violationTitle: "Violation Details",
    violationText:
      "Encryption level is below threshold (89% actual vs 95% required)",
    showActions: true,
  },
  {
    id: "obl-003",
    status: "pass",
    code: "OBL-003",
    meta: "• Art. 35",
    title: "Conduct Data Impact Assessment",
    rightTop: "20-01-2024 / 10:25",
    rightBottom: "1.8s",
    controlPattern: "Timeliness Check",
    dataSource: "Assessment Log",
    evidence: { assessments: 45, ontime: 100 },
  },
];

function ControlResults() {
  const [filter, setFilter] = useState("all");
  const [rows, setRows] = useState([]);
  const {
    exceptionModal,
    setExceptionModal,
    historicalTrendModal,
    setHistoricalTrendModal,
  } = useResultsContext();
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setRows(apiMock);
  }, []);

  const filteredRows = useMemo(() => {
    if (filter === "pass") return rows.filter((r) => r.status === "pass");
    if (filter === "fail") return rows.filter((r) => r.status === "fail");
    return rows;
  }, [rows, filter]);

  const accordionItems = useMemo(() => {
    return filteredRows.map((r) => ({
      ...r,
      leftIcon:
        r.status === "pass" ? (
          <img src={GreenCheckIcon} alt="" className="w-5 h-5" />
        ) : (
          <img src={RedCrossIcon} alt="" className="w-5 h-5" />
        ),

      renderContent: (item) => (
        <AccordionBody
          item={item}
          onOpenException={(clicked) => {
            setSelectedItem(clicked);
            setExceptionModal(true);
          }}
          onOpenTrend={(clicked) => {
            setSelectedItem(clicked);
            setHistoricalTrendModal(true);
          }}
        />
      ),
    }));
  }, [filteredRows, setExceptionModal]);

  return (
    <>
      <Card className="!p-0 border border-[#CFE9FF]">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-[20px] font-bold text-[#242424]">
              Control Results
            </p>

            <div className="min-w-[200px]">
              <SelectField
                value={filter}
                handleChange={(e) => setFilter(e.target.value)}
                options={[
                  { label: "All", value: "all" },
                  { label: "Passed", value: "pass" },
                  { label: "Failed", value: "fail" },
                ]}
              />
            </div>
          </div>

          <div className="mt-4">
            <Accordion
              items={accordionItems}
              defaultOpenId={accordionItems?.[0]?.id}
            />
          </div>
        </div>
      </Card>

      <ExceptionManagementModal
        isOpen={exceptionModal}
        onClose={() => {
          setExceptionModal(false);
          setSelectedItem(null);
        }}
        obligationId={selectedItem?.code || ""}
        detectedTimestamp={selectedItem?.rightTop || ""}
        defaultViolationSummary={selectedItem?.violationText || ""}
        onSubmit={(payload) => {
          console.log("Exception decision payload:", payload);
          console.log("Selected item:", selectedItem);
        }}
      />

      {/* ✅ Historical Trend modal */}
      <HistoricalTrendModal
        isOpen={historicalTrendModal}
        onClose={() => setHistoricalTrendModal(false)}
        obligationId={selectedItem?.code || ""}
        obligationTitle={selectedItem?.title || ""}
        // you can compute this from API later
        periodLabel="Last 30 days (2024-01-20 - 2023-12-21)"
        thresholdLabel="Threshold (95%)"
        currentLabel="Current: 89%"
        summary={{
          daysBelowThreshold: 12,
          previousViolations: 3,
          averageValue: "91.2%",
          minMax: "78% / 96%",
        }}
      />
    </>
  );
}

export default ControlResults;

function AccordionBody({ item, onOpenException, onOpenTrend }) {
  return (
    <div className="bg-white rounded-xl">
      <div className="grid grid-cols-2 gap-10">
        <div>
          <p className="text-[14px] font-medium text-[#7E7E7E]">
            Control Pattern
          </p>
          <p className="text-[16px] font-semibold text-[#0F192E] mt-1">
            {item.controlPattern || "-"}
          </p>
        </div>

        <div>
          <p className="text-[14px] font-medium text-[#7E7E7E]">Data Source</p>
          <p className="text-[16px] font-semibold text-[#0F192E] mt-1">
            {item.dataSource || "-"}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[14px] font-medium text-[#7E7E7E]">
          Evidence (JSON)
        </p>

        <div className="mt-2 bg-[#1E2A44] text-white rounded-lg px-3 py-2 text-[12px] overflow-x-auto">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(item.evidence || {}, null, 2)}
          </pre>
        </div>
      </div>

      {item.status === "fail" && item.violationText ? (
        <div className="mt-4 bg-[#FFEBEB] border border-[#E4323233] rounded-lg p-3">
          <p className="text-[12px] font-semibold text-[#B60303]">
            {item.violationTitle || "Violation Details"}
          </p>
          <p className="text-[14px] font-medium text-[#E43232] mt-0.5">
            {item.violationText}
          </p>
        </div>
      ) : null}

      {item.status === "fail" && item.showActions ? (
        <div className="mt-4 flex gap-3">
          <button
            className="px-4 h-[40px] rounded-lg bg-[#E43232] cursor-pointer text-white font-medium flex items-center gap-2"
            style={{ boxShadow: "0 0 22px 0 #E4323266" }}
            onClick={() => onOpenException(item)}
          >
            <WarningIcon />
            Exception Actions
          </button>

          <OutlinedButton
            className="h-[40px] font-medium flex items-center gap-2"
            onClick={() => onOpenTrend(item)}
          >
            <TrendIcon />
            Historical Trend
          </OutlinedButton>
        </div>
      ) : null}
    </div>
  );
}

function WarningIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 9v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 17h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M10.3 4.5 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.5a2 2 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 17l6-6 4 4 7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 8h6v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
