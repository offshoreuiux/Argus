import React, { useEffect, useMemo, useState } from "react";
import Card from "../common/Card";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import Table from "../common/Table";
import StatusBadge from "../common/StatusBadge";
import EditIcon from "../../assets/images/svg/edit.svg";
import HistoryIcon from "../../assets/images/svg/history.svg";
import CircleMinusIcon from "../../assets/images/svg/circle-minus.svg";
import {
  deactivateMappingApi,
  fetchMappingListApi,
  fetchSingleMappingApi,
} from "../../../connections/apis/mapping/mapping";
import { useMappingContext } from "../../contexts/MappingContext";
import { formatDateTime } from "../../../helper";

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Draft", value: "draft" },
];

const CONF_OPTIONS = [
  { label: "High (90%+)", value: "90" },
  { label: "Medium (70-90%)", value: "70-90" },
  { label: "< 70%", value: "0" },
];

const STATUS_UI = {
  active: {
    label: "Active",
    text: "text-[#0BB50B]",
    bg: "bg-[#EBFFEB]",
    border: "border-[#0BB50B33]",
    stroke: "#0BB50B",
  },
  inactive: {
    label: "Inactive",
    text: "text-[#E43232]",
    bg: "bg-[#FFEBEB]",
    border: "border-[#E4323233]",
    stroke: "#E43232",
  },
  draft: {
    label: "Draft",
    text: "text-[#F59E0B]",
    bg: "bg-[#FFF7E6]",
    border: "border-[#F59E0B33]",
    stroke: "#F59E0B",
  },
};

const StatusWithCheck = ({ label }) => {
  const key = String(label || "").toLowerCase();
  const ui = STATUS_UI[key] || STATUS_UI.draft;

  return (
    <span
      className={[
        "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold",
        "whitespace-nowrap w-fit",
        ui.text,
        ui.bg,
        ui.border,
      ].join(" ")}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path
          d="M20 6L9 17l-5-5"
          stroke={ui.stroke}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="capitalize">{ui.label}</span>
    </span>
  );
};

const PriorityText = ({ priority }) => {
  const cls =
    priority === "high"
      ? "text-[#FF2D2D] font-semibold"
      : "text-[#F59E0B] font-semibold";
  return <span className={`${cls} capitalize`}>{priority}</span>;
};

const ActionIconBtn = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-8 h-8 rounded-md border border-[#C9FBF4] bg-[#EDFFFD] cursor-pointer flex items-center justify-center hover:opacity-90 transition"
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
  const {
    mappingList,
    setMappingList,
    setSubmitError,
    setSubmitting,
    setWizard,
    setMode,
    setEditingId,
    setCreate,
  } = useMappingContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchMappingList = async () => {
    try {
      const res = await fetchMappingListApi({
        status: filters.status === "all" ? undefined : filters.status,
        // obligation_id: optional — if you want to support it later
      });

      setMappingList(res?.data?.mappings || []);
    } catch (error) {
      console.log("error", error);
      setMappingList([]);
    }
  };

  const openEditWizard = async (mapping_id) => {
    setSubmitError("");
    setSubmitting(true);

    try {
      const res = await fetchSingleMappingApi(mapping_id);
      const data = res?.data;

      // ---- Map backend -> wizard shape (adjust keys if backend differs)
      const firstKey = data?.concept_mappings
        ? Object.keys(data.concept_mappings)[0]
        : null;

      const cm = firstKey ? data.concept_mappings[firstKey] : {};

      setWizard({
        obligation_id: data?.obligation_id || "",
        control_pattern_id: data?.control_pattern_id || null, // if backend sends it
        data_source: {
          dataset: cm?.dataset || "",
          aggregation: cm?.aggregation || "SUM",
          filter_column: cm?.filter_column || "",
          filter_value: cm?.filter_value || "",
        },
        validation: {
          metricField: cm?.column || "severity",
          thresholdValue: cm?.threshold || "",
          operator: cm?.operator || "gt",
        },
        execution_frequency: data?.execution_frequency || "daily",
        priority: data?.priority || "low",
      });

      setMode("edit");
      setEditingId(mapping_id);
      setCreate(true); // opens wizard modal/page
    } catch (e) {
      setSubmitError(
        e?.response?.data?.message || e?.message || "Failed to fetch mapping",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deactiveMappingList = async (mapping_id) => {
    try {
      await deactivateMappingApi(mapping_id);
      fetchMappingList();
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchMappingList();
  }, [filters.status]);

  const filtered = useMemo(() => {
    const list = Array.isArray(mappingList) ? mappingList : [];
    const q = filters.search.trim().toLowerCase();

    let result = !q
      ? list
      : list.filter((row) => {
          const id = String(row.obligation_id || "").toLowerCase();
          const stmt = String(row.obligation_statement || "").toLowerCase();
          return id.includes(q) || stmt.includes(q);
        });

    // ⚠️ Only apply confidence filter if backend returns a confidence field for mappings
    // Example: row.confidence = "high" | "medium" | "low"
    if (filters.confidenceLevel && filters.confidenceLevel !== "all") {
      result = result.filter(
        (row) =>
          String(row.confidence || "").toLowerCase() ===
          String(filters.confidenceLevel).toLowerCase(),
      );
    }

    return result;
  }, [mappingList, filters.search, filters.confidenceLevel]);

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
        {filtered?.map((item, index) => (
          <tr
            key={item.mapping_id}
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
                  {item.obligation_id?.split("_")?.join(" ")}
                </span>
                <p className="text-xs text-[#6B7280] leading-4 max-w-[260px]">
                  {item.obligation_statement}
                </p>
              </div>
            </td>
            <td className="p-3 text-[#434343]">{item.controlPattern || "-"}</td>
            <td className="p-3 text-[#434343]">{item.dataSource || "-"}</td>
            <td className="p-3">
              <PriorityText priority={item.priority} />
            </td>
            <td className="p-3 text-[#434343]">
              {formatDateTime(item.deactivated_at) || "-"}
            </td>
            <td className="p-3">
              <StatusBadge status={item.execution_frequency} />
            </td>
            <td className="p-3">
              <div className="flex items-center justify-center gap-2">
                <ActionIconBtn onClick={() => openEditWizard(item.mapping_id)}>
                  <img src={EditIcon} alt="" />
                </ActionIconBtn>
                <ActionIconBtn onClick={() => console.log("rerun", item)}>
                  <img src={HistoryIcon} alt="" />
                </ActionIconBtn>
                <ActionIconBtn
                  onClick={() => deactiveMappingList(item.mapping_id)}
                >
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
