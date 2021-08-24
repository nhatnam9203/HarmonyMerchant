import useAxios from "axios-hooks";
import { GET_ADDRESS_STATE } from "../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useGetPromotionCustomer = () => {
  const dispatch = useDispatch();

  const [{ data: promotionCustomerGet, loading, error, response }, execute] =
    useAxios(
      { method: "GET" },
      {
        manual: true,
      }
    );

  React.useEffect(() => {
    if (loading) {
      dispatch(appMerchant.showLoading());
    }
    if (!loading && response) {
      dispatch(appMerchant.hideLoading());
    }
  }, [dispatch, loading, response]);

  const getPromotionCustomer = (merchantPromotionId, merchantId) => {
    execute({
      url: `customer/canbesendpromotion?merchantPromotionId=${merchantPromotionId}&merchantId=${merchantId}`,
    });
  };

  return [promotionCustomerGet, getPromotionCustomer];
};
