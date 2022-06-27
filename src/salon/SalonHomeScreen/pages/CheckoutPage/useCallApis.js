import { harmonyApi } from "@shared/services";
import { useQueryCallback } from "@shared/services/RTKQuery";
import * as CheckoutState from "./SalonCheckoutState";

export const useCallApis = ({ dispatchLocal }) => {
  //   const getCategoriesByStaffCallback = React.useRef(null);

  // get categories

  const [categoriesByStaffRequest, { loading: isGetCategoriesByStaff }] =
    useQueryCallback(harmonyApi.useLazyGetCategoriesByStaffQuery, (result) => {
      const { data } = result || {};
      dispatchLocal(CheckoutState.setCategories(data));
    });

  const getCategoriesByStaff = (staffId, cb) => {
    // if (!staffId) return;
    categoriesByStaffRequest(staffId);
  };

  // get services
  const [servicesByStaffRequest, { loading: isGetServiceByStaff }] =
    useQueryCallback(
      harmonyApi.useLazyGetServiceByStaffQuery,
      (result) => {
        dispatchLocal(CheckoutState.setServiceByStaff(result?.data));
      },
      (error) => {
        dispatchLocal(CheckoutState.setServiceByStaff([]));
        if (error?.message) alert(error.message);
      }
    );

  // get product
  const [productByStaffRequest, { loading: isGetProductByStaff }] =
    useQueryCallback(
      harmonyApi.useLazyGetProductByStaffQuery,
      (result) => {
        dispatchLocal(CheckoutState.setProductByStaff(result?.data));
      },
      (error) => {
        dispatchLocal(CheckoutState.setProductByStaff([]));
        if (error?.message) alert(error.message);
      }
    );

  return {
    isGetCategoriesByStaff,
    getCategoriesByStaff,
    isGetServiceByStaff,
    getServiceByStaff: servicesByStaffRequest,
    isGetProductByStaff,
    getProductByStaff: productByStaffRequest,
  };
};
