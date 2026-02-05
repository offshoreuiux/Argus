import React from "react";
import Modal from "../../common/Modal";
import OutlinedButton from "../../common/OutlinedButton";
import PrimaryButton from "../../common/PrimaryButton";
import HourglassIcon from "../../../assets/images/svg/hourglass.svg";
import GreenCheckIcon from "../../../assets/images/svg/green-outline-check.svg";
import RedCrossIcon from "../../../assets/images/svg/red-outline-x.svg";
import OverallProgress from "../../common/OverallProgress";
import SolidCheckIcon from "../../../assets/images/svg/icons/SolidCheckIcon";

export default function ExecutionModal({
  isOpen,
  onClose,
  runId = "RUN-004",
  institution = "Bank A",
  elapsed = "0m 24s",
  startedAt = "30/01/2026, 18:16:39",
  progress = 20,
  stats = { total: 44, passed: 40, failed: 4 },
  onMinimize,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🚀 Live Execution Progress"
      description="Real-time compliance control execution monitoring"
      bodyClassName="!p-0"
    >
      {/* scrollable content area */}
      <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
        {/* top stat tiles */}
        <div className="flex gap-4">
          <StatTile label="RUN ID" value={runId} />
          <StatTile label="Institution" value={institution} />
          <StatTile label="Elapsed Time" value={elapsed} icon={<ClockIcon />} />
        </div>

        <div className="mt-4">
          <InfoRow label="Started" value={startedAt} />
        </div>

        <div className="mt-4">
          <ProgressBar percent={progress} />
        </div>

        <div className="mt-4 flex gap-4">
          <MiniTile label="RUN ID" value={stats.total} variant="success" />
          <MiniTile
            label="Institution"
            value={stats.passed}
            variant="success"
          />
          <MiniTile
            label="Elapsed Time"
            value={stats.failed}
            variant="danger"
          />
        </div>

        {/* Execution Steps (matches screenshot) */}
        <div className="mt-5">
          <p className="text-[16px] font-semibold text-[#242424]">
            Execution Steps
          </p>

          <div className="mt-3 flex flex-col gap-3">
            <ExecutionStepCard
              title="Verify encryption at rest"
              status="completed"
              duration="45s"
            />

            <ExecutionStepCard
              title="Check access control logs"
              status="in_progress"
              progress={65}
            />

            <ExecutionStepCard
              title="Validate data retention policy"
              status="completed"
              duration="38s"
            />

            <QueuedRow text="1 more controls queued..." />
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="px-6 py-4 border-t border-[#E2E8EF] flex items-center justify-between">
        <OutlinedButton onClick={onMinimize}>Minimize</OutlinedButton>
        <PrimaryButton disabled>Execution in progress...</PrimaryButton>
      </div>
    </Modal>
  );
}

/* -------------------- top tiles -------------------- */

function StatTile({ label, value, icon }) {
  return (
    <div className="flex-1 bg-[#EFF6FF] border border-[#CBDDF4] rounded-lg p-4">
      <p className="text-[14px] text-[#7E7E7E]">{label}</p>
      <div className="flex items-center gap-2 mt-1">
        {icon ? <span className="text-[#7E7E7E]">{icon}</span> : null}
        <p className="text-[16px] font-semibold text-[#0F192E]">{value}</p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="bg-[#EFF6FF] border border-[#CBDDF4] rounded-lg p-4">
      <p className="text-[14px] text-[#7E7E7E]">{label}</p>
      <p className="text-[16px] font-semibold text-[#0F192E] mt-1">{value}</p>
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

/* -------------------- Execution Steps -------------------- */

function ExecutionStepCard({ title, status, duration, progress = 0 }) {
  const isCompleted = status === "completed";
  const isInProgress = status === "in_progress";

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
              Completed • Duration: {duration}
            </p>
          ) : isInProgress ? (
            <p className="text-[12px] text-[#7E7E7E] mt-1">
              In progress: {safeProgress}% complete
            </p>
          ) : null}
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

/* -------------------- Icons -------------------- */

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 6v6l4 2"
        stroke="currentColor"
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
