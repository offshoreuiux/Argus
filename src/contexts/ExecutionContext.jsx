import React, { createContext, useContext, useState } from "react";

const ExecutionContext = createContext(null);

export const useExecutionContext = () => {
  const context = useContext(ExecutionContext);
  if (!context) {
    throw new Error(
      "useExecutionContext must be used inside ExecutionProvider",
    );
  }
  return context;
};

function ExecutionProvider({ children }) {
  const [form, setForm] = useState({
    institution: "",
    executionDate: "",
    regulations: {
      gdpr: false,
      hipaa: false,
      pci: false,
      soc2: false,
    },
    modes: {
      standard: false,
      deep: false,
      quick: false,
    },
  });
  

  return (
    <ExecutionContext.Provider value={{ form, setForm }}>
      {children}
    </ExecutionContext.Provider>
  );
}

export default ExecutionProvider;
