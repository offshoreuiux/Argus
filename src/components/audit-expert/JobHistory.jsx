import React, { useEffect, useMemo, useState } from "react";
import Card from "../common/Card";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import TableAccordion from "../common/TableAccordion";
import DownloadIcon from "../../assets/images/svg/download.svg";
import BundleSummaryModal from "./modal/BundleSummaryModal";
import { useAuditExportContext } from "../../contexts/AuditExportContext";
import {
  downloadSingleAuditBundleApi,
  fetchAuditBundlesApi,
  fetchSingleAuditSummaryApi,
} from "../../../connections/apis/audit/audit";
import { downloadBlobResponse } from "../../../helper";

const institutionOptions = [{ label: "DEMO BANK", value: "DEMO_BANK" }];

// ✅ helper: format "2026-02-06T12:12:37.216400+00:00" -> "06-02-2026 12:12"
const formatDateTime = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);

  const pad = (n) => String(n).padStart(2, "0");
  const dd = pad(d.getDate());
  const mm = pad(d.getMonth() + 1);
  const yyyy = d.getFullYear();
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
};

const formatPeriod = (from, to) => {
  if (!from && !to) return "-";
  if (!from) return `- to ${to}`;
  if (!to) return `${from} to -`;
  return `${from} to ${to}`;
};

const safeArray = (v) => (Array.isArray(v) ? v : []);

// ✅ build contents list from API bundle.contents
const buildContentsRows = (bundle) => {
  const obligations = safeArray(bundle?.contents?.obligations);
  const auditEvents = safeArray(bundle?.contents?.audit_events);
  const exceptions = safeArray(bundle?.contents?.exceptions);

  // You can extend this later when backend adds executions/mappings in bundle
  return [
    {
      title: "Obligations",
      records: obligations.length,
      size: "-", // backend not providing size
    },
    {
      title: "Audit Events",
      records: auditEvents.length,
      size: "-",
    },
    {
      title: "Exceptions",
      records: exceptions.length,
      size: "-",
    },
  ];
};

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
    auditList,
    setAuditList,
  } = useAuditExportContext();
  const [downloadingId, setDownloadingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAuditList = async () => {
    try {
      setLoading(true);
      const res = await fetchAuditBundlesApi({
        institution_id: filters.institution || undefined,
      });

      const bundles = res?.data?.bundles || res?.data || [];

      const normalized = safeArray(bundles).map((b, idx) => {
        const period = formatPeriod(b?.date_range?.from, b?.date_range?.to);

        return {
          ...b,
          id: b?.bundle_id || String(idx + 1),
          sn: idx + 1,
          bundleName: b?.bundle_name || "-",
          generated: formatDateTime(b?.generated_at),
          by: b?.actor || "system", // backend doesn't provide "by" in sample; fallback
          forWhom: b?.generated_for || "-",
          period,
          institution: b?.institution_id || "-",
          regulations: safeArray(b?.regulation_ids).join(", ") || "-", // not present in sample -> "-"
          execution: safeArray(b?.contents?.executions).length || 0, // if exists later
          obligations: safeArray(b?.contents?.obligations).length || 0,
          size: b?.size || "-", // not provided by backend
          hash: b?.bundle_id || "-", // you can replace with real hash if backend gives it
          contentsRows: buildContentsRows(b),
        };
      });

      setAuditList(normalized);
    } catch (error) {
      console.log("error", error);
      setAuditList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditList();
  }, []);

  useEffect(() => {
    fetchAuditList();
  }, [filters.institution]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((p) => ({ ...p, [name]: value }));
  };

  const filteredRows = useMemo(() => {
    const s = filters.search.trim().toLowerCase();

    return safeArray(auditList).filter((r) => {
      const matchesSearch =
        !s ||
        String(r.bundleName || "")
          .toLowerCase()
          .includes(s) ||
        String(r.hash || "")
          .toLowerCase()
          .includes(s) ||
        String(r.execution || "").includes(s) ||
        String(r.obligations || "").includes(s) ||
        String(r.bundle_id || "")
          .toLowerCase()
          .includes(s);

      const matchesInstitution =
        !filters.institution || r.institution === filters.institution;

      // optional date filter using date_range.from/to (basic contains)
      const matchesFrom =
        !filters.from || (r?.date_range?.from || "") >= filters.from;
      const matchesTo = !filters.to || (r?.date_range?.to || "") <= filters.to;

      return matchesSearch && matchesInstitution && matchesFrom && matchesTo;
    });
  }, [auditList, filters]);

  const columns = [
    { key: "sn", label: "#SNo.", width: "70px" },
    { key: "bundleName", label: "Bundle Name", width: "200px" },
    { key: "generated", label: "Generated", width: "150px" },
    { key: "by", label: "By", width: "120px" },
    { key: "forWhom", label: "For", width: "140px" },
    { key: "period", label: "Period", width: "150px" },
    { key: "institution", label: "Institution", width: "120px" },
    { key: "regulations", label: "Regulations", width: "140px" },
    { key: "execution", label: "Execution", width: "100px" },
    { key: "obligations", label: "Obligations", width: "110px" },
    { key: "size", label: "Size", width: "100px" },
    { key: "hash", label: "Hash", width: "170px" },
    { key: "action", label: "Action", width: "260px" },
  ];

  const handleBundleSummary = async (e, item) => {
    e.stopPropagation();
    try {
      const res = await fetchSingleAuditSummaryApi(item?.bundle_id);
      setSelectedBundle(res.data);
      setBundleSummaryModal(true);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDownloadBundle = async (e, item) => {
    e.stopPropagation();

    const bundleId = item?.bundle_id;
    if (!bundleId) return;

    try {
      setDownloadingId(bundleId);

      const res = await downloadSingleAuditBundleApi(bundleId);

      // ✅ Use bundle name as fallback file name
      const safeName = (
        item?.bundleName ||
        item?.bundle_name ||
        "audit-bundle"
      ).replace(/[^\w\-]+/g, "_");

      downloadBlobResponse(res, `${safeName}.zip`);
    } catch (error) {
      console.log("download error", error);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <>
      <Card className="!p-0 border border-[#CFE9FF]">
        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[20px] font-bold text-[#242424]">Job History</p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <InputField
              labelTitle="Search"
              name="search"
              value={filters.search}
              handleChange={handleChange}
              placeholder="Search by bundle name / ID"
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

          <div className="mt-4 overflow-x-auto">
            <div className="inline-block min-w-full align-top">
              <div className="min-w-[1400px]">
                <TableAccordion
                  columns={columns}
                  rows={filteredRows}
                  defaultOpenId={filteredRows?.[0]?.bundle_id}
                  rowClassName="text-[12px] text-[#434343]"
                  renderRow={(row) => (
                    <>
                      <Cell className="px-3 py-3">{row.sn || "-"}</Cell>

                      <Cell className="px-3 py-3">
                        <span className="text-[14px] font-semibold text-[#00D1BC]">
                          {row.bundleName}
                        </span>
                        <div className="text-[11px] text-[#7E7E7E] mt-1">
                          {row.bundle_id}
                        </div>
                      </Cell>

                      <Cell className="px-3 py-3 whitespace-pre-line">
                        {String(row.generated || "-").replace(" ", "\n")}
                      </Cell>

                      <Cell className="px-3 py-3 whitespace-pre-line">
                        {String(row.by || "-").replace(" ", "\n")}
                      </Cell>

                      <Cell className="px-3 py-3 whitespace-pre-line">
                        {String(row.forWhom || "-").replace(" ", "\n")}
                      </Cell>

                      <Cell className="px-3 py-3 whitespace-pre-line">
                        {String(row.period || "-").replace(" to ", "\n")}
                      </Cell>

                      <Cell className="px-3 py-3">
                        {row.institution?.split("_")?.join(" ") || "-"}
                      </Cell>

                      <Cell className="px-3 py-3 whitespace-pre-line">
                        {String(row.regulations || "-").replace(", ", ",\n")}
                      </Cell>

                      <Cell className="px-3 py-3 text-center">
                        {row.execution ?? 0}
                      </Cell>

                      <Cell className="px-3 py-3 text-center">
                        {row.obligations ?? 0}
                      </Cell>

                      <Cell className="px-3 py-3">{row.size || "-"}</Cell>

                      <Cell className="px-3 py-3">{row.hash || "-"}</Cell>

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
                            text={
                              downloadingId === row.bundle_id
                                ? "Downloading..."
                                : "ZIP"
                            }
                            onClick={(e) => handleDownloadBundle(e, row)}
                            disabled={downloadingId === row.bundle_id}
                          />

                          <ActionPill
                            text="Summary"
                            onClick={(e) => handleBundleSummary(e, row)}
                          />

                          <ActionPill
                            text="Verify"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Verify bundle:", row);
                            }}
                          />
                        </div>
                      </Cell>
                    </>
                  )}
                  renderExpanded={(row) => <BundleContents row={row} />}
                  emptyState={
                    loading ? (
                      <div className="p-6 text-sm text-[#7E7E7E]">
                        Loading...
                      </div>
                    ) : (
                      <div className="p-6 text-sm text-[#7E7E7E]">
                        No bundles found.
                      </div>
                    )
                  }
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
        {(row.contentsRows || []).map((c) => (
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

function ActionPill({ text, icon, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`h-[28px] px-3 rounded-md border border-[#CFE9FF]
        bg-white text-[#00D1BC] text-[12px] font-medium flex items-center gap-2
        ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {icon ? <span className="text-[12px]">{icon}</span> : null}
      {text}
    </button>
  );
}
