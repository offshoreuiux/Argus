import React, { useState } from "react";
import InputField from "../../common/InputField";
import SelectField from "../../common/SelectField";
import { useMappingContext } from "../../../contexts/MappingContext";

const tableArr = [
  { label: "Processing Log", value: "processing_log" },
  { label: "PIA Database", value: "pia_database" },
  { label: "Incident Log", value: "incident_log" },
  { label: "Encryption Audit", value: "encryption_audit" },
];

function DataConnection() {
  const { wizard, updateWizard } = useMappingContext();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // map your inputs to the structure backend expects
    if (name === "table") {
      updateWizard({
        data_source: {
          ...wizard.data_source,
          dataset: value,
        },
      });
    }

    if (name === "filterCondition") {
      // if you want to keep it simple, store raw string,
      // or parse it into filter_column/filter_value if you can.
      // Here’s a simple approach: store raw string as filter_value.
      updateWizard({
        data_source: {
          ...wizard.data_source,
          filter_value: value,
        },
      });
    }
  };

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Header */}
      <div>
        <p className="text-[20px] font-bold text-[#242424]">
          Step 2: Configure Data Source
        </p>
        <p className="text-[14px] text-[#7E7E7E] mt-1">
          Select a control pattern for this obligation
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          labelTitle="Select Table"
          required
          name="table"
          value={wizard.data_source.dataset}
          handleChange={handleChange}
          placeholder="Select a table"
          options={tableArr}
        />

        <InputField
          labelTitle="Filter Conditions (Optional)"
          name="filterCondition"
          value={wizard.data_source.filter_value}
          handleChange={handleChange}
          placeholder="e.g., status='active' AND severity > 5"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-[#111827] mb-2">
          Parameters (JSON)
        </p>
        <textarea
          name="parameters"
          value={wizard.parameters}
          readOnly
          className="w-full h-[110px] rounded-lg border border-[#E5E7EB] p-3
             text-sm text-[#00D1BC]
             bg-gradient-to-r from-[#1F2A44] to-[#2B2F55]
             outline-none resize-none"
        />
      </div>
    </div>
  );
}

export default DataConnection;
