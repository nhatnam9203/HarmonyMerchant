import React from "react";
export const useProps = (props) => {
  const [isLoyaltyProgram, setIsLoyaltyProgram] = React.useState(false);
  return { isLoyaltyProgram, setIsLoyaltyProgram };
};
