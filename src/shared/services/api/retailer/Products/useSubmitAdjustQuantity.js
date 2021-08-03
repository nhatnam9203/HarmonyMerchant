import useAxios from "axios-hooks";
import { RETAILER_PRODUCTS } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useSubmitAdjustQuantity = () => {
  const dispatch = useDispatch();

  const [{ data: adjustQuantityData, loading, error, response }, execute] =
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

  const adjustQuantity = (productId, params) => {
    execute({
      data: params,
      url: `${RETAILER_PRODUCTS.url}/adjustquantity/${productId}`,
    });
  };

  return [adjustQuantityData, adjustQuantity];
};
