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
  const [step, setStep] = useState(1);

  return (
    <MappingContext.Provider value={{ create, setCreate, step, setStep }}>
      {children}
    </MappingContext.Provider>
  );
}

export default MappingProvider;
