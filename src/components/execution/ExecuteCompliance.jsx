import React, { useEffect, useRef, useState } from "react";
import Card from "../common/Card";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import OutlinedButton from "../common/OutlinedButton";
import PrimaryButton from "../common/PrimaryButton";
import { useExecutionContext } from "../../contexts/ExecutionContext";
import ExecutionModal from "./modal/ExecutionModal";
import CheckboxInput from "../common/CheckboxInput";
import { runExecutionApi } from "../../../connections/apis/execution/execution";

const bankArr = [{ label: "DEMO BANK", value: "DEMO_BANK" }];

// (Optional) map your UI checkboxes to backend obligation_ids
// Replace with your real IDs (from backend)
const REGULATION_TO_OBLIGATION_IDS = {
  gdpr: ["GDPR_SAMPLE_OBLIGATION"],
  pci: ["PCI_SAMPLE_OBLIGATION"],
  hipaa: ["HIPAA_SAMPLE_OBLIGATION"],
  soc2: ["SOC2_SAMPLE_OBLIGATION"],
};

// (Optional) map UI modes to backend "mode"
const MODE_MAP = {
  standard: "batch",
  quick: "batch",
  deep: "batch",
};

function ExecuteCompliance() {
  const {
    form,
    setForm,
    executionProgressModal,
    setExecutionProgressModal,
    setExecutionDocument, // ✅ REQUIRED in your context (same place you set executionDocument on eye click)
  } = useExecutionContext();

  const [loadingExecute, setLoadingExecute] = useState(false);
  const [executeError, setExecuteError] = useState("");

  const timerRef = useRef(null); // no longer needed for fake progress, but kept if you want

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const updateCheckboxGroup = (group, key) => {
    setForm((p) => ({
      ...p,
      [group]: { ...p[group], [key]: !p[group][key] },
    }));
  };

  const handleCancel = () => {
    setForm({
      institution: "",
      effectiveDate: "",
      regulations: { gdpr: false, hipaa: false, pci: false, soc2: false },
      modes: { standard: false, deep: false, quick: false },
    });
    setExecuteError("");
  };

  // ✅ build obligation_ids from selected regulations
  const getSelectedObligationIds = () => {
    const selectedRegs = Object.entries(form.regulations || {})
      .filter(([, checked]) => checked)
      .map(([key]) => key);

    const ids = selectedRegs.flatMap(
      (regKey) => REGULATION_TO_OBLIGATION_IDS[regKey] || [],
    );

    // Remove duplicates
    return Array.from(new Set(ids));
  };

  // ✅ choose backend mode from selected modes (pick first checked)
  const getSelectedMode = () => {
    const selected = Object.entries(form.modes || {}).find(([, v]) => v);
    if (!selected) return "batch";
    const [key] = selected;
    return MODE_MAP[key] || "batch";
  };

  const handleExecute = async () => {
    try {
      setExecuteError("");

      if (!form.institution) {
        setExecuteError("Please select an institution.");
        return;
      }
      if (!form.effectiveDate) {
        setExecuteError("Please select an effective date.");
        return;
      }

      const obligation_ids = getSelectedObligationIds();
      if (!obligation_ids.length) {
        setExecuteError("Please select at least one regulation.");
        return;
      }

      const mode = getSelectedMode();
      setLoadingExecute(true);

      const res = await runExecutionApi({
        institution_id: form.institution,
        execution_date: form.effectiveDate,
        obligation_ids,
        mode,
      });

      const run_id =
        res?.data?.run_id || res?.data?.runId || res?.data?.data?.run_id;

      if (!run_id) {
        throw new Error("Run ID not returned from API.");
      }

      setExecutionDocument((prev) => ({
        ...(prev || {}),
        run_id,
        institution_id: form.institution,
        execution_date: form.effectiveDate,
        // optional fields if you want:
        started_at: null,
        duration_seconds: 0,
      }));
      setExecutionProgressModal(true);
    } catch (e) {
      setExecuteError(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to start execution.",
      );
    } finally {
      setLoadingExecute(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <>
      <Card className={"!p-0"}>
        <div className="p-6">
          <p className="text-[20px] font-bold text-[#242424]">
            Execute Compliance Check
          </p>

          <div className="grid grid-cols-2 gap-6 mt-4">
            <SelectField
              name={"institution"}
              labelTitle="Institution"
              value={form.institution}
              handleChange={updateField}
              placeholder="Select Institution"
              options={bankArr}
            />

            <InputField
              labelTitle="Effective Date"
              type="date"
              name="effectiveDate"
              value={form.effectiveDate}
              handleChange={updateField}
            />

            {/* Regulations */}
            <div>
              <p className="text-sm font-medium text-[#242424] mb-3">
                Regulations to Check
              </p>

              <div className="grid grid-cols-2 gap-y-4">
                {[
                  ["gdpr", "GDPR"],
                  ["pci", "PCI-DSS"],
                  ["hipaa", "HIPAA"],
                  ["soc2", "SOC2"],
                ].map(([key, label]) => (
                  <CheckboxInput
                    key={key}
                    label={label}
                    checked={form.regulations[key]}
                    onChange={() => updateCheckboxGroup("regulations", key)}
                  />
                ))}
              </div>
            </div>

            {/* Execution Mode */}
            <div>
              <p className="text-sm font-medium text-[#242424] mb-3">
                Execution Mode
              </p>

              <div className="grid grid-cols-2 gap-y-4">
                {[
                  ["standard", "Standard"],
                  ["quick", "Quick Scan"],
                  ["deep", "Deep Audit"],
                ].map(([key, label]) => (
                  <CheckboxInput
                    key={key}
                    label={label}
                    checked={form.modes[key]}
                    onChange={() => updateCheckboxGroup("modes", key)}
                  />
                ))}
              </div>
            </div>
          </div>

          {executeError ? (
            <p className="text-[13px] text-[#B42318] mt-5">{executeError}</p>
          ) : null}
        </div>

        <div className="px-6 py-4 border-t border-[#E2E8EF] flex items-center justify-between">
          <OutlinedButton
            onClick={handleCancel}
            className="min-w-[150px]"
            disabled={loadingExecute}
          >
            Cancel
          </OutlinedButton>

          <PrimaryButton
            onClick={handleExecute}
            className="min-w-[150px]"
            disabled={loadingExecute}
          >
            {loadingExecute ? "Executing..." : "Execute"}
          </PrimaryButton>
        </div>
      </Card>

      <ExecutionModal
        isOpen={executionProgressModal}
        onClose={() => setExecutionProgressModal(false)}
        onMinimize={() => setExecutionProgressModal(false)}
      />
    </>
  );
}

export default ExecuteCompliance;
