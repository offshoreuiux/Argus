import React, { createContext, useContext, useState } from "react";

const RegulationContext = createContext(null);

export const useObligationContext = () => {
  const context = useContext(RegulationContext);
  if (!context) {
    throw new Error(
      "useObligationContext must be used inside ObligationProvider",
    );
  }
  return context;
};

function ObligationProvider({ children }) {
  const [obligationModal, setObligationModal] = useState(false);
  const [obligationDocument, setObligationDocument] = useState(null);
  const [obligationList, setObligationList] = useState(null);

  return (
    <RegulationContext.Provider
      value={{
        obligationModal,
        setObligationModal,
        obligationDocument,
        setObligationDocument,
        obligationList,
        setObligationList,
      }}
    >
      {children}
    </RegulationContext.Provider>
  );
}

export default ObligationProvider;
