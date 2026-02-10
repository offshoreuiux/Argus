import React, { useEffect, useMemo, useState, useCallback } from "react";
import Card from "../common/Card";
import SelectField from "../common/SelectField";
import Table from "../common/Table";
import StatusBadge from "../common/StatusBadge";
import EyeIcon from "../../assets/images/svg/eye.svg";
import DownloadIcon from "../../assets/images/svg/download.svg";
import AuditIcon from "../../assets/images/svg/audit.svg";
import RefreshIcon from "../../assets/images/svg/grey-rotate.svg";
import {
  fetchExecutionListApi,
  fetchSingleExecutionApi,
  fetchSingleExecutionResultsApi, // ✅ add
} from "../../../connections/apis/execution/execution";
import { useExecutionContext } from "../../contexts/ExecutionContext";
import {
  buildCsv,
  buildDateRangeParams,
  downloadFile,
  formatDuration,
  formatTimeHHMMSS,
} from "../../../helper";

const dateRangeArr = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "last_7_days" },
  { label: "Last 30 Days", value: "last_30_days" },
];

const statusesArr = [
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
  { label: "Running", value: "running" },
];

function JobHistory() {
  const [filters, setFilters] = useState({
    dateRange: "",
    institution: "",
    status: "",
  });

  const {
    executionList,
    setExecutionList,
    setExecutionProgressModal,
    setExecutionDocument,
  } = useExecutionContext();

  const [loading, setLoading] = useState(false);
  const [downloadingRunId, setDownloadingRunId] = useState(null);

  const apiParams = useMemo(() => {
    const { from_date, to_date } = buildDateRangeParams(filters.dateRange);

    return {
      institution_id: filters.institution || undefined,
      status: filters.status || undefined,
      from_date,
      to_date,
      page: 1,
      limit: 20,
    };
  }, [filters.dateRange, filters.institution, filters.status]);

  const institutionOptions = useMemo(() => {
    if (!executionList || executionList.length === 0) return [];

    const unique = [
      ...new Set(executionList.map((e) => e.institution_id).filter(Boolean)),
    ];

    return unique.map((id) => ({
      label: id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      value: id,
    }));
  }, [executionList]);

  const fetchExecutionList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchExecutionListApi(apiParams);
      setExecutionList(res?.data?.executions || []);
    } catch (error) {
      console.log("error", error);
      setExecutionList([]);
    } finally {
      setLoading(false);
    }
  }, [apiParams, setExecutionList]);

  useEffect(() => {
    fetchExecutionList();
  }, [fetchExecutionList]);

  const ActionIconBtn = ({ children, onClick, disabled, title }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-8 h-8 rounded-md border border-[#C9FBF4] bg-[#EDFFFD] flex items-center justify-center cursor-pointer hover:opacity-90 transition
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRefresh = () => fetchExecutionList();

  const handleExport = () => {
    if (!executionList || executionList.length === 0) return;

    const headers = [
      "run_id",
      "institution_id",
      "execution_date",
      "started_at",
      "duration",
      "status",
      "executed",
      "passed",
      "failed",
      "errors",
      "priority",
      "regulations",
    ];

    const rows = executionList.map((r) => ({
      run_id: r.run_id || "-",
      institution_id: r.institution_id || "-",
      execution_date: r.execution_date || "-",
      started_at: formatTimeHHMMSS(r.started_at) || "-",
      duration: formatDuration(r.duration_seconds) ?? "-",
      status: r.status || "-",
      executed: r.executed ?? "-",
      passed: r.passed ?? "-",
      failed: r.failed ?? "-",
      errors: r.errors ?? "-",
      priority: r.priority || "-",
      regulations: r.regulations || "-",
    }));

    const csv = buildCsv(rows, headers);
    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    downloadFile(csv, `job-history-${ts}.csv`);
  };

  const handleOpenProgressModal = async (item) => {
    try {
      const res = await fetchSingleExecutionApi(item?.run_id);
      setExecutionDocument(res.data);
      setExecutionProgressModal(true);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDownload = async (item) => {
    const runId = item?.run_id;
    if (!runId) return;

    try {
      setDownloadingRunId(runId);

      // get results
      const res = await fetchSingleExecutionResultsApi(runId);
      const data = res?.data;

      const summary = data?.execution_summary || {};
      const controlResults = Array.isArray(data?.control_results)
        ? data.control_results
        : [];

      const headers = [
        "run_id",
        "institution_id",
        "execution_date",
        "overall_status",
        "total_controls",
        "passed",
        "failed",
        "errors",
        "obligation_id",
        "control_status",
        "error_message",
      ];

      const rows =
        controlResults.length > 0
          ? controlResults.map((cr) => ({
              run_id: data?.run_id || runId,
              institution_id:
                summary?.institution_id || item?.institution_id || "-",
              execution_date:
                summary?.execution_date || item?.execution_date || "-",
              overall_status: summary?.overall_status || "-",
              total_controls: summary?.total_controls ?? "-",
              passed: summary?.passed ?? "-",
              failed: summary?.failed ?? "-",
              errors: summary?.errors ?? "-",
              obligation_id: cr?.obligation_id || "-",
              control_status: cr?.status || "-",
              error_message: cr?.error_message || "-",
            }))
          : [
              {
                run_id: data?.run_id || runId,
                institution_id:
                  summary?.institution_id || item?.institution_id || "-",
                execution_date:
                  summary?.execution_date || item?.execution_date || "-",
                overall_status: summary?.overall_status || "-",
                total_controls: summary?.total_controls ?? "-",
                passed: summary?.passed ?? "-",
                failed: summary?.failed ?? "-",
                errors: summary?.errors ?? "-",
                obligation_id: "-",
                control_status: "-",
                error_message: "-",
              },
            ];

      const csv = buildCsv(rows, headers);

      const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      const filename = `execution-${runId}-${ts}.csv`;

      downloadFile(csv, filename);
    } catch (e) {
      console.log("download error", e);
      alert(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to download execution results",
      );
    } finally {
      setDownloadingRunId(null);
    }
  };

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[20px] font-bold text-[#242424]">Job History</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            className="h-8.5 px-4 rounded-lg border border-[#E2E8EF] bg-white
                       text-[16px] text-[#7E7E7E] flex items-center cursor-pointer gap-2
                       hover:bg-[#F8FAFC] active:scale-[0.99]"
          >
            <img src={RefreshIcon} alt="" />
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={loading || !executionList?.length}
            className="h-8.5 px-4 rounded-lg border border-[#B7F1E8] bg-[#E9FFFB]
                       text-[16px] font-semibold text-[#00D1BC] flex items-center cursor-pointer gap-2
                       hover:brightness-[0.99] active:scale-[0.99]
                       disabled:opacity-60 disabled:cursor-not-allowed"
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
          options={institutionOptions}
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
            {(executionList || []).map((r, idx) => (
              <tr
                key={r.run_id || idx}
                className={`${
                  idx % 2 === 1 ? "bg-[#F1FFFD]" : "bg-white"
                } border-b border-[#E2E8EF]`}
              >
                <td className="px-4 py-4 text-[12px] text-[#00BDA8] font-semibold whitespace-nowrap">
                  {r.run_id || "-"}
                </td>
                <td className="px-4 py-4 text-[12px] text-[#374151] whitespace-nowrap">
                  {r.institution_id || "-"}
                </td>
                <td className="px-4 py-4 text-[12px] text-[#6B7280] whitespace-nowrap">
                  {r.execution_date || "-"}
                </td>
                <td className="px-4 py-4 text-[12px] text-[#6B7280] whitespace-nowrap">
                  {formatTimeHHMMSS(r.started_at) || "-"}
                </td>
                <td className="px-4 py-4 text-[12px] text-[#6B7280] whitespace-nowrap">
                  {formatDuration(r.duration_seconds) ?? "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-4 text-[12px] text-[#374151] whitespace-nowrap">
                  {r.executed ?? "-"}
                </td>
                <td className="px-4 py-4 text-[12px] text-[#16A34A] font-semibold whitespace-nowrap">
                  {r.passed ?? "-"}
                </td>
                <td className="px-4 py-4 text-[12px] text-[#EF4444] font-semibold whitespace-nowrap">
                  {r.failed ?? "-"}
                </td>
                <td className="px-4 py-4 text-[12px] text-[#374151] whitespace-nowrap">
                  {r.errors ?? "-"}
                </td>
                <td
                  className={`px-4 py-4 text-[12px] font-semibold whitespace-nowrap ${
                    String(r.priority || "").toLowerCase() === "critical"
                      ? "text-[#EF4444]"
                      : "text-[#F59E0B]"
                  }`}
                >
                  {r.priority || "-"}
                </td>
                <td className="px-4 py-4 text-[12px] text-[#6B7280] whitespace-nowrap">
                  {r.regulations || "-"}
                </td>
                <td className="px-4 py-4 text-[12px] text-[#6B7280] whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <ActionIconBtn
                      title="View"
                      onClick={() => handleOpenProgressModal(r)}
                    >
                      <img src={EyeIcon} alt="" />
                    </ActionIconBtn>

                    <ActionIconBtn
                      title="Download results"
                      onClick={() => handleDownload(r)}
                      disabled={
                        downloadingRunId === r.run_id ||
                        String(r.status || "").toLowerCase() !== "completed"
                      }
                    >
                      <img src={DownloadIcon} alt="" />
                    </ActionIconBtn>

                    <ActionIconBtn
                      title="Audit"
                      onClick={() => console.log("audit", r)}
                    >
                      <img src={AuditIcon} alt="" />
                    </ActionIconBtn>
                  </div>

                  {downloadingRunId === r.run_id ? (
                    <p className="mt-1 text-[11px] text-[#6B7280] text-center">
                      Downloading...
                    </p>
                  ) : null}
                </td>
              </tr>
            ))}

            {!loading && (!executionList || executionList.length === 0) ? (
              <tr>
                <td
                  colSpan={13}
                  className="px-4 py-8 text-center text-sm text-[#6B7280]"
                >
                  No executions found for selected filters.
                </td>
              </tr>
            ) : null}
          </Table>
        </div>
      </div>
    </Card>
  );
}

export default JobHistory;
