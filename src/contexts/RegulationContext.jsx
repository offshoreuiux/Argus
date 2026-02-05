import React, { createContext, useContext, useState } from "react";

const RegulationContext = createContext(null);

export const useRegulationContext = () => {
  const context = useContext(RegulationContext);
  if (!context) {
    throw new Error(
      "useRegulationContext must be used inside RegulationProvider",
    );
  }
  return context;
};

function RegulationProvider({ children }) {
  const [regulationModal, setRegulationModal] = useState(false);
  const [regulationDocument, setRegulationDocument] = useState(null);
  const [regulationList, setRegulationList] = useState(null);

  return (
    <RegulationContext.Provider
      value={{
        regulationModal,
        setRegulationModal,
        regulationDocument,
        setRegulationDocument,
        regulationList,
        setRegulationList,
      }}
    >
      {children}
    </RegulationContext.Provider>
  );
}

export default RegulationProvider;
