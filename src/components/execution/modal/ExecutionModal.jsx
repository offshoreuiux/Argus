import React, { useEffect, useMemo, useRef, useState } from "react";
import Modal from "../../common/Modal";
import OutlinedButton from "../../common/OutlinedButton";
import PrimaryButton from "../../common/PrimaryButton";
import HourglassIcon from "../../../assets/images/svg/hourglass.svg";
import GreenCheckIcon from "../../../assets/images/svg/green-outline-check.svg";
import RedCrossIcon from "../../../assets/images/svg/red-outline-x.svg";
import OverallProgress from "../../common/OverallProgress";
import SolidCheckIcon from "../../../assets/images/svg/icons/SolidCheckIcon";
import { useExecutionContext } from "../../../contexts/ExecutionContext";
import {
  fetchSingleExecutionProgressApi,
  fetchSingleExecutionResultsApi,
} from "../../../../connections/apis/execution/execution";
import { formatDuration, formatTimeHHMMSS } from "../../../../helper";

export default function ExecutionModal({ isOpen, onClose, onMinimize }) {
  const { executionDocument } = useExecutionContext();
  const runId = executionDocument?.run_id;

  const [progressDoc, setProgressDoc] = useState(null); // progress api
  const [resultsDoc, setResultsDoc] = useState(null); // results api

  const [loadingProgress, setLoadingProgress] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState("");

  const pollRef = useRef(null);
  const fetchedResultsRef = useRef(false);

  // Reset on open / run change
  useEffect(() => {
    if (!isOpen) return;
    setProgressDoc(null);
    setResultsDoc(null);
    setError("");
    fetchedResultsRef.current = false;
  }, [isOpen, runId]);

  // Poll progress; fetch results once status is completed/failed/error
  useEffect(() => {
    if (!isOpen || !runId) return;

    let stopped = false;

    const stopPolling = () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };

    const fetchProgress = async () => {
      try {
        setLoadingProgress(true);
        const res = await fetchSingleExecutionProgressApi(runId);
        if (stopped) return;

        const data = res?.data;
        setProgressDoc(data);

        const status = (data?.status || "").toLowerCase();
        const isDone =
          status === "completed" || status === "failed" || status === "error";

        if (isDone && !fetchedResultsRef.current) {
          fetchedResultsRef.current = true;
          stopPolling();

          try {
            setLoadingResults(true);
            const r = await fetchSingleExecutionResultsApi(runId);
            if (!stopped) setResultsDoc(r?.data);
          } catch (e) {
            if (!stopped) {
              setError(
                e?.response?.data?.message ||
                  e?.message ||
                  "Failed to fetch execution results",
              );
            }
          } finally {
            if (!stopped) setLoadingResults(false);
          }
        }
      } catch (e) {
        if (!stopped) {
          setError(
            e?.response?.data?.message ||
              e?.message ||
              "Failed to fetch execution progress",
          );
        }
      } finally {
        if (!stopped) setLoadingProgress(false);
      }
    };

    fetchProgress();
    pollRef.current = setInterval(fetchProgress, 2000);

    return () => {
      stopped = true;
      stopPolling();
    };
  }, [isOpen, runId]);

  // ---------------------- Mapping based on your exact API shapes ----------------------

  // Progress API shape:
  // { status, progress_percentage, completed_controls, total_controls }
  const progressPercent = useMemo(() => {
    const p = progressDoc?.progress_percentage ?? 0;
    return Math.max(0, Math.min(100, Number(p) || 0));
  }, [progressDoc]);

  const progressStatus = (progressDoc?.status || "").toLowerCase();
  const isDone =
    progressStatus === "completed" ||
    progressStatus === "failed" ||
    progressStatus === "error";

  const completedControls = progressDoc?.completed_controls ?? 0;
  const totalControlsFromProgress = progressDoc?.total_controls ?? 0;

  // Results API shape:
  // { execution_summary: { total_controls, passed, failed, errors, overall_status }, control_results: [...] }
  const summary = resultsDoc?.execution_summary || null;

  const stats = useMemo(() => {
    const total = summary?.total_controls ?? totalControlsFromProgress ?? 0;
    const passed = summary?.passed ?? 0;
    const failed = summary?.failed ?? 0;
    const errors = summary?.errors ?? 0;
    return { total, passed, failed, errors };
  }, [summary, totalControlsFromProgress]);

  // Use control_results as “Execution Steps” once results are available
  const steps = useMemo(() => {
    const arr = resultsDoc?.control_results ?? [];
    return Array.isArray(arr) ? arr : [];
  }, [resultsDoc]);

  // For the “queued” row while running
  const queuedCount = useMemo(() => {
    const total = Number(totalControlsFromProgress || 0);
    const done = Number(completedControls || 0);
    return Math.max(0, total - done);
  }, [totalControlsFromProgress, completedControls]);

  // Guard: avoid crashes when context doc not ready yet
  const safeDoc = executionDocument || {};

  // footer CTA label
  const footerText = useMemo(() => {
    if (!isDone)
      return loadingProgress ? "Updating..." : "Execution in progress...";
    if (loadingResults) return "Fetching results...";
    // If results exist, show overall_status (compliant / non_compliant / etc.)
    if (summary?.overall_status) return `Execution ${summary.overall_status}`;
    return "Execution completed";
  }, [isDone, loadingProgress, loadingResults, summary]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🚀 Live Execution Progress"
      description="Real-time compliance control execution monitoring"
      bodyClassName="!p-0"
    >
      <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
        {error ? (
          <div className="mb-4 border border-[#F9BEBE] bg-[#FFEBEB] rounded-lg p-3">
            <p className="text-[13px] text-[#B42318]">{error}</p>
          </div>
        ) : null}

        {/* top stat tiles */}
        <div className="flex gap-4">
          <StatTile label="RUN ID" value={safeDoc.run_id || "-"} />
          <StatTile label="Institution" value={safeDoc.institution_id || "-"} />
          <StatTile
            label="Elapsed Time"
            value={
              safeDoc.duration_seconds != null
                ? formatDuration(safeDoc.duration_seconds)
                : "-"
            }
            icon={<ClockIcon />}
          />
        </div>

        <div className="mt-4">
          <InfoRow
            label="Started"
            value={
              safeDoc.execution_date && safeDoc.started_at
                ? `${safeDoc.execution_date} ${formatTimeHHMMSS(safeDoc.started_at)}`
                : "-"
            }
          />
        </div>

        <div className="mt-4">
          <ProgressBar percent={progressPercent} />
          <div className="mt-2 text-[12px] text-[#7E7E7E]">
            {loadingProgress ? "Updating progress..." : null}
            {!loadingProgress && !isDone ? "Live monitoring..." : null}
            {isDone && loadingResults ? "Fetching results..." : null}
            {isDone && resultsDoc ? "Results ready." : null}
          </div>
        </div>

        {/* mini tiles (based on your results api) */}
        <div className="mt-4 flex gap-4">
          <MiniTile
            label="Total Controls"
            value={stats.total}
            variant="success"
          />
          <MiniTile label="Passed" value={stats.passed} variant="success" />
          <MiniTile label="Failed" value={stats.failed} variant="danger" />
          <MiniTile label="Errors" value={stats.errors} variant="danger" />
        </div>

        {/* Execution Steps */}
        <div className="mt-5">
          <p className="text-[16px] font-semibold text-[#242424]">
            Execution Steps
          </p>

          <div className="mt-3 flex flex-col gap-3">
            {/* While running: show progress-based pseudo step */}
            {!resultsDoc ? (
              <>
                <ExecutionStepCard
                  title="Running controls..."
                  status="in_progress"
                  progress={progressPercent}
                />
                {queuedCount > 0 ? (
                  <QueuedRow text={`${queuedCount} more controls queued...`} />
                ) : (
                  <QueuedRow text="Finalizing..." />
                )}
              </>
            ) : steps.length ? (
              // When done: show real control_results
              steps.map((item, idx) => (
                <ExecutionResultCard
                  key={`${item?.obligation_id || "control"}-${idx}`}
                  obligationId={item?.obligation_id}
                  status={item?.status}
                  errorMessage={item?.error_message}
                />
              ))
            ) : (
              <QueuedRow text="No control results available." />
            )}
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="px-6 py-4 border-t border-[#E2E8EF] flex items-center justify-between">
        <OutlinedButton onClick={onMinimize}>Minimize</OutlinedButton>

        <PrimaryButton disabled={!isDone}>{footerText}</PrimaryButton>
      </div>
    </Modal>
  );
}

/* -------------------- UI Components -------------------- */

function StatTile({ label, value, icon }) {
  return (
    <div className="flex-1 max-w-[169px] bg-[#EFF6FF] border border-[#CBDDF4] rounded-lg p-4">
      <p className="text-[14px] text-[#7E7E7E]">{label}</p>
      <div className="flex items-center gap-2 mt-1">
        {icon ? <span className="text-[#7E7E7E]">{icon}</span> : null}
        <p className="text-[16px] font-semibold text-[#0F192E] truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="bg-[#EFF6FF] border border-[#CBDDF4] rounded-lg p-4">
      <p className="text-[14px] text-[#7E7E7E]">{label}</p>
      <p className="text-[16px] font-semibold text-[#0F192E] mt-1 truncate">
        {value}
      </p>
    </div>
  );
}

function ProgressBar({ percent = 0 }) {
  const safe = Math.max(0, Math.min(100, Number(percent) || 0));
  return <OverallProgress value={safe} />;
}

function MiniTile({ label, value, variant = "success" }) {
  const styles =
    variant === "success"
      ? "bg-[#EBFFEB] border-[#A9EBA9]"
      : variant === "danger"
        ? "bg-[#FFEBEB] border-[#F9BEBE]"
        : "bg-[#F7FBFF] border-[#D7E6F7]";

  const icon =
    variant === "success" ? (
      <img src={GreenCheckIcon} alt="" />
    ) : variant === "danger" ? (
      <img src={RedCrossIcon} alt="" />
    ) : null;

  return (
    <div className={`flex-1 border rounded-lg p-4 ${styles}`}>
      <div className="flex items-center justify-center gap-2">
        {icon}
        <p className="text-[18px] font-semibold text-[#242424]">{value}</p>
      </div>
      <p className="text-[14px] text-[#7E7E7E] text-center mt-1">{label}</p>
    </div>
  );
}

/* -------------------- Running Step -------------------- */

function ExecutionStepCard({ title, status, duration, progress = 0 }) {
  const isCompleted = status === "completed";
  const isInProgress = status === "in_progress" || status === "running";

  const safeProgress = Math.max(0, Math.min(100, Number(progress) || 0));

  return (
    <div
      className={[
        "border rounded-lg p-4",
        isCompleted
          ? "bg-[#EBFFEB] border-[#A9EBA9]"
          : isInProgress
            ? "bg-[#EFF6FF] border-[#CBDDF4]"
            : "bg-white border-[#E2E8EF]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-[#0F192E] truncate">
            {title}
          </p>

          {isCompleted ? (
            <p className="text-[12px] text-[#7E7E7E] mt-1">
              Completed{duration ? ` • Duration: ${duration}` : ""}
            </p>
          ) : isInProgress ? (
            <p className="text-[12px] text-[#7E7E7E] mt-1">
              In progress: {safeProgress}% complete
            </p>
          ) : (
            <p className="text-[12px] text-[#7E7E7E] mt-1">Queued</p>
          )}
        </div>

        <div className="shrink-0">
          {isCompleted ? (
            <SolidCheckIcon />
          ) : isInProgress ? (
            <img src={HourglassIcon} alt="" />
          ) : null}
        </div>
      </div>

      {isInProgress ? (
        <div className="mt-3 h-[8px] bg-[#DCE5EE] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00D1BC] rounded-full"
            style={{ width: `${safeProgress}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}

/* -------------------- Done Results as "Steps" -------------------- */

function ExecutionResultCard({ obligationId, status, errorMessage }) {
  const normalized = String(status || "").toLowerCase();

  const isPass =
    normalized === "passed" ||
    normalized === "pass" ||
    normalized === "success";
  const isFail =
    normalized === "failed" ||
    normalized === "fail" ||
    normalized === "non_compliant";
  const isError = normalized === "error";

  const uiStatus = isPass
    ? "completed"
    : isFail || isError
      ? "failed"
      : "in_progress";

  const cardStyle = isPass
    ? "bg-[#EBFFEB] border-[#A9EBA9]"
    : isFail || isError
      ? "bg-[#FFEBEB] border-[#F9BEBE]"
      : "bg-[#EFF6FF] border-[#CBDDF4]";

  const rightIcon = isPass ? (
    <SolidCheckIcon />
  ) : isFail || isError ? (
    <img src={RedCrossIcon} alt="" />
  ) : (
    <img src={HourglassIcon} alt="" />
  );

  return (
    <div className={["border rounded-lg p-4", cardStyle].join(" ")}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-[#0F192E] truncate">
            {obligationId || "Unknown control"}
          </p>

          <p className="text-[12px] text-[#7E7E7E] mt-1">
            Status: {normalized || uiStatus}
          </p>

          {errorMessage ? (
            <p className="text-[12px] text-[#B42318] mt-2 break-words">
              {errorMessage}
            </p>
          ) : null}
        </div>

        <div className="shrink-0">{rightIcon}</div>
      </div>
    </div>
  );
}

function QueuedRow({ text }) {
  return (
    <div className="border border-[#E2E8EF] rounded-lg p-3 bg-white">
      <p className="text-[13px] text-[#7E7E7E] flex items-center gap-2">
        <span className="w-4 h-4 flex items-center justify-center">
          <ClockSmallIcon />
        </span>
        {text}
      </p>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
        stroke="#0F192E"
        strokeWidth="2"
      />
      <path
        d="M12 6v6l4 2"
        stroke="#0F192E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockSmallIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
        stroke="#7E7E7E"
        strokeWidth="2"
      />
      <path
        d="M12 7v5l3 2"
        stroke="#7E7E7E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
