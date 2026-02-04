import React, { useMemo, useState } from "react";

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
  // Replace these with values coming from context/store later
  const mapping = useMemo(
    () => ({
      controlPattern: "Threshold Check",
      dataSource: "Threshold Check",
      threshold: "1",
      operator: "Greater than (>)",
    }),
    [],
  );

  const [executionFrequency, setExecutionFrequency] = useState("daily");
  const [executionPriority, setExecutionPriority] = useState("low");

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
                  <p className="text-[14px] font-medium text-[#9B9B9B]">Control Pattern:</p>
                  <p className="text-[16px] font-semibold text-[#434343] mt-1">
                    {mapping.controlPattern}
                  </p>
                </div>

                <div>
                  <p className="text-[14px] font-medium text-[#9B9B9B]">Data Source:</p>
                  <p className="text-[16px] font-semibold text-[#434343] mt-1">
                    {mapping.dataSource}
                  </p>
                </div>

                <div>
                  <p className="text-[14px] font-medium text-[#9B9B9B]">Threshold:</p>
                  <p className="text-[16px] font-semibold text-[#434343] mt-1">
                    {mapping.threshold}
                  </p>
                </div>

                <div>
                  <p className="text-[14px] font-medium text-[#9B9B9B]">Operator:</p>
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

      {/* Bottom selects */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div>
          <p className="text-[12px] font-medium text-[#111827] mb-2">
            Execution Frequency
          </p>
          <select
            value={executionFrequency}
            onChange={(e) => setExecutionFrequency(e.target.value)}
            className="w-full h-[42px] rounded-lg border border-[#E2E8EF] bg-[#F8FAFC] px-3 text-[13px] text-[#111827] outline-none"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <p className="text-[12px] font-medium text-[#111827] mb-2">
            Execution Priority
          </p>
          <select
            value={executionPriority}
            onChange={(e) => setExecutionPriority(e.target.value)}
            className="w-full h-[42px] rounded-lg border border-[#E2E8EF] bg-[#F8FAFC] px-3 text-[13px] text-[#111827] outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Summary;
