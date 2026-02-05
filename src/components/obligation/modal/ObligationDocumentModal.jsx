import React, { useEffect, useMemo, useState } from "react";
import Modal from "../../common/Modal";
import InputField from "../../common/InputField";
import SelectField from "../../common/SelectField";
import TextareaField from "../../common/TextareaField";
import OutlinedButton from "../../common/OutlinedButton";
import PrimaryButton from "../../common/PrimaryButton";
import RadioInput from "../../common/RadioInput";
import { updateSingleObligationApi } from "../../../../connections/apis/obligation/obligation";
import { formToUpdatePayload, obligationToForm } from "../../../../helper";

const TRIGGER_TYPES = [
  { label: "Organization Wide", value: "org_wide" },
  { label: "On Demand", value: "on_demand" },
  { label: "Threshold Breach", value: "threshold_breach" },
  { label: "Event-Based", value: "event_based" },
];

const ENTITY_SCOPE_OPTIONS = [
  { label: "Organization Wide", value: "organization_wide" },
  { label: "Department Level", value: "department_level" },
  { label: "Specific Process", value: "specific_process" },
];

const CONTROL_PATTERN_OPTIONS = [
  { label: "Automated Workflow", value: "automated_workflow" },
  { label: "Threshold Check", value: "threshold_check" },
  { label: "Formula Check", value: "formula_check" },
  { label: "TimeLiness Check", value: "timeLiness_check" },
];

function ObligationReviewModal({
  isOpen,
  onClose,
  document,
  onApprove,
  fetchObligationList,
}) {
  const initial = useMemo(() => obligationToForm(document), [document]);
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  console.log("document", document);

  console.log("form", form);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleApprove = async () => {
    try {
      setSaving(true);

      const obligationId = document?.current?.obligation_id;
      const payload = formToUpdatePayload(form);

      await updateSingleObligationApi(obligationId, payload);

      await fetchObligationList?.();
      onClose?.();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={document?.title || "Document Preview"}
      description={`Obligation ID: ${document?.current?.obligation_id}`}
      status={document?.status}
    >
      {/* Modal header (custom like screenshot) */}
      <div className="w-full">
        {/* Body scroll */}
        <div className="max-h-[500px] overflow-y-auto pr-1">
          <div className="py-4 flex flex-col gap-4">
            {/* Original Clause */}
            <InputField
              labelTitle="Original Clause"
              name="originalClause"
              value={form.originalClause}
              handleChange={handleChange}
            />

            {/* Obligation Statement */}
            <TextareaField
              labelTitle="Obligation Statement"
              name="statement"
              value={form.statement}
              handleChange={handleChange}
              rows={3}
            />

            {/* Entity Scope */}
            <SelectField
              labelTitle="Entity Scope"
              name="entityScope"
              value={form.entityScope}
              handleChange={handleChange}
              placeholder="Select scope"
              options={ENTITY_SCOPE_OPTIONS}
            />

            {/* Trigger Type */}
            <div>
              <p className="text-sm font-medium text-[#111827] mb-2">
                Trigger Type
              </p>
              <div className="grid grid-cols-2 gap-y-3">
                {TRIGGER_TYPES.map((t) => (
                  <RadioInput
                    key={t.value}
                    label={t.label}
                    checked={form.triggerType === t.value}
                    onChange={() =>
                      setForm((p) => ({ ...p, triggerType: t.value }))
                    }
                  />
                ))}
              </div>
            </div>

            {/* Trigger Details */}
            <InputField
              labelTitle="Trigger Details"
              name="triggerDetails"
              value={form.triggerDetails}
              handleChange={handleChange}
              placeholder="e.g., Monthly or first Monday"
            />

            {/* Parameters (JSON) */}
            <div>
              <p className="text-sm font-medium text-[#111827] mb-2">
                Parameters (JSON)
              </p>
              <textarea
                name="parameters"
                value={form.parameters}
                onChange={handleChange}
                className="w-full h-[110px] rounded-lg border border-[#E5E7EB] p-3 text-sm text-white bg-gradient-to-r from-[#1F2A44] to-[#2B2F55] outline-none"
              />
            </div>

            {/* Data Requirements */}
            <InputField
              labelTitle="Data Requirements"
              name="dataRequirements"
              value={form.dataRequirements}
              handleChange={handleChange}
              placeholder="Specify required data sources and fields"
            />

            {/* Suggested Control Pattern */}
            <SelectField
              labelTitle="Suggested Control Pattern"
              name="controlPattern"
              value={form.controlPattern}
              handleChange={handleChange}
              placeholder="Select pattern"
              options={CONTROL_PATTERN_OPTIONS}
            />

            {/* Review Notes */}
            <TextareaField
              labelTitle="Review Notes"
              name="reviewNotes"
              value={form.reviewNotes}
              handleChange={handleChange}
              placeholder="Add any notes or comments about this obligation..."
              rows={3}
            />
          </div>
        </div>

        {/* Footer actions (sticky like screenshot) */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#EAEAEA]">
          <OutlinedButton className="min-w-[110px]" onClick={onClose}>
            Cancel
          </OutlinedButton>
          <PrimaryButton
            className="min-w-[110px]"
            onClick={handleApprove}
            disabled={saving}
            loading={saving}
          >
            {saving ? "Saving..." : "Approve"}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}

export default ObligationReviewModal;
