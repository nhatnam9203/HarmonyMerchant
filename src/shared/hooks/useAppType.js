import { useSelector } from "react-redux";
import React from "react";

export const useAppType = () => {
  const merchant = useSelector((state) => state.dataLocal.profile);

  const [appType, setAppType] = React.useState(Constants.APP_TYPE.POS);

  React.useEffect(() => {
    const { type = Constants.APP_TYPE.POS } = merchant || {};
    setAppType(type);
  }, [merchant]);

  return {
    appType,
    isSalonApp: () => {
      return appType == Constants.APP_TYPE.POS;
    },
    isRetailApp: () => {
      return appType == Constants.APP_TYPE.RETAILER;
    },
  };
};
