import React, { useEffect, useMemo, useState, useRef } from "react";
import Modal from "../../common/Modal";
import InputField from "../../common/InputField";
import SelectField from "../../common/SelectField";
import TextareaField from "../../common/TextareaField";
import OutlinedButton from "../../common/OutlinedButton";
import PrimaryButton from "../../common/PrimaryButton";
import RadioInput from "../../common/RadioInput";
import {
  approveSingleObligationApi,
  fetchControlPatternsApi,
} from "../../../../connections/apis/obligation/obligation";
import { obligationToForm } from "../../../../helper";

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
  const [controlPanelList, setControlPanelList] = useState([]);

  const [errors, setErrors] = useState({ reviewNotes: "" });
  const reviewNotesRef = useRef(null);

  useEffect(() => {
    setForm(initial);
    setErrors({ reviewNotes: "" });
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));

    // clear error as user types
    if (name === "reviewNotes") {
      setErrors((p) => ({ ...p, reviewNotes: "" }));
    }
  };

  const validate = () => {
    const notes = String(form.reviewNotes || "").trim();
    const nextErrors = {
      reviewNotes: notes ? "" : "Review notes is required",
    };
    setErrors(nextErrors);

    if (!notes) {
      // focus textarea
      setTimeout(() => reviewNotesRef.current?.focus?.(), 0);
      return false;
    }
    return true;
  };

  const handleApprove = async () => {
    if (!validate()) return;

    try {
      setSaving(true);

      const obligationId = document?.current?.obligation_id;

      await approveSingleObligationApi(obligationId, {
        status: document?.current?.status,
        review_notes: form.reviewNotes,
        reviewed_by: "user",
      });

      await fetchObligationList?.();
      onClose?.();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const fetchControlPatterns = async () => {
    try {
      const res = await fetchControlPatternsApi();
      setControlPanelList(res.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchControlPatterns();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={document?.title || "Document Preview"}
      description={`Obligation ID: ${document?.current?.obligation_id}`}
      status={document?.status}
    >
      <div className="w-full">
        <div className="max-h-[500px] overflow-y-auto pr-1">
          <div className="py-4 flex flex-col gap-4">
            <InputField
              labelTitle="Original Clause"
              name="originalClause"
              value={form.originalClause}
              handleChange={handleChange}
            />

            <TextareaField
              labelTitle="Obligation Statement"
              name="statement"
              value={form.statement}
              handleChange={handleChange}
              rows={3}
            />

            <SelectField
              labelTitle="Entity Scope"
              name="entityScope"
              value={form.entityScope}
              handleChange={handleChange}
              placeholder="Select scope"
              options={ENTITY_SCOPE_OPTIONS}
            />

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

            <InputField
              labelTitle="Trigger Details"
              name="triggerDetails"
              value={form.triggerDetails}
              handleChange={handleChange}
              placeholder="e.g., Monthly or first Monday"
            />

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

            <InputField
              labelTitle="Data Requirements"
              name="dataRequirements"
              value={form.dataRequirements}
              handleChange={handleChange}
              placeholder="Specify required data sources and fields"
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#242424]">
                Suggested Control Pattern
              </label>
              <select
                name="controlPattern"
                value={form.controlPattern}
                onChange={handleChange}
                className="
                  w-full h-[46px] px-3 rounded-lg text-sm
                  border border-[#E2E8EF] bg-[#F9FBFD]
                  outline-none transition
                  focus:border-teal-500
                  disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select pattern</option>
                {controlPanelList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id?.split("_")?.join(" ")}
                  </option>
                ))}
              </select>
            </div>

            {/* ✅ Review Notes required */}
            <div>
              <TextareaField
                labelTitle="Review Notes"
                name="reviewNotes"
                required
                value={form.reviewNotes}
                handleChange={handleChange}
                placeholder="Add any notes or comments about this obligation..."
                rows={3}
                // if your TextareaField supports ref passing:
                ref={reviewNotesRef}
              />
              {errors.reviewNotes ? (
                <p className="text-sm text-red-500 mt-1">
                  {errors.reviewNotes}
                </p>
              ) : null}
            </div>
          </div>
        </div>

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
