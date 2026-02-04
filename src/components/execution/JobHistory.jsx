import React, { useMemo, useState } from "react";
import Card from "../common/Card";
import SelectField from "../common/SelectField";
import Table from "../common/Table";
import StatusBadge from "../common/StatusBadge";
import EyeIcon from "../../assets/images/svg/eye.svg";
import DownloadIcon from "../../assets/images/svg/download.svg";
import AuditIcon from "../../assets/images/svg/audit.svg";
import RefreshIcon from "../../assets/images/svg/grey-rotate.svg";

const dateRangeArr = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "last_7_days" },
  { label: "Last 30 Days", value: "last_30_days" },
];

const bankArr = [
  { label: "Bank A", value: "bank_a" },
  { label: "Bank B", value: "bank_b" },
  { label: "Bank C", value: "bank_c" },
];

const statusesArr = [
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
  { label: "Running", value: "running" },
];

// demo data (replace with API response)
const rows = [
  {
    runId: "RUN-001",
    institution: "Bank A",
    lastExecuted: "20-01-2024",
    started: "09:30:00",
    duration: "2m 45s",
    status: "Completed",
    executed: 45,
    passed: 42,
    failed: 3,
    error: 0,
    priority: "High",
    regulations: "GDPR, PCI-DSS",
  },
  {
    runId: "RUN-002",
    institution: "Bank B",
    lastExecuted: "20-01-2024",
    started: "08:15:00",
    duration: "3m 12s",
    status: "Completed",
    executed: 38,
    passed: 36,
    failed: 2,
    error: 0,
    priority: "Critical",
    regulations: "GDPR",
  },
  {
    runId: "RUN-003",
    institution: "Bank C",
    lastExecuted: "19-01-2024",
    started: "22:00:00",
    duration: "5m 30s",
    status: "Failed",
    executed: 50,
    passed: 45,
    failed: 5,
    error: 2,
    priority: "High",
    regulations: "GDPR, HIPAA",
  },
  {
    runId: "RUN-004",
    institution: "Bank A",
    lastExecuted: "18-01-2024",
    started: "09:30:00",
    duration: "2m 45s",
    status: "Completed",
    executed: 45,
    passed: 42,
    failed: 3,
    error: 0,
    priority: "Critical",
    regulations: "GDPR, PCI-DSS",
  },
];

function JobHistory() {
  const [filters, setFilters] = useState({
    dateRange: "",
    institution: "",
    status: "",
  });

  const ActionIconBtn = ({ children, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="w-8 h-8 rounded-md border border-[#C9FBF4] bg-[#EDFFFD] flex items-center justify-center cursor-pointer hover:opacity-90 transition"
    >
      {children}
    </button>
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const statusOk = !filters.status || r.status === filters.status;
      const instOk =
        !filters.institution ||
        r.institution
          .toLowerCase()
          .includes(filters.institution.split("_")[1] ?? "");
      // dateRange not applied in demo
      return statusOk && instOk;
    });
  }, [filters]);

  const handleRefresh = () => {
    // call API refetch here
    console.log("refresh");
  };

  const handleExport = () => {
    // export logic here (CSV)
    console.log("export", filteredRows);
  };

  return (
    <Card>
      {/* Header row with buttons */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[20px] font-bold text-[#242424]">Job History</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            className="h-[34px] px-4 rounded-lg border border-[#E2E8EF] bg-white
                       text-[16px] text-[#7E7E7E] flex items-center cursor-pointer gap-2
                       hover:bg-[#F8FAFC] active:scale-[0.99]"
          >
            <img src={RefreshIcon} alt="" />
            Refresh
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="h-[34px] px-4 rounded-lg border border-[#B7F1E8] bg-[#E9FFFB]
                       text-[16px] font-semibold text-[#00D1BC] flex items-center cursor-pointer gap-2
                       hover:brightness-[0.99] active:scale-[0.99]"
          >
            <img src={DownloadIcon} alt="" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <SelectField
          labelTitle="Date Range"
          name="dateRange"
          value={filters.dateRange}
          handleChange={handleChange}
          placeholder="All Dates"
          options={dateRangeArr}
        />

        <SelectField
          labelTitle="Institution"
          name="institution"
          value={filters.institution}
          handleChange={handleChange}
          placeholder="Select Institution"
          options={bankArr}
        />

        <SelectField
          labelTitle="Status"
          name="status"
          value={filters.status}
          handleChange={handleChange}
          placeholder="All Statuses"
          options={statusesArr}
        />
      </div>

      {/* Table */}
      <div className="mt-5 rounded-xl border border-[#E2E8EF] overflow-hidden">
        <div className="overflow-x-auto">
          <Table
            headerArr={[
              "Run ID",
              "Institution",
              "Last Executed",
              "Started",
              "Duration",
              "Status",
              "Executed",
              "Passed",
              "Failed",
              "Error",
              "Priority",
              "Regulations",
              "Action",
            ]}
            containerClassName={"!mt-0"}
          >
            {filteredRows.map((r, idx) => (
              <tr
                key={r.runId}
                className={`${idx % 2 === 1 ? "bg-[#F1FFFD]" : "bg-white"} border-b border-[#E2E8EF]`}
              >
                <td className="px-4 py-4 text-[12px] text-[#00BDA8] font-semibold whitespace-nowrap">
                  {r.runId}
                </td>
                <td className="px-4 py-4 text-[12px] text-[#374151] whitespace-nowrap">
                  {r.institution}
                </td>
                <td className="px-4 py-4 text-[12px] text-[#6B7280] whitespace-nowrap">
                  {r.lastExecuted}
                </td>
                <td className="px-4 py-4 text-[12px] text-[#6B7280] whitespace-nowrap">
                  {r.started}
                </td>
                <td className="px-4 py-4 text-[12px] text-[#6B7280] whitespace-nowrap">
                  {r.duration}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-4 text-[12px] text-[#374151] whitespace-nowrap">
                  {r.executed}
                </td>
                <td className="px-4 py-4 text-[12px] text-[#16A34A] font-semibold whitespace-nowrap">
                  {r.passed}
                </td>
                <td className="px-4 py-4 text-[12px] text-[#EF4444] font-semibold whitespace-nowrap">
                  {r.failed}
                </td>
                <td className="px-4 py-4 text-[12px] text-[#374151] whitespace-nowrap">
                  {r.error}
                </td>
                <td
                  className={`px-4 py-4 text-[12px] font-semibold whitespace-nowrap ${
                    r.priority === "Critical"
                      ? "text-[#EF4444]"
                      : "text-[#F59E0B]"
                  }`}
                >
                  {r.priority}
                </td>
                <td className="px-4 py-4 text-[12px] text-[#6B7280] whitespace-nowrap">
                  {r.regulations}
                </td>
                <td className="px-4 py-4 text-[12px] text-[#6B7280] whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <ActionIconBtn onClick={() => console.log("edit", item)}>
                      <img src={EyeIcon} alt="" />
                    </ActionIconBtn>
                    <ActionIconBtn onClick={() => console.log("rerun", item)}>
                      <img src={DownloadIcon} alt="" />
                    </ActionIconBtn>
                    <ActionIconBtn onClick={() => console.log("view", item)}>
                      <img src={AuditIcon} alt="" />
                    </ActionIconBtn>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      </div>
    </Card>
  );
}

export default JobHistory;
