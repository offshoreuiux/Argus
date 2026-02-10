import React, { createContext, useCallback, useContext, useState } from "react";

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
  const [createBundleModal, setCreateBundleModal] = useState(false);
  const [bundleGenModal, setBundleGenModal] = useState(false);
  const [auditList, setAuditList] = useState([]);
  const [auditListRefreshKey, setAuditListRefreshKey] = useState(0);

  const triggerAuditListRefresh = useCallback(() => {
    setAuditListRefreshKey((k) => k + 1);
  }, []);
  return (
    <AuditExportContext.Provider
      value={{
        bundleSummaryModal,
        setBundleSummaryModal,
        selectedBundle,
        setSelectedBundle,
        createBundleModal,
        setCreateBundleModal,
        bundleGenModal,
        setBundleGenModal,
        auditList,
        setAuditList,
        auditListRefreshKey,
        triggerAuditListRefresh,
      }}
    >
      {children}
    </AuditExportContext.Provider>
  );
}

export default AuditExportProvider;
