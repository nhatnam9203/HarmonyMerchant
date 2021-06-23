import useAxios from "axios-hooks";
import { RETAILER_REPORT_PRODUCT } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useReportSaleCategory = () => {
  const dispatch = useDispatch();

  const [{ data: reportSaleCategory, loading, error, response }, execute] =
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

  const getReportSaleCategory = (params) => {
    execute({
      params: params,
      url: `${RETAILER_REPORT_PRODUCT.url}/saleByCategory`,
    });
  };

  return [reportSaleCategory, getReportSaleCategory];
};
