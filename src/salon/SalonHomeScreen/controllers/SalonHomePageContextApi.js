import React from "react";

export const SalonHomePageContext = React.createContext({});

export const SalonHomePageContextProvider = ({ value, children }) => {
  return (
    <SalonHomePageContext.Provider value={value}>
      {children}
    </SalonHomePageContext.Provider>
  );
};
