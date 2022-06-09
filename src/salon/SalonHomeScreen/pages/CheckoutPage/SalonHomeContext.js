import React from "react";

export const SalonHomeContext = React.createContext({});

export const SalonHomeContextProvider = ({ value, children }) => {
  return (
    <SalonHomeContext.Provider value={value}>
      {children}
    </SalonHomeContext.Provider>
  );
};
