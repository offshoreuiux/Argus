import React, { useMemo } from "react";
import Modal from "../../common/Modal";
import OutlinedButton from "../../common/OutlinedButton";
import OverallProgress from "../../common/OverallProgress";
import SolidCheckIcon from "../../../assets/images/svg/icons/SolidCheckIcon";
import RefreshIcon from "../../../assets/images/svg/icons/RefreshIcon";
import InfoIcon from "../../../assets/images/svg/icons/InfoIcon";

export default function BundleGenerationModal({
  isOpen,
  onClose,
  bundleName = "Q4 2024 Compliance Audit Bundle",
  progress = 20, // 0-100
  currentStepLabel = "2 of 8",
  statusLabel = "Collecting Data",
  elapsed = "0m 24s",
  remaining = "~5s",
  steps = [
    {
      id: 1,
      title: "Initializing",
      subtitle: "Preparing bundle generation...",
      state: "done",
    },
    {
      id: 2,
      title: "Collecting Data",
      subtitle: "Gathering execution data...",
      state: "active",
    },
    {
      id: 3,
      title: "Processing Results",
      subtitle: "Processing control results...",
      state: "todo",
    },
    {
      id: 4,
      title: "Compiling Records",
      subtitle: "Compiling exception records...",
      state: "todo",
    },
    {
      id: 5,
      title: "Audit Trails",
      subtitle: "Generating audit trail...",
      state: "todo",
    },
    {
      id: 6,
      title: "Report",
      subtitle: "Creating summary report...",
      state: "todo",
    },
    {
      id: 7,
      title: "Verification",
      subtitle: "Verifying bundle integrity...",
      state: "todo",
    },
    {
      id: 8,
      title: "Finalizing",
      subtitle: "Finalizing bundle...",
      state: "todo",
    },
  ],
}) {
  const safe = Math.max(0, Math.min(100, Number(progress) || 0));

  const computed = useMemo(() => {
    const active = steps.find((s) => s.state === "active");
    const doneCount = steps.filter((s) => s.state === "done").length;
    return {
      doneCount,
      total: steps.length,
      activeTitle: active?.title,
    };
  }, [steps]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bundle Generation"
      description={bundleName}
      bodyClassName="!p-0"
      widthClass="w-[560px]"
    >
      <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
        {/* Overall Progress */}
        <OverallProgress value={safe} />

        {/* Top tiles */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <InfoTile label="Current Step" value={currentStepLabel} />
          <InfoTile label="Status" value={statusLabel} />

          <InfoTile label="Elapsed Time" value={elapsed} icon={<ClockIcon />} />
          <InfoTile
            label="Est. Remaining"
            value={remaining}
            icon={<HourglassIcon />}
          />
        </div>

        {/* Processing Steps */}
        <div className="mt-4">
          <p className="text-[16px] font-semibold text-[#434343]">
            Processing Steps
          </p>

          <div className="mt-3 flex flex-col gap-3">
            {steps.map((s) => (
              <StepRow
                key={s.id}
                index={s.id}
                title={s.title}
                subtitle={s.subtitle}
                state={s.state}
              />
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="mt-4 bg-[#FEFCE8] border border-[#EDDF54] rounded-lg p-3 flex items-start gap-2">
          <InfoIcon />
          <p className="text-[14px] font-semibold text-[#854D0E] leading-5">
            Please do not close this dialog while generation is in progress
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#E2E8EF] flex items-center justify-end">
        <OutlinedButton
          onClick={onClose}
          className="text-[#E43232]! border-[#E43232]! hover:bg-[#FFF1F1]! bg-[#FFEBEB]"
        >
          Cancel Generation
        </OutlinedButton>
      </div>
    </Modal>
  );
}

/* ---------------- Small UI parts ---------------- */

function InfoTile({ label, value, icon }) {
  return (
    <div className="bg-[#EFF6FF] border border-[#CBDDF4] rounded-lg p-4">
      <p className="text-[14px] font-medium text-[#7E7E7E]">{label}</p>

      <div className="flex items-center gap-2 mt-1">
        {icon ? <span className="text-[#7E7E7E]">{icon}</span> : null}
        <p className="text-[16px] font-semibold text-[#0F192E]">{value}</p>
      </div>
    </div>
  );
}

function StepRow({ index, title, subtitle, state }) {
  const isDone = state === "done";
  const isActive = state === "active";

  const wrapperClass = isDone
    ? "bg-[#EBFFEB] border-[#A9EBA9]"
    : isActive
      ? "bg-[#EFF6FF] border-[#CBDDF4]"
      : "bg-[#F3F3F3] border-[#F3F3F3] opacity-70";

  return (
    <div className={`border rounded-lg px-4 py-3 ${wrapperClass}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <StepBadge index={index} state={state} />

          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-[#0F192E] truncate">
              {title}
            </p>
            <p className="text-[12px] font-medium text-[#7E7E7E] mt-0.5 truncate">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="shrink-0 mt-0.5">
          {isDone ? <SolidCheckIcon /> : isActive ? <RefreshIcon /> : null}
        </div>
      </div>
    </div>
  );
}

function StepBadge({ index, state }) {
  const isDone = state === "done";
  const isActive = state === "active";

  const cls = isDone
    ? "bg-[#10B981] text-white"
    : isActive
      ? "bg-[#9DB3DF] text-white"
      : "bg-[#D1D5DB] text-white";

  return (
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-semibold ${cls}`}
    >
      {index}
    </div>
  );
}

/* ---------------- Icons ---------------- */

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

function HourglassIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 2h12M6 22h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 2v6l4 4 4-4V2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8 22v-6l4-4 4 4v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 12a9 9 0 1 1-2.64-6.36"
        stroke="#3B82F6"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningSmallIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 9v4"
        stroke="#7A4B00"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 17h.01"
        stroke="#7A4B00"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M10.3 4.5 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.5a2 2 0 0 0-3.4 0Z"
        stroke="#7A4B00"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
