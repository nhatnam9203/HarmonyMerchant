import { appMerchant } from "@redux/slices";
import useAxios from "axios-hooks";
import React from "react";
import { useDispatch } from "react-redux";
export const useEditPromotionCustomer = () => {
  const dispatch = useDispatch();

  const [{ data: promotionCustomerEdit, loading, error, response }, execute] =
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

  const editPromotionCustomer = (merchantPromotionId, params) => {
    execute({
      url: `customer/canbesendpromotion?merchantPromotionId=${merchantPromotionId}`,
      params: params,
    });
  };

  return [promotionCustomerEdit, editPromotionCustomer];
};
