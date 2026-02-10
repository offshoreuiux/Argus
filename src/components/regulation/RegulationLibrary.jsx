import { useEffect, useMemo } from "react";
import Card from "../common/Card";
import StatusBadge from "../common/StatusBadge";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import Table from "../common/Table";
import { useRegulationContext } from "../../contexts/RegulationContext";
import { fetchSingleRegulationsApi } from "../../../connections/apis/regulation/regulation";
import { formatDateDMY } from "../../../helper";

function RegulationLibrary({
  fetchRegulationsList,
  filters,
  setFilters,
  page,
  setPage,
  limit,
}) {
  const { setRegulationModal, setRegulationDocument, regulationList } =
    useRegulationContext();

  useEffect(() => {
    fetchRegulationsList();
  }, [filters.status, page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "status") setPage(1);

    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = async (item) => {
    try {
      const res = await fetchSingleRegulationsApi(item.doc_id);
      setRegulationDocument(res.data);
      setRegulationModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredRegulations = useMemo(() => {
    const list = Array.isArray(regulationList) ? [...regulationList] : [];

    const q = filters.search.trim().toLowerCase();
    const searched = !q
      ? list
      : list.filter((r) => {
          const title = String(r.title || "").toLowerCase();
          const version = String(r.version || "").toLowerCase();
          const status = String(r.status || "").toLowerCase();
          return title.includes(q) || version.includes(q) || status.includes(q);
        });

    searched.sort((a, b) => {
      const aTime = a?.uploaded_at ? new Date(a.uploaded_at).getTime() : 0;
      const bTime = b?.uploaded_at ? new Date(b.uploaded_at).getTime() : 0;
      return filters.sort === "oldest" ? aTime - bTime : bTime - aTime;
    });

    return searched;
  }, [regulationList, filters.search, filters.sort]);

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
              options={[
                { label: "All", value: "all" },
                { label: "Processed", value: "processed" },
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
        {filteredRegulations?.map((item, index) => (
          <tr
            key={item.doc_id}
            className={`
              text-sm border-b border-[#F1F1F1] cursor-pointer h-[64px]
              ${index % 2 === 0 ? "bg-white" : "bg-[#F1FFFD]"}
            `}
            onClick={() => handleOpenModal(item)}
          >
            <td className="p-3 text-[#434343]">
              {(page - 1) * limit + (index + 1)}
            </td>
            <td className="p-3 text-[#434343] font-medium">{item.title}</td>
            <td className="p-3 text-[#434343]">{item.version}</td>
            <td className="p-3 text-[#434343]">
              <StatusBadge status={item.status} />
            </td>
            <td className="p-3 text-[#434343]">
              {formatDateDMY(item.uploaded_at)}
            </td>
            <td className="p-3 text-[#434343]">{item.obligations_count}</td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}

export default RegulationLibrary;
