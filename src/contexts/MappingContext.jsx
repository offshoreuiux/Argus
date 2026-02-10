import React, { createContext, useContext, useState } from "react";
import { DEFAULT_WIZARD } from "../../helper";

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
  const [datasetList, setDatasetList] = useState([]);

  // extend wizard defaults
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
        datasetList,
        setDatasetList,
      }}
    >
      {children}
    </MappingContext.Provider>
  );
}

export default MappingProvider;
