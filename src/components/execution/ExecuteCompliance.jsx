import React, { useEffect, useRef, useState } from "react";
import Card from "../common/Card";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import OutlinedButton from "../common/OutlinedButton";
import PrimaryButton from "../common/PrimaryButton";
import { useExecutionContext } from "../../contexts/ExecutionContext";
import ExecutionModal from "./modal/ExecutionModal";
import CheckboxInput from "../common/CheckboxInput";

const bankArr = [
  { label: "Bank A", value: "bank_a" },
  { label: "Bank B", value: "bank_b" },
  { label: "Bank C", value: "bank_c" },
];

function ExecuteCompliance() {
  const { form, setForm } = useExecutionContext();

  // modal state
  const [showProgress, setShowProgress] = useState(false);

  // optional fake progress
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

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
      executionDate: "",
      regulations: { gdpr: false, hipaa: false, pci: false, soc2: false },
      modes: { standard: false, deep: false, quick: false },
    });
  };

  const handleExecute = () => {
    // hook your API call here
    console.log("Execute payload:", form);

    // open modal
    setShowProgress(true);

    // optional: simulate progress
    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p + 5;
        if (next >= 100) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 100;
        }
        return next;
      });
    }, 600);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const institutionLabel =
    bankArr.find((b) => b.value === form.institution)?.label || "Bank A";

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
        </div>

        <div className="px-6 py-4 border-t border-[#E2E8EF] flex items-center justify-between">
          <OutlinedButton onClick={handleCancel} className="min-w-[150px]">
            Cancel
          </OutlinedButton>
          <PrimaryButton onClick={handleExecute} className="min-w-[150px]">
            Execute
          </PrimaryButton>
        </div>
      </Card>

      {/* Modal */}
      <ExecutionModal
        isOpen={showProgress}
        onClose={() => setShowProgress(false)}
        runId="RUN-004"
        institution={institutionLabel}
        elapsed={`${Math.floor(progress / 4)}m ${Math.floor((progress * 3) % 60)}s`}
        startedAt={new Date().toLocaleString()}
        progress={progress}
        stats={{
          total: 44,
          passed: Math.min(44, Math.floor(progress * 0.4)),
          failed: 4,
        }}
        onMinimize={() => setShowProgress(false)}
      />
    </>
  );
}

export default ExecuteCompliance;
