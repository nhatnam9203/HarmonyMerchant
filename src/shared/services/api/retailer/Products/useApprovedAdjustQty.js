import useAxios from "axios-hooks";
import { RETAILER_PRODUCTS } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useApprovedAdjustQty = () => {
  const dispatch = useDispatch();

  const [{ data: approvedAdjustQtyData, loading, error, response }, execute] =
    useAxios(
      {
        method: "PUT",
        url: `${RETAILER_PRODUCTS.url}/adjustquantity/approved`,
      },
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

  const approvedAdjustQty = (params) => {
    execute({
      data: params,
    });
  };

  return [approvedAdjustQtyData, approvedAdjustQty];
};
