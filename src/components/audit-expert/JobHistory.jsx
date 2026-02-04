import React, { useMemo, useState } from "react";
import Card from "../common/Card";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import TableAccordion from "../common/TableAccordion";
import DownloadIcon from "../../assets/images/svg/download.svg";
import BundleSummaryModal from "./modal/BundleSummaryModal";
import { useAuditExportContext } from "../../contexts/AuditExportContext";

const institutionOptions = [
  { label: "Select Institution", value: "" },
  { label: "Bank A", value: "Bank A" },
  { label: "Bank B", value: "Bank B" },
  { label: "Bank C", value: "Bank C" },
];

const jobRowsMock = [
  {
    id: "1",
    sn: 1,
    bundleName: "Q4 2023 Audit Package",
    generated: "15-01-2024 14:30",
    by: "Admin User",
    forWhom: "External Auditor",
    period: "01-10-2023 to 31-12-2023",
    institution: "Bank A",
    regulations: "GDPR, PCI-DSS",
    execution: 45,
    obligations: 128,
    size: "2.3 MB",
    hash: "a3f2e8c1",
    contents: [
      { title: "Execution Summary", records: 45, size: "250 KB" },
      { title: "Control Results", records: 128, size: "1.8 MB" },
      { title: "Exceptions", records: 12, size: "400 KB" },
      { title: "Audit Trail", records: 12, size: "650 KB" },
    ],
  },
  {
    id: "2",
    sn: 2,
    bundleName: "Annual Compliance Report 2023",
    generated: "10-01-2024 09:15",
    by: "Admin User",
    forWhom: "Board of Directors",
    period: "01-01-2023 to 31-12-2023",
    institution: "Bank B",
    regulations: "GDPR",
    execution: 52,
    obligations: 89,
    size: "1.8 MB",
    hash: "b5d4e9f4",
    contents: [
      { title: "Execution Summary", records: 52, size: "280 KB" },
      { title: "Control Results", records: 89, size: "1.2 MB" },
      { title: "Exceptions", records: 8, size: "320 KB" },
      { title: "Audit Trail", records: 10, size: "600 KB" },
    ],
  },
];

export default function JobHistory() {
  const [filters, setFilters] = useState({
    search: "",
    institution: "",
    from: "",
    to: "",
  });
  const {
    bundleSummaryModal,
    setBundleSummaryModal,
    selectedBundle,
    setSelectedBundle,
  } = useAuditExportContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((p) => ({ ...p, [name]: value }));
  };

  const filteredRows = useMemo(() => {
    const s = filters.search.trim().toLowerCase();

    return jobRowsMock.filter((r) => {
      const matchesSearch =
        !s ||
        r.bundleName.toLowerCase().includes(s) ||
        r.hash.toLowerCase().includes(s) ||
        String(r.execution).includes(s) ||
        String(r.obligations).includes(s);

      const matchesInstitution =
        !filters.institution || r.institution === filters.institution;

      return matchesSearch && matchesInstitution;
    });
  }, [filters]);

  const columns = [
    { key: "sn", label: "#SNo.", width: "70px" },
    { key: "bundleName", label: "Bundle Name", width: "200px" },
    { key: "generated", label: "Generated", width: "150px" },
    { key: "by", label: "By", width: "120px" },
    { key: "forWhom", label: "For", width: "120px" },
    { key: "period", label: "Period", width: "130px" },
    { key: "institution", label: "Institution", width: "120px" },
    { key: "regulations", label: "Regulations", width: "120px" },
    { key: "execution", label: "Execution", width: "100px" },
    { key: "obligations", label: "Obligations", width: "100px" },
    { key: "size", label: "Size", width: "100px" },
    { key: "hash", label: "Hash", width: "150px" },
    { key: "action", label: "Action", width: "260px" },
  ];

  return (
    <>
      <Card className="!p-0 border border-[#CFE9FF]">
        <div className="p-5">
          <p className="text-[20px] font-bold text-[#242424]">Job History</p>

          {/* Filters */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <InputField
              labelTitle="Search"
              name="search"
              value={filters.search}
              handleChange={handleChange}
              placeholder="Search by ID and statement"
            />

            <SelectField
              labelTitle="Institution"
              name="institution"
              value={filters.institution}
              handleChange={handleChange}
              placeholder="Select Institution"
              options={institutionOptions}
            />

            <InputField
              labelTitle="Date Range From"
              type="date"
              name="from"
              value={filters.from}
              handleChange={handleChange}
            />

            <InputField
              labelTitle="Date Range To"
              type="date"
              name="to"
              value={filters.to}
              handleChange={handleChange}
            />
          </div>

          {/* Table */}
          <div className="mt-4 overflow-x-auto">
            {/* IMPORTANT: single scroller */}
            <div className="inline-block min-w-full align-top">
              {/* This min-width controls when scroll appears */}
              <div className="min-w-[1400px]">
                <TableAccordion
                  columns={columns}
                  rows={filteredRows}
                  defaultOpenId={filteredRows?.[0]?.id}
                  rowClassName="text-[12px] text-[#434343]"
                  renderRow={(row) => (
                    <>
                      <Cell className="px-3 py-3">{row.sn}</Cell>
                      <Cell className="px-3 py-3">
                        <span className="text-[14px] font-semibold text-[#00D1BC]">
                          {row.bundleName}
                        </span>
                      </Cell>
                      <Cell className="px-3 py-3 whitespace-pre-line">
                        {row.generated.replace(" ", "\n")}
                      </Cell>
                      <Cell className="px-3 py-3 whitespace-pre-line">
                        {row.by.replace(" ", "\n")}
                      </Cell>
                      <Cell className="px-3 py-3 whitespace-pre-line">
                        {row.forWhom.replace(" ", "\n")}
                      </Cell>
                      <Cell className="px-3 py-3 whitespace-pre-line">
                        {row.period.replace(" to ", "\n")}
                      </Cell>
                      <Cell className="px-3 py-3">{row.institution}</Cell>
                      <Cell className="px-3 py-3 whitespace-pre-line">
                        {row.regulations.replace(", ", ",\n")}
                      </Cell>
                      <Cell className="px-3 py-3 text-center">
                        {row.execution}
                      </Cell>
                      <Cell className="px-3 py-3 text-center">
                        {row.obligations}
                      </Cell>
                      <Cell className="px-3 py-3">{row.size}</Cell>
                      <Cell className="px-3 py-3">{row.hash}</Cell>
                      <Cell className="px-3 py-3">
                        <div className="flex items-center gap-2 justify-start">
                          <ActionPill
                            icon={
                              <img
                                src={DownloadIcon}
                                alt="Download Icon"
                                className="w-[10px]"
                              />
                            }
                            text="ZIP"
                          />
                          <ActionPill
                            text="Summary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBundle(row);
                              setBundleSummaryModal(true);
                            }}
                          />
                          <ActionPill text="Verify" />
                        </div>
                      </Cell>
                    </>
                  )}
                  renderExpanded={(row) => <BundleContents row={row} />}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <BundleSummaryModal
        isOpen={bundleSummaryModal}
        onClose={() => {
          setBundleSummaryModal(false);
          setSelectedBundle(null);
        }}
        bundle={selectedBundle}
        onDownloadBundle={(bundle) => {
          console.log("Download bundle:", bundle);
        }}
      />
    </>
  );
}

function BundleContents({ row }) {
  return (
    <div>
      <p className="text-[16px] font-semibold text-[#0F192E]">
        Bundle Contents - {row.bundleName}
      </p>

      <div className="mt-3 flex flex-col gap-3">
        {row.contents?.map((c) => (
          <div
            key={c.title}
            className="border border-[#E7EEF7] rounded-lg px-4 py-3 flex items-center justify-between bg-white"
          >
            <div>
              <p className="text-[14px] font-medium text-[#434343]">
                {c.title}
              </p>
              <p className="text-[12px] text-[#7E7E7E] mt-1">
                {c.records} records
              </p>
            </div>

            <p className="text-[14px] font-medium text-[#434343]">{c.size}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cell({ children, className = "" }) {
  return (
    <div className={`text-start text-[14px] text-[#434343] ${className}`}>
      {children}
    </div>
  );
}

function ActionPill({ text, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-[28px] px-3 rounded-md border border-[#CFE9FF] cursor-pointer bg-white
        text-[#00D1BC] text-[12px] font-medium flex items-center gap-2"
    >
      {icon ? <span className="text-[12px]">{icon}</span> : null}
      {text}
    </button>
  );
}
