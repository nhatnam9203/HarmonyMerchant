import useAxios from "axios-hooks";
import { RETAILER_REPORT_SALES } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useReportSaleOverall = () => {
  const dispatch = useDispatch();

  const [{ data: reportSalesOverall, loading, error, response }, execute] =
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

  const getReportSalesOverall = (params) => {
    execute({
      params: params,
      url: `${RETAILER_REPORT_SALES.url}/overall`,
    });
  };

  return [reportSalesOverall, getReportSalesOverall];
};
