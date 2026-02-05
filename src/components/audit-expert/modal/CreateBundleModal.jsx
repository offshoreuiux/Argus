import React, { useMemo, useState } from "react";
import Modal from "../../common/Modal";
import InputField from "../../common/InputField";
import SelectField from "../../common/SelectField";
import OutlinedButton from "../../common/OutlinedButton";
import PrimaryButton from "../../common/PrimaryButton";
import CheckboxInput from "../../common/CheckboxInput";
import RadioInput from "../../common/RadioInput";
import TextareaField from "../../common/TextareaField";

export default function CreateBundleModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    bundleName: "",
    institution: "Bank A",
    generatedFor: "",
    dateFrom: "",
    dateTo: "",

    regulations: {
      gdpr: false,
      pci: false,
      hipaa: false,
      soc2: false,
    },

    include: {
      executionSummary: false,
      controlResultsEvidence: false,
      exceptionsRemediation: false,
      complianceStatistics: false,
      traceabilityMatrix: false,
    },

    exportFormat: "", // "pdf" | "excel" | "zip"
    notes: "",
  });

  const institutionOptions = useMemo(
    () => [
      { label: "Bank A", value: "Bank A" },
      { label: "Bank B", value: "Bank B" },
      { label: "Bank C", value: "Bank C" },
    ],
    [],
  );

  const generatedForOptions = useMemo(
    () => [
      { label: "External Auditor", value: "external_auditor" },
      { label: "Board of Directors", value: "board" },
      { label: "Regulator", value: "regulator" },
    ],
    [],
  );

  const update = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const toggleReg = (key) => {
    setForm((p) => ({
      ...p,
      regulations: { ...p.regulations, [key]: !p.regulations[key] },
    }));
  };

  const toggleInclude = (key) => {
    setForm((p) => ({
      ...p,
      include: { ...p.include, [key]: !p.include[key] },
    }));
  };

  const setExportFormat = (val) => {
    setForm((p) => ({ ...p, exportFormat: val }));
  };

  // Optional: estimate UI (can be real from API later)
  const estimatedSize = "~3.5 MB";
  const estimatedTime = "~2-3 minutes";

  const handleSubmit = () => {
    onSubmit?.(form);
    onClose?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Bundle"
      bodyClassName="!p-0"
      widthClass="w-[640px]"
    >
      <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
        {/* Bundle Name */}
        <InputField
          labelTitle="Bundle Name"
          required
          name="bundleName"
          value={form.bundleName}
          handleChange={update}
          placeholder="e.g., Q1 2024 Compliance Audit"
        />

        {/* Institution + Generated For */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <SelectField
            labelTitle="Institution"
            name="institution"
            value={form.institution}
            handleChange={update}
            options={institutionOptions}
            placeholder="Select Institution"
          />

          <SelectField
            required
            labelTitle="Generated For"
            name="generatedFor"
            value={form.generatedFor}
            handleChange={update}
            options={generatedForOptions}
            placeholder="External Auditor"
          />
        </div>

        {/* Date Range */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <InputField
            required
            labelTitle="Date Range From"
            type="date"
            name="dateFrom"
            value={form.dateFrom}
            handleChange={update}
          />

          <InputField
            required
            labelTitle="Date Range To"
            type="date"
            name="dateTo"
            value={form.dateTo}
            handleChange={update}
          />
        </div>

        {/* Regulations to Include */}
        <div className="mt-5">
          <p className="text-sm font-medium text-[#242424]">
            Regulations to Include<span className="text-red-500 ml-1">*</span>
          </p>

          <div className="mt-3 grid grid-cols-4 gap-6 bg-[#F9FBFD] p-4 border border-[#E2E8EF] rounded-lg">
            <CheckboxInput
              label="GDPR"
              checked={form.regulations.gdpr}
              onChange={() => toggleReg("gdpr")}
            />
            <CheckboxInput
              label="PCI-DSS"
              checked={form.regulations.pci}
              onChange={() => toggleReg("pci")}
            />
            <CheckboxInput
              label="HIPAA"
              checked={form.regulations.hipaa}
              onChange={() => toggleReg("hipaa")}
            />
            <CheckboxInput
              label="SOC2"
              checked={form.regulations.soc2}
              onChange={() => toggleReg("soc2")}
            />
          </div>
        </div>

        {/* Include in Bundle */}
        <div className="mt-5">
          <p className="text-sm font-medium text-[#242424]">
            Include in Bundle
          </p>

          <div className="mt-3 flex flex-col gap-3">
            <CheckboxInput
              label="Execution Summary"
              checked={form.include.executionSummary}
              onChange={() => toggleInclude("executionSummary")}
            />

            <CheckboxInput
              label="Control Results & Evidence"
              checked={form.include.controlResultsEvidence}
              onChange={() => toggleInclude("controlResultsEvidence")}
            />

            <CheckboxInput
              label="Exceptions & Remediation"
              checked={form.include.exceptionsRemediation}
              onChange={() => toggleInclude("exceptionsRemediation")}
            />

            <CheckboxInput
              label="Compliance Statistics"
              checked={form.include.complianceStatistics}
              onChange={() => toggleInclude("complianceStatistics")}
            />

            <CheckboxInput
              label="Traceability Matrix"
              checked={form.include.traceabilityMatrix}
              onChange={() => toggleInclude("traceabilityMatrix")}
            />
          </div>
        </div>

        {/* Export Format */}
        <div className="mt-5">
          <p className="text-sm font-medium text-[#242424]">
            Export Format<span className="text-red-500 ml-1">*</span>
          </p>

          <div className="mt-3 flex flex-col gap-3">
            <RadioInput
              label="PDF Document"
              checked={form.exportFormat === "pdf"}
              onChange={() => setExportFormat("pdf")}
            />

            <RadioInput
              label="Excel Spreadsheet"
              checked={form.exportFormat === "excel"}
              onChange={() => setExportFormat("excel")}
            />

            <RadioInput
              label="ZIP Archive"
              checked={form.exportFormat === "zip"}
              onChange={() => setExportFormat("zip")}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="mt-5">
          <TextareaField
            name="notes"
            labelTitle="Notes (Optional)"
            value={form.notes}
            handleChange={update}
            rows={2}
            placeholder="Add any notes or context for this bundle..."
          />
        </div>

        {/* Estimated Bar */}
        <div className="mt-4 bg-[#EFF6FF] border border-[#CBDDF4] rounded-lg px-4 py-3 grid grid-cols-2 gap-3">
          <div>
            <p className="text-[14px] font-medium text-[#7E7E7E]">
              Estimated Size
            </p>
            <p className="text-[16px] font-semibold text-[#434343] mt-1">
              {estimatedSize}
            </p>
          </div>

          <div>
            <p className="text-[14px] font-medium text-[#7E7E7E]">
              Estimated Generation Time
            </p>
            <p className="text-[16px] font-semibold text-[#434343] mt-1">
              {estimatedTime}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#E2E8EF] flex items-center justify-end gap-3">
        <OutlinedButton onClick={onClose} className="min-w-[110px]">
          Cancel
        </OutlinedButton>

        <PrimaryButton onClick={handleSubmit} className="min-w-[150px]">
          Generate Bundle
        </PrimaryButton>
      </div>
    </Modal>
  );
}
