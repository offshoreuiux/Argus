import { useEffect, useState } from "react";
import InputField from "../../common/InputField";
import SelectField from "../../common/SelectField";
import RadioInput from "../../common/RadioInput";
import { useMappingContext } from "../../../contexts/MappingContext";
import { mappingTestApi } from "../../../../connections/apis/mapping/mapping";
import { fetchSemanticRegistryApi } from "../../../../connections/apis/api";

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
  const { wizard, updateWizard, mode, editingId } = useMappingContext();
  const [test, setTest] = useState({
    testValue: "152",
    expectedResult: "",
  });
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState(""); // ✅ new
  const [metricField, setMetricField] = useState([]);

  const fetchSemanticRegistryList = async () => {
    try {
      const res = await fetchSemanticRegistryApi();
      setMetricField(res.data?.semantic_concepts);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchSemanticRegistryList();
  }, []);

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

  const runLocalTest = () => {
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

  const runTest = async () => {
    setTestError(""); // ✅ clear previous error

    // Create mode => local test only
    if (mode !== "edit") {
      runLocalTest();
      return;
    }

    const mapping_id = editingId;
    if (!mapping_id) {
      setTest((p) => ({ ...p, expectedResult: "Fail" }));
      setTestError("Mapping ID not found");
      return;
    }

    const thresholdRaw = wizard?.validation?.thresholdValue ?? "";
    const threshold = Number(thresholdRaw);
    const testVal = Number(test.testValue);

    if (thresholdRaw === "" || Number.isNaN(threshold)) {
      setTest((p) => ({ ...p, expectedResult: "" }));
      setTestError("Enter a threshold value first");
      return;
    }
    if (test.testValue === "" || Number.isNaN(testVal)) {
      setTest((p) => ({ ...p, expectedResult: "" }));
      setTestError("Enter a valid test value");
      return;
    }

    // payload keys must match backend expectations
    const payload = {
      metric_field: wizard?.validation?.metricField,
      operator: wizard?.validation?.operator ?? "gt",
      threshold_value: thresholdRaw,
      test_value: test.testValue,
    };

    try {
      setTestLoading(true);
      setTest((p) => ({ ...p, expectedResult: "" }));

      const res = await mappingTestApi(mapping_id, payload);

      // ✅ Your API returns these keys
      const passed = Boolean(res?.data?.test_passed);
      const errMsg = res?.data?.error || "";

      setTest((p) => ({ ...p, expectedResult: passed ? "Pass" : "Fail" }));
      setTestError(!passed && errMsg ? errMsg : "");
    } catch (err) {
      setTest((p) => ({ ...p, expectedResult: "Fail" }));
      setTestError(err?.response?.data?.message || "Test request failed");
    } finally {
      setTestLoading(false);
    }
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
        {/* <SelectField
          labelTitle="Metric Field"
          required
          name="metricField"
          placeholder="Select field"
          value={wizard.validation.metricField}
          handleChange={handleValidationChange}
          options={metricOptions}
        /> */}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#242424]">
            Metric Field
          </label>
          <select
            name="metricField"
            value={wizard.validation.metricField}
            onChange={handleValidationChange}
            className="
                  w-full h-11.5 px-3 rounded-lg text-sm
                  border border-[#E2E8EF] bg-[#F9FBFD]
                  outline-none transition
                  focus:border-teal-500
                  disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select pattern</option>
            {metricField?.map((item) => (
              <option key={item.version} value={item.concept_id}>
                {item.concept_id?.split("_")?.join(" ")}
              </option>
            ))}
          </select>
        </div>

        <InputField
          labelTitle="Threshold Value"
          required
          name="thresholdValue"
          placeholder="e.g., 75"
          value={wizard.validation.thresholdValue}
          handleChange={handleValidationChange}
          type="number"
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
            type="number"
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

        {/* ✅ show API error */}
        {/* {testError ? (
          <p className="mt-3 text-[12px] text-[#EF4444]">{testError}</p>
        ) : null} */}

        <button
          type="button"
          onClick={runTest}
          disabled={testLoading}
          className={`mt-4 w-full h-10.5 rounded-lg bg-[#E9FFFB] text-[#00BDA8]
            border border-[#B7F1E8] flex items-center justify-center gap-2
            text-[13px] font-semibold hover:brightness-[0.98] active:scale-[0.99]
            ${testLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <span className="w-6 h-6 rounded-full bg-[#00D1BC] text-white flex items-center justify-center text-[12px]">
            {testLoading ? "…" : "▶"}
          </span>
          {testLoading ? "Running..." : "Run Test"}
        </button>
      </div>
    </div>
  );
}

export default Validation;
