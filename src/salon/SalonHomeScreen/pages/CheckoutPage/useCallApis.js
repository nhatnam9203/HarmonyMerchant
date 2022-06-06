import { harmonyApi } from "@shared/services";
import { statusSuccess, statusNotfound } from "@shared/utils";
import React from "react";
import * as CheckoutState from "./SalonCheckoutState";

export const useCallApis = ({ dispatchLocal }) => {
  //   const getCategoriesByStaffCallback = React.useRef(null);

  // get categories
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
  }, [categoriesByStaffResponse]);

  const getCategoriesByStaff = (staffId, cb) => {
    // if (!staffId) return;
    categoriesByStaffRequest(staffId);
  };

  // get services
  const [
    servicesByStaffRequest,
    { currentData: servicesByStaffResponse, isLoading: isGetServiceByStaff },
  ] = harmonyApi.useLazyGetServiceByStaffQuery();

  React.useEffect(() => {
    const { codeNumber, codeStatus, data, message } =
      servicesByStaffResponse || {};
    if (statusSuccess(codeStatus)) {
      dispatchLocal(CheckoutState.setServiceByStaff(data));
    } else if (codeNumber === 404 && statusNotfound(codeStatus)) {
      alert(message);
    }
  }, [servicesByStaffResponse]);

  // get product
  const [
    productByStaffRequest,
    { currentData: productByStaffResponse, isLoading: isGetProductByStaff },
  ] = harmonyApi.useLazyGetProductByStaffQuery();

  React.useEffect(() => {
    const { codeStatus, data, message, codeNumber } =
      productByStaffResponse || {};
    if (statusSuccess(codeStatus)) {
      dispatchLocal(CheckoutState.setProductByStaff(data));
    } else if (codeNumber === 404 && statusNotfound(codeStatus)) {
      alert(message);
    }
  }, [productByStaffResponse]);

  return {
    isGetCategoriesByStaff,
    getCategoriesByStaff,
    isGetServiceByStaff,
    getServiceByStaff: servicesByStaffRequest,
    isGetProductByStaff,
    getProductByStaff: productByStaffRequest,
  };
};
