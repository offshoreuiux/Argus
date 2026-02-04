import React, { createContext, useContext, useState } from "react";

const AuditExportContext = createContext(null);

export const useAuditExportContext = () => {
  const context = useContext(AuditExportContext);
  if (!context) {
    throw new Error(
      "useAuditExportContext must be used inside AuditExportProvider",
    );
  }
  return context;
};

function AuditExportProvider({ children }) {
  const [bundleSummaryModal, setBundleSummaryModal] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);

  return (
    <AuditExportContext.Provider
      value={{
        bundleSummaryModal,
        setBundleSummaryModal,
        selectedBundle,
        setSelectedBundle,
      }}
    >
      {children}
    </AuditExportContext.Provider>
  );
}

export default AuditExportProvider;
