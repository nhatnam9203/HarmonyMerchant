import useAxios from "axios-hooks";
import { RETAILER_REPORT_SALES } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useReportSaleOrder = () => {
  const dispatch = useDispatch();

  const [{ data: reportSalesOrder, loading, error, response }, execute] =
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

  const getReportSalesOrder = (params) => {
    execute({
      params: params,
      url: `${RETAILER_REPORT_SALES.url}/order`,
    });
  };

  return [reportSalesOrder, getReportSalesOrder];
};
