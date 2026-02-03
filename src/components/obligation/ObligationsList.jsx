import React, { useMemo, useState } from "react";
import Card from "../common/Card";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import Table from "../common/Table";
import StatusBadge from "../common/StatusBadge";
import ProgressBar from "../common/ProgressBar";
import { useObligationContext } from "../../contexts/ObligationContext";

const STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Draft", value: "Draft" },
];

const CONF_OPTIONS = [
  { label: "High (90%+)", value: "90" },
  { label: "Medium (70-90%)", value: "70-90" },
  { label: "Medium (<70%)", value: "0" },
];

const obligations = [
  {
    obligationId: "OBL-001",
    statement: "Maintain detailed records of all data processing activities",
    confidence: 95,
    status: "Active",
    version: "v2.1",
  },
  {
    obligationId: "OBL-002",
    statement:
      "Implement appropriate technical and organizational measures for security",
    confidence: 87,
    status: "Active",
    version: "v1.0",
  },
  {
    obligationId: "OBL-003",
    statement: "Conduct Data Impact Assessment before processing",
    confidence: 92,
    status: "Draft",
    version: "v2.0",
  },
  {
    obligationId: "OBL-004",
    statement: "Notify data subjects of any personal data breach",
    confidence: 88,
    status: "Active",
    version: "v1.5",
  },
  {
    obligationId: "OBL-005",
    statement: "Appoint Data Protection Officer when required",
    confidence: 90,
    status: "Draft",
    version: "v1.0",
  },
];

function ObligationsList() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    confidenceLevel: "",
  });
  const { setObligationDocument, setObligationModal } = useObligationContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (item) => {
    setObligationModal(true);
    setObligationDocument(item);
  };

  return (
    <Card className="p-0">
      <p className="text-[20px] font-bold text-[#242424]">Obligations List</p>

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
          "Obligation ID",
          "Statement",
          "Confidence",
          "Status",
          "Version",
          "Action",
        ]}
        containerClassName={"max-h-[300px] overflow-y-auto mt-4"}
      >
        {obligations.map((item, index) => (
          <tr
            key={index}
            className={`
                  text-sm border-b border-[#F1F1F1] cursor-pointer h-[64px]
                  ${index % 2 === 0 ? "bg-white" : "bg-[#F1FFFD]"}
                `}
            onClick={() => handleOpenModal(item)}
          >
            <td className="p-3 text-[#434343]">
              <button
                type="button"
                className="px-3 py-1 rounded-lg text-[#00D1BC] text-[12px] bg-[#E5FAF9] hover:opacity-90 transition"
              >
                {item.obligationId}
              </button>
            </td>
            <td className="p-3 text-[#434343] font-medium">{item.statement}</td>
            <td className="p-3 text-[#434343]">
              <ProgressBar value={item.confidence} />
            </td>
            <td className="p-3 text-[#434343]">
              <StatusBadge status={item.status} />
            </td>
            <td className="p-3 text-[#434343]">{item.version}</td>
            <td className="p-3 text-[#434343]">
              <button
                type="button"
                className="px-5 py-2 rounded-lg border border-[#00D1BC] text-[#00D1BC] text-[14px] font-semibold bg-[#E5FAF9] hover:opacity-90 transition"
              >
                Review
              </button>
            </td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}

export default ObligationsList;
