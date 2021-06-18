import useAxios from "axios-hooks";
import { RETAILER_REPORT_PRODUCT } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useReportSaleProduct = () => {
  const dispatch = useDispatch();

  const [{ data: reportSaleProduct, loading, error, response }, execute] =
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

  const getReportSaleProduct = (params) => {
    execute({
      params: params,
      url: `${RETAILER_REPORT_PRODUCT.url}/saleByProduct`,
    });
  };

  return [reportSaleProduct, getReportSaleProduct];
};
