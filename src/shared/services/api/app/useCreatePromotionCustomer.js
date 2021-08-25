import { appMerchant } from "@redux/slices";
import useAxios from "axios-hooks";
import React from "react";
import { useDispatch } from "react-redux";
export const useCreatePromotionCustomer = () => {
  const dispatch = useDispatch();

  const [{ data: promotionCustomerCreate, loading, error, response }, execute] =
    useAxios(
      { method: "PUT" },
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

  const createPromotionCustomer = (merchantPromotionId, data) => {
    execute({
      url: `customer/canbesendpromotion?merchantPromotionId=${merchantPromotionId}`,
      data: data,
    });
  };

  return [promotionCustomerCreate, createPromotionCustomer];
};
