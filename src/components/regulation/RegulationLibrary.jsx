import React, { useState } from "react";
import Card from "../common/Card";
import StatusBadge from "../common/StatusBadge";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import Table from "../common/Table";
import { useRegulationContext } from "../../contexts/RegulationContext";

const regulations = [
  {
    id: 1,
    title: "GDPR 2018",
    version: "1.0",
    status: "Active",
    uploadDate: "01-10-2026",
    obligations: 24,
  },
  {
    id: 2,
    title: "SOC2 Type II",
    version: "1.2",
    status: "Draft",
    uploadDate: "05-10-2026",
    obligations: 18,
  },
  {
    id: 3,
    title: "HIPAA",
    version: "2.1",
    status: "Active",
    uploadDate: "15-12-2025",
    obligations: 32,
  },
  {
    id: 4,
    title: "SOC2 Type II",
    version: "1.2",
    status: "Draft",
    uploadDate: "05-10-2026",
    obligations: 18,
  },
  {
    id: 5,
    title: "HIPAA",
    version: "2.1",
    status: "Active",
    uploadDate: "15-12-2025",
    obligations: 32,
  },
];

function RegulationLibrary() {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    sort: "none",
  });
  const { setRegulationModal, setRegulationDocument } = useRegulationContext();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (item) => {
    console.log("item", item);
    setRegulationModal(true);
    setRegulationDocument(item);
  };

  return (
    <Card>
      {/* Header */}
      <div className="flex flex-col gap-4">
        <p className="text-[20px] font-bold text-[#242424]">
          Regulation Library
        </p>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <InputField
              label={false}
              name="search"
              placeholder="Search regulations..."
              value={filters.search}
              handleChange={handleFilterChange}
            />
          </div>

          <div className="flex-1">
            <SelectField
              label={false}
              name="status"
              value={filters.status}
              handleChange={handleFilterChange}
              placeholder="All Status"
              options={[
                { label: "Active", value: "active" },
                { label: "Draft", value: "draft" },
              ]}
              />
          </div>
          <div className="flex-1">
            <SelectField
              label={false}
              name="sort"
              value={filters.sort}
              handleChange={handleFilterChange}
              placeholder="Sort by Upload Date"
              options={[
                { label: "Newest First", value: "newest" },
                { label: "Oldest First", value: "oldest" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        headerArr={[
          "# Sno.",
          "Title",
          "Version",
          "Status",
          "Upload Date",
          "Obligations",
        ]}
        containerClassName={"max-h-[600px] overflow-y-auto"}
      >
        {regulations.map((item, index) => (
          <tr
            key={item.id}
            className={`
                  text-sm border-b border-[#F1F1F1] cursor-pointer h-[64px]
                  ${index % 2 === 0 ? "bg-white" : "bg-[#F1FFFD]"}
                `}
            onClick={() => handleOpenModal(item)}
          >
            <td className="p-3 text-[#434343]">{item.id}</td>
            <td className="p-3 text-[#434343] font-medium">{item.title}</td>
            <td className="p-3 text-[#434343]">{item.version}</td>
            <td className="p-3 text-[#434343]">
              <StatusBadge status={item.status} />
            </td>
            <td className="p-3 text-[#434343]">{item.uploadDate}</td>
            <td className="p-3 text-[#434343]">{item.obligations}</td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}

export default RegulationLibrary;
