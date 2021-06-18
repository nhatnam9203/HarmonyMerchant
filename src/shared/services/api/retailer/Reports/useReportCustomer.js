import useAxios from "axios-hooks";
import { RETAILER_APPOINTMENT_REPORT } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useReportCustomer = () => {
  const dispatch = useDispatch();

  const [{ data: reportCustomer, loading, error, response }, execute] =
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

  const getReportCustomer = (params) => {
    execute({
      params: params,
      url: `${RETAILER_APPOINTMENT_REPORT.url}/customerSales`,
    });
  };

  return [reportCustomer, getReportCustomer];
};
