import React, { useMemo } from "react";
import { useMappingContext } from "../../../contexts/MappingContext";
import SelectField from "../../common/SelectField";

const CheckIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path
      d="M8 12.5l2.6 2.6L16.5 9.2"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function Summary() {
  const { wizard, updateWizard, submitError } = useMappingContext();

  const mapping = useMemo(() => {
    const op = wizard?.validation?.operator;

    const operatorLabel =
      op === "gt"
        ? "Greater than (>)"
        : op === "lt"
          ? "Less than (<)"
          : op === "eq"
            ? "Equal (=)"
            : op === "neq"
              ? "Not equal (≠)"
              : "-";

    return {
      controlPattern: wizard?.control_pattern_id
        ? `Pattern #${wizard.control_pattern_id}`
        : "-",
      dataSource: wizard?.data_source?.dataset || "-",
      threshold: wizard?.validation?.thresholdValue || "-",
      operator: operatorLabel,
    };
  }, [wizard]);

  const checks = [
    "Data source connectivity verified",
    "Schema validation passed",
    "Parameter configuration valid",
    "Test execution successful",
    "Control logic validated",
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-4">
        <p className="text-[20px] font-bold text-[#242424]">
          Step 4: Review & Activate
        </p>
        <p className="text-[14px] text-[#7E7E7E] mt-1">
          Verify your mapping configuration before activation
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* LEFT */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-base font-medium text-[#242424] mb-2">
              Mapping Summary
            </p>

            {/* Summary card */}
            <div className="rounded-lg border border-[#E2E8EF] bg-[#FAFBFD] p-4">
              <div className="grid grid-cols-2 gap-x-10 gap-y-5">
                <div>
                  <p className="text-[14px] font-medium text-[#9B9B9B]">
                    Control Pattern:
                  </p>
                  <p className="text-[16px] font-semibold text-[#434343] mt-1">
                    {mapping.controlPattern}
                  </p>
                </div>

                <div>
                  <p className="text-[14px] font-medium text-[#9B9B9B]">
                    Data Source:
                  </p>
                  <p className="text-[16px] font-semibold text-[#434343] mt-1">
                    {mapping.dataSource}
                  </p>
                </div>

                <div>
                  <p className="text-[14px] font-medium text-[#9B9B9B]">
                    Threshold:
                  </p>
                  <p className="text-[16px] font-semibold text-[#434343] mt-1">
                    {mapping.threshold}
                  </p>
                </div>

                <div>
                  <p className="text-[14px] font-medium text-[#9B9B9B]">
                    Operator:
                  </p>
                  <p className="text-[16px] font-semibold text-[#434343] mt-1">
                    {mapping.operator}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dark success banner */}
          <div className="rounded-lg border border-[#23304A] bg-gradient-to-r from-[#0F1E3A] to-[#162A4B] p-4">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#0B2E2A] flex items-center justify-center">
                <CheckIcon className="text-[#00D1BC] w-[30px] h-[30px]" />
              </span>
              <p className="text-[16px] text-white">
                All validation checks passed. This mapping is ready to activate.
              </p>
            </div>
          </div>

          {submitError ? (
            <p className="text-sm text-red-600">{submitError}</p>
          ) : null}
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-3">
          {checks.map((txt) => (
            <div
              key={txt}
              className="rounded-lg border border-[#B9ECDB] bg-[#E6F7F2] px-4 py-3 flex items-center gap-3"
            >
              <span className="w-6 h-6 rounded-full flex items-center justify-center">
                <CheckIcon className="text-[#00D1BC] w-[20px] h-[20px]" />
              </span>
              <p className="text-[12px] text-[#111827]">{txt}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom selects (bind to CONTEXT, not local state) */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <SelectField
          labelTitle="Execution Frequency"
          value={wizard?.execution_frequency || "daily"}
          handleChange={(e) =>
            updateWizard({ execution_frequency: e.target.value })
          }
          options={[
            { label: "Daily", value: "daily" },
            { label: "Weekly", value: "weekly" },
            { label: "Monthly", value: "monthly" },
          ]}
        />

        <SelectField
          labelTitle="Execution Priority"
          value={wizard?.priority || "low"}
          handleChange={(e) => updateWizard({ priority: e.target.value })}
          options={[
            { label: "Low", value: "low" },
            { label: "Medium", value: "medium" },
            { label: "High", value: "high" },
            { label: "Critical", value: "critical" },
          ]}
        />
      </div>
    </div>
  );
}

export default Summary;
