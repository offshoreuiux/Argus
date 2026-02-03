import React, { useMemo, useState } from "react";
import Card from "../common/Card";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import Table from "../common/Table";
import StatusBadge from "../common/StatusBadge";
import EditIcon from "../../assets/images/svg/edit.svg";
import HistoryIcon from "../../assets/images/svg/history.svg";
import CircleMinusIcon from "../../assets/images/svg/circle-minus.svg";

const STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Draft", value: "Draft" },
];

const CONF_OPTIONS = [
  { label: "High (90%+)", value: "90" },
  { label: "Medium (70-90%)", value: "70-90" },
  { label: "< 70%", value: "0" },
];

const mappingArr = [
  {
    obligationId: "OBL-001",
    statement: "Maintain detailed records of all data processing activities",
    controlPattern: "Threshold Check",
    dataSource: "ProcessingLog",
    priority: "High",
    lastExecuted: "20-01-2024 09:30",
    executionStatus: "Active",
    status: "Active",
  },
  {
    obligationId: "OBL-002",
    statement:
      "Implement appropriate technical and organizational measures for security",
    controlPattern: "Formula Check",
    dataSource: "SecurityMetrics",
    priority: "Critical",
    lastExecuted: "19-01-2024 09:30",
    executionStatus: "Active",
    status: "Active",
  },
  {
    obligationId: "OBL-003",
    statement: "Conduct Data Impact Assessment",
    controlPattern: "Timeliness Check",
    dataSource: "PIADatabase",
    priority: "High",
    lastExecuted: "15-01-2024 08:15",
    executionStatus: "Failed",
    status: "Active",
  },
  {
    obligationId: "OBL-004",
    statement: "Document all security incidents within 24 hours",
    controlPattern: "Threshold Check",
    dataSource: "IncidentLog",
    priority: "Critical",
    lastExecuted: "20-01-2024 11:45",
    executionStatus: "Active",
    status: "Active",
  },
  {
    obligationId: "OBL-005",
    statement: "Verify encryption on all data at rest",
    controlPattern: "Automated Workflow",
    dataSource: "EncryptionAudit",
    priority: "High",
    lastExecuted: "18-01-2024 06:00",
    executionStatus: "Active",
    status: "Active",
  },
];

const StatusWithCheck = ({ label }) => (
  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E7FFE6] text-[#16A34A] border border-[#9BE79A] text-xs font-semibold">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6L9 17l-5-5"
        stroke="#0BB50B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    {label}
  </span>
);

const PriorityText = ({ priority }) => {
  const cls =
    priority === "Critical"
      ? "text-[#FF2D2D] font-semibold"
      : "text-[#F59E0B] font-semibold";
  return <span className={cls}>{priority}</span>;
};

const ActionIconBtn = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-8 h-8 rounded-md border border-[#C9FBF4] bg-[#EDFFFD] flex items-center justify-center hover:opacity-90 transition"
  >
    {children}
  </button>
);

function MappingList() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    confidenceLevel: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // optional filtering (basic search)
  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return mappingArr.filter((row) => {
      const matchesSearch =
        !q ||
        row.obligationId.toLowerCase().includes(q) ||
        row.statement.toLowerCase().includes(q);

      const matchesStatus = !filters.status || row.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [filters]);

  return (
    <Card>
      <p className="text-[20px] font-bold text-[#242424]">Mapping List</p>

      {/* Filters */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <InputField
          labelTitle="Search"
          name="search"
          value={filters.search}
          handleChange={handleChange}
          placeholder="Search by ID and statement"
        />

        <SelectField
          labelTitle="Status"
          name="status"
          value={filters.status}
          handleChange={handleChange}
          placeholder="All Statuses"
          options={STATUS_OPTIONS}
        />

        <SelectField
          labelTitle="Confidence Level"
          name="confidenceLevel"
          value={filters.confidenceLevel}
          handleChange={handleChange}
          placeholder="All Levels"
          options={CONF_OPTIONS}
        />
      </div>

      {/* Table */}
      <Table
        headerArr={[
          "Status",
          "Obligation ID/Statement",
          "Control Pattern",
          "Data Source",
          "Priority",
          "Last Executed",
          "Execution Status",
          "Action",
        ]}
        containerClassName={"max-h-[600px] overflow-y-auto"}
      >
        {filtered.map((item, index) => (
          <tr
            key={item.obligationId}
            className={`text-sm border-b border-[#F1F1F1] h-[64px]
              ${index % 2 === 0 ? "bg-white" : "bg-[#F1FFFD]"}
            `}
          >
            <td className="p-3">
              <StatusWithCheck label={item.status} />
            </td>
            <td className="p-3">
              <div className="flex flex-col gap-1">
                <span className="inline-flex text-[#00B8A9] text-xs w-fit">
                  {item.obligationId}
                </span>
                <p className="text-xs text-[#6B7280] leading-4 max-w-[260px]">
                  {item.statement}
                </p>
              </div>
            </td>
            <td className="p-3 text-[#434343]">{item.controlPattern}</td>
            <td className="p-3 text-[#434343]">{item.dataSource}</td>
            <td className="p-3">
              <PriorityText priority={item.priority} />
            </td>
            <td className="p-3 text-[#434343]">{item.lastExecuted}</td>
            <td className="p-3 text-center">
              <StatusBadge status={item.executionStatus} />
            </td>
            <td className="p-3">
              <div className="flex items-center justify-center gap-2">
                <ActionIconBtn onClick={() => console.log("edit", item)}>
                  <img src={EditIcon} alt="" />
                </ActionIconBtn>
                <ActionIconBtn onClick={() => console.log("rerun", item)}>
                  <img src={HistoryIcon} alt="" />
                </ActionIconBtn>
                <ActionIconBtn onClick={() => console.log("view", item)}>
                  <img src={CircleMinusIcon} alt="" />
                </ActionIconBtn>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}

export default MappingList;
