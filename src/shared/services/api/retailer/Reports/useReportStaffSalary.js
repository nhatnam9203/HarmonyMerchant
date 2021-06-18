import useAxios from "axios-hooks";
import { RETAILER_STAFF } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useReportStaffSalary = () => {
  const dispatch = useDispatch();

  const [{ data: reportStaffSalary, loading, error, response }, execute] =
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

  const getReportStaffSalary = (params) => {
    execute({
      params: params,
      url: `${RETAILER_STAFF.url}/salary`,
    });
  };

  return [reportStaffSalary, getReportStaffSalary];
};
