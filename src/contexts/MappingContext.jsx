import React, { createContext, useContext, useState } from "react";

const MappingContext = createContext(null);

export const useMappingContext = () => {
  const context = useContext(MappingContext);
  if (!context) {
    throw new Error("useMappingContext must be used inside MappingProvider");
  }
  return context;
};

function MappingProvider({ children }) {
  const [create, setCreate] = useState(false);
  const [mode, setMode] = useState("create"); // "create" | "edit"
  const [editingId, setEditingId] = useState(null);
  const [mappingList, setMappingList] = useState();

  // extend wizard defaults
  const DEFAULT_WIZARD = {
    obligation_id: "",
    control_pattern_id: null,
    data_source: {
      dataset: "",
      aggregation: "SUM",
      filter_column: "",
      filter_value: "",
    },
    validation: {
      metricField: "severity",
      thresholdValue: "",
      operator: "gt",
    },
    execution_frequency: "daily",
    priority: "low",
  };

  const [wizard, setWizard] = useState(DEFAULT_WIZARD);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const resetWizard = () => setWizard(DEFAULT_WIZARD);

  const updateWizard = (patch) => {
    setWizard((prev) => ({ ...prev, ...patch }));
  };

  return (
    <MappingContext.Provider
      value={{
        create,
        setCreate,
        mappingList,
        setMappingList,
        wizard,
        setWizard,
        submitting,
        setSubmitting,
        submitError,
        setSubmitError,
        mode,
        setMode,
        editingId,
        setEditingId,
        updateWizard,
        resetWizard,
      }}
    >
      {children}
    </MappingContext.Provider>
  );
}

export default MappingProvider;
