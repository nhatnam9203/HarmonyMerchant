import useAxios from "axios-hooks";
import { RETAILER_PRODUCTS } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useGetProducts = () => {
  const dispatch = useDispatch();

  const [{ data: products, loading, error, response }, execute] = useAxios(
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

  const getProducts = (productsId) => {
    execute({
      url: `${RETAILER_PRODUCTS.url}/${productsId}`,
    });
  };

  return [products, getProducts];
};
