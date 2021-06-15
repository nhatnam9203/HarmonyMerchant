import React from "react";
import { DropdownWrapper } from "./DropdownWrapper";

export const DropdownContext = React.createContext({});

export const DropdownProvider = ({ children }) => {
  const dropdownRef = React.useRef(null);

  return (
    <DropdownContext.Provider value={{ dropdown: dropdownRef }}>
      {/* <DropdownWrapper dropdownRef={dropdownRef} /> */}
      {children}
    </DropdownContext.Provider>
  );
};
