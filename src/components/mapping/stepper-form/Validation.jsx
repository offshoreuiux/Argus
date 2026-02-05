import React, { useState } from "react";
import InputField from "../../common/InputField";
import SelectField from "../../common/SelectField";
import RadioInput from "../../common/RadioInput";
import { useMappingContext } from "../../../contexts/MappingContext";

const metricOptions = [
  { label: "Severity", value: "severity" },
  { label: "Status", value: "status" },
  { label: "Entity ID", value: "entity_id" },
  { label: "Event Type", value: "event_type" },
];

const operators = [
  { label: "Greater than (>)", value: "gt" },
  { label: "Less than (<)", value: "lt" },
  { label: "Equal (=)", value: "eq" },
  { label: "Not equal (≠)", value: "neq" },
];

function Validation() {
  const { wizard, updateWizard } = useMappingContext();

  // local test-only state (doesn't need to be in context)
  const [test, setTest] = useState({
    testValue: "152",
    expectedResult: "",
  });

  const handleValidationChange = (e) => {
    const { name, value } = e.target;
    updateWizard({
      validation: { ...wizard.validation, [name]: value },
    });
  };

  const handleTestChange = (e) => {
    const { name, value } = e.target;
    setTest((prev) => ({ ...prev, [name]: value }));
  };

  const runTest = () => {
    const thresholdRaw = wizard?.validation?.thresholdValue ?? "";
    const operator = wizard?.validation?.operator ?? "gt";

    const threshold = Number(thresholdRaw);
    const testVal = Number(test.testValue);

    if (thresholdRaw === "" || Number.isNaN(threshold)) {
      setTest((p) => ({
        ...p,
        expectedResult: "Enter a threshold value first",
      }));
      return;
    }

    if (test.testValue === "" || Number.isNaN(testVal)) {
      setTest((p) => ({ ...p, expectedResult: "Enter a valid test value" }));
      return;
    }

    let passed = false;
    if (operator === "gt") passed = testVal > threshold;
    if (operator === "lt") passed = testVal < threshold;
    if (operator === "eq") passed = testVal === threshold;
    if (operator === "neq") passed = testVal !== threshold;

    setTest((p) => ({ ...p, expectedResult: passed ? "Pass" : "Fail" }));
  };

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Header */}
      <div>
        <p className="text-[20px] font-bold text-[#242424]">
          Step 3: Set Parameters
        </p>
        <p className="text-[14px] text-[#7E7E7E] mt-1">
          Configure validation parameters for threshold
        </p>
      </div>

      {/* Top row */}
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          labelTitle="Metric Field"
          required
          name="metricField"
          placeholder="Select field"
          value={wizard.validation.metricField}
          handleChange={handleValidationChange}
          options={metricOptions}
        />

        <InputField
          labelTitle="Threshold Value"
          required
          name="thresholdValue"
          placeholder="e.g., 75"
          value={wizard.validation.thresholdValue}
          handleChange={handleValidationChange}
        />
      </div>

      {/* Operator row */}
      <div>
        <p className="text-sm font-medium text-[#242424] mb-2">
          Comparison Operator <span className="text-[#EF4444]">*</span>
        </p>

        <div className="flex items-center gap-8 flex-wrap">
          {operators.map((op) => (
            <RadioInput
              key={op.value}
              label={op.label}
              checked={wizard.validation.operator === op.value}
              onChange={() =>
                handleValidationChange({
                  target: { name: "operator", value: op.value },
                })
              }
            />
          ))}
        </div>
      </div>

      {/* Test Control card */}
      <div className="rounded-xl border border-[#E2E8EF] bg-white p-4 max-w-[50%]">
        <p className="text-[18px] font-semibold text-[#434343] mb-3">
          Test Control
        </p>

        <div className="grid grid-cols-2 gap-4">
          <InputField
            labelTitle="Test Value"
            required
            name="testValue"
            value={test.testValue}
            handleChange={handleTestChange}
            placeholder="Enter value"
          />

          <InputField
            labelTitle="Expected Results"
            name="expectedResult"
            value={test.expectedResult}
            handleChange={handleTestChange}
            placeholder="Run test to see result"
            disabled
          />
        </div>

        <button
          type="button"
          onClick={runTest}
          className="mt-4 w-full h-[42px] rounded-lg bg-[#E9FFFB] text-[#00BDA8]
                 border border-[#B7F1E8] flex items-center justify-center gap-2 cursor-pointer
                 text-[13px] font-semibold hover:brightness-[0.98] active:scale-[0.99]"
        >
          <span className="w-[24px] h-[24px] rounded-full bg-[#00D1BC] text-white flex items-center justify-center text-[12px]">
            ▶
          </span>
          Run Test
        </button>
      </div>
    </div>
  );
}

export default Validation;
