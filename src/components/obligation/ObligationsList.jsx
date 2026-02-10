import React, { useEffect, useMemo, useState } from "react";
import Card from "../common/Card";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import Table from "../common/Table";
import StatusBadge from "../common/StatusBadge";
import ProgressBar from "../common/ProgressBar";
import { useObligationContext } from "../../contexts/ObligationContext";
import {
  fetchObligationListApi,
  fetchSingleObligationApi,
} from "../../../connections/apis/obligation/obligation";
import { confidenceText, normalizeConfidence } from "../../../helper";
import ObligationDocumentModal from "../obligation/modal/ObligationDocumentModal";

const STATUS_OPTIONS = [
  { label: "Approved", value: "approved" },
  { label: "Draft", value: "draft" },
];

const CONF_OPTIONS = [
  { label: "High (90%+)", value: "high" },
  { label: "Medium (70-90%)", value: "medium" },
  { label: "Low (<70%)", value: "low" },
];

function ObligationsList() {
  const [filters, setFilters] = useState({
    search: "",
    status: "", // "" means all
    confidenceLevel: "", // "" means all
  });
  const [page, setPage] = useState(1);
  const limit = 20;
  const {
    obligationModal,
    obligationDocument,
    setObligationDocument,
    setObligationModal,
    obligationList,
    setObligationList,
  } = useObligationContext();

  useEffect(() => {
    fetchObligationList();
  }, [filters.status, filters.confidenceLevel, page]);

  const fetchObligationList = async () => {
    const res = await fetchObligationListApi({
      status: filters.status || undefined,
      confidence: filters.confidenceLevel || undefined,
      page,
      limit,
    });

    const list = (res?.data?.obligations || []).map((item) => ({
      ...item,
      confidence: normalizeConfidence(item.confidence),
    }));

    setObligationList(list);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPage(1);
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = async (item) => {
    try {
      const res = await fetchSingleObligationApi(item.obligation_id);
      setObligationDocument(res.data);
      setObligationModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBySearch = useMemo(() => {
    const list = Array.isArray(obligationList) ? obligationList : [];
    const q = filters.search.trim().toLowerCase();
    if (!q) return list;

    return list.filter((item) => {
      const id = String(item.obligation_id || "").toLowerCase();
      const statement = String(item.statement || "").toLowerCase();
      return id.includes(q) || statement.includes(q);
    });
  }, [obligationList, filters.search]);

  return (
    <>
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
          {filteredBySearch?.map((item, index) => (
            <tr
              key={item.obligation_id || index}
              className={`
              text-sm border-b border-[#F1F1F1] cursor-pointer h-16
              ${index % 2 === 0 ? "bg-white" : "bg-[#F1FFFD]"}
            `}
              onClick={() => handleOpenModal(item)}
            >
              <td className="p-3 text-[#434343]">
                <button
                  type="button"
                  className="px-3 py-1 rounded-lg text-[#00D1BC] text-[12px] bg-[#E5FAF9] hover:opacity-90 transition"
                >
                  {item.obligation_id}
                </button>
              </td>

              <td className="p-3 text-[#434343] font-medium">
                {item.statement}
              </td>

              <td className="p-3 text-[#434343]">
                <div className="flex items-center gap-2">
                  <ProgressBar value={normalizeConfidence(item.confidence)} />
                  <span className="text-xs text-gray-600">
                    {confidenceText(item.confidence)}
                  </span>
                </div>
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

      <ObligationDocumentModal
        isOpen={obligationModal}
        onClose={() => setObligationModal(false)}
        document={obligationDocument}
        fetchObligationList={fetchObligationList}
      />
    </>
  );
}

export default ObligationsList;
