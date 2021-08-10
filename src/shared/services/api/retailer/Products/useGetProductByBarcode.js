import useAxios from "axios-hooks";
import { RETAILER_PRODUCTS } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useGetProductsByBarcode = () => {
  const dispatch = useDispatch();

  const [{ data: productItemGet, loading, error, response }, execute] =
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

  const getProductsByBarcode = (barcode) => {
    execute({
      url: `${RETAILER_PRODUCTS.url}/getbybarcode/${barcode}`,
    });
  };

  return [productItemGet, getProductsByBarcode];
};
