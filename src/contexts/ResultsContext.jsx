import React, { createContext, useContext, useState } from "react";

const ResultsContext = createContext(null);

export const useResultsContext = () => {
  const context = useContext(ResultsContext);
  if (!context) {
    throw new Error("useResultsContext must be used inside ResultsProvider");
  }
  return context;
};

function ResultsProvider({ children }) {
  const [exceptionModal, setExceptionModal] = useState(false);
  const [historicalTrendModal, setHistoricalTrendModal] = useState(false);

  return (
    <ResultsContext.Provider
      value={{
        exceptionModal,
        setExceptionModal,
        historicalTrendModal,
        setHistoricalTrendModal,
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
}

export default ResultsProvider;
