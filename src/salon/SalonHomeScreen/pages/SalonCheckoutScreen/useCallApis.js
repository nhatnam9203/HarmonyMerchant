import { harmonyApi } from "@shared/services";
import { statusSuccess } from "@shared/utils";
import React from "react";
import * as CheckoutState from "./SalonCheckoutState";

export const useCallApis = ({ dispatchLocal }) => {
  //   const getCategoriesByStaffCallback = React.useRef(null);

  const [
    categoriesByStaffRequest,
    {
      currentData: categoriesByStaffResponse,
      isLoading: isGetCategoriesByStaff,
    },
  ] = harmonyApi.useLazyGetCategoriesByStaffQuery();

  React.useEffect(() => {
    const { codeStatus, data } = categoriesByStaffResponse || {};
    if (statusSuccess(codeStatus)) {
      dispatchLocal(CheckoutState.setCategories(data));
    }
  }, [categoriesByStaffResponse?.data]);

  const getCategoriesByStaff = (staffId, cb) => {
    if (!staffId) return;
    categoriesByStaffRequest(staffId);
  };

  return {
    isGetCategoriesByStaff,
    getCategoriesByStaff,
  };
};
