import React, { useMemo, useState } from "react";
import Modal from "../../common/Modal";
import InputField from "../../common/InputField";
import SelectField from "../../common/SelectField";
import OutlinedButton from "../../common/OutlinedButton";
import PrimaryButton from "../../common/PrimaryButton";
import TextareaField from "../../common/TextareaField";

// ✅ use global components
import RadioInput from "../../common/RadioInput";
import CheckboxInput from "../../common/CheckboxInput";

export default function ExceptionManagementModal({
  isOpen,
  onClose,
  obligationId = "OBL-002",
  detectedTimestamp = "20-01-2024 10:32",
  defaultViolationSummary = "Encryption level below required threshold",
  onSubmit,
}) {
  const [form, setForm] = useState({
    violationSummary: defaultViolationSummary,
    issueDescription: "",
    gapAnalysis: "",
    action: "",
    justification: "",
    remediationDeadline: "",
    responsibleParty: "",
    approvals: {
      manager: false,
      cfo: false,
      compliance: false,
    },
  });

  const responsibleOptions = useMemo(
    () => [
      { label: "Select responsible party", value: "" },
      { label: "Security Team", value: "security" },
      { label: "Compliance Team", value: "compliance" },
      { label: "IT Operations", value: "it_ops" },
      { label: "Data Governance", value: "data_gov" },
    ],
    [],
  );

  const update = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const setAction = (val) => setForm((p) => ({ ...p, action: val }));

  const toggleApproval = (key) => {
    setForm((p) => ({
      ...p,
      approvals: { ...p.approvals, [key]: !p.approvals[key] },
    }));
  };

  const handleSubmit = () => {
    onSubmit?.(form);
    onClose?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Exception Management"
      bodyClassName="!p-0"
      widthClass="w-[520px]"
    >
      <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
        <div className="grid grid-cols-2 gap-6">
          <InfoPair label="Obligation ID" value={obligationId} />
          <InfoPair label="Detected Timestamp" value={detectedTimestamp} />
        </div>

        <div className="mt-5">
          <InputField
            name="violationSummary"
            labelTitle="Violation Summary"
            value={form.violationSummary}
            handleChange={update}
            placeholder="Violation summary"
          />
        </div>

        <div className="mt-4">
          <TextareaField
            name="issueDescription"
            labelTitle="Issue Description"
            value={form.issueDescription}
            handleChange={update}
            placeholder="Describe the issue in detail..."
          />
        </div>

        <div className="mt-4">
          <TextareaField
            name="gapAnalysis"
            labelTitle="Gap Analysis"
            value={form.gapAnalysis}
            handleChange={update}
            placeholder="Analyze the gap between actual and required state..."
          />
        </div>

        {/* ✅ Exception Action using GLOBAL RadioInput */}
        <div className="mt-5">
          <p className="text-sm font-medium text-[#242424]">
            Exception Action<span className="text-red-500 ml-1">*</span>
          </p>

          <div className="mt-3 flex flex-col gap-3">
            <RadioInput
              label="Accept"
              name="exceptionAction"
              value="accept"
              checked={form.action === "accept"}
              onChange={() => setAction("accept")}
            />
            <RadioInput
              label="Request Remediation"
              name="exceptionAction"
              value="remediation"
              checked={form.action === "remediation"}
              onChange={() => setAction("remediation")}
            />
            <RadioInput
              label="Escalate"
              name="exceptionAction"
              value="escalate"
              checked={form.action === "escalate"}
              onChange={() => setAction("escalate")}
            />
          </div>
        </div>

        <div className="mt-5">
          <TextareaField
            required
            name="justification"
            labelTitle="Justification"
            value={form.justification}
            handleChange={update}
            placeholder="Provide justification for the exception action..."
          />
        </div>

        <div className="mt-5">
          <InputField
            name="remediationDeadline"
            labelTitle="Remediation Deadline"
            type="date"
            value={form.remediationDeadline}
            handleChange={update}
          />
        </div>

        <div className="mt-4">
          <SelectField
            value={form.responsibleParty}
            labelTitle="Responsible Party"
            handleChange={(e) =>
              setForm((p) => ({ ...p, responsibleParty: e.target.value }))
            }
            options={responsibleOptions}
            placeholder="Select responsible party"
          />
        </div>

        {/* ✅ Approval Required using GLOBAL CheckboxInput */}
        <div className="mt-5">
          <p className="text-[12px] font-semibold text-[#242424]">
            Approval Required
          </p>

          <div className="mt-3 flex flex-col gap-3">
            <CheckboxInput
              label="Manager Approval"
              checked={form.approvals.manager}
              onChange={() => toggleApproval("manager")}
            />
            <CheckboxInput
              label="CFO Approval"
              checked={form.approvals.cfo}
              onChange={() => toggleApproval("cfo")}
            />
            <CheckboxInput
              label="Compliance Approval"
              checked={form.approvals.compliance}
              onChange={() => toggleApproval("compliance")}
            />
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-[#E2E8EF] flex items-center justify-end gap-3">
        <OutlinedButton onClick={onClose} className="min-w-[100px]">
          Cancel
        </OutlinedButton>
        <PrimaryButton onClick={handleSubmit} className="min-w-[140px]">
          Submit Decision
        </PrimaryButton>
      </div>
    </Modal>
  );
}

function InfoPair({ label, value }) {
  return (
    <div>
      <p className="text-[14px] font-medium text-[#7E7E7E]">{label}</p>
      <p className="text-[16px] font-semibold text-[#434343] mt-1">{value}</p>
    </div>
  );
}
