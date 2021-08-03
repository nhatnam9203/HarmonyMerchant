import useAxios from "axios-hooks";
import { RETAILER_PRODUCTS } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useGetAdjustHistoryList = () => {
  const dispatch = useDispatch();

  const [{ data: adjustHistoryList, loading, error, response }, execute] =
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

  const getAdjustHistoryList = (productId, params) => {
    execute({
      url: `${RETAILER_PRODUCTS.url}/adjustquantity/history/${productId}`,
      params: params
    });
  };

  return [adjustHistoryList, getAdjustHistoryList];
};
