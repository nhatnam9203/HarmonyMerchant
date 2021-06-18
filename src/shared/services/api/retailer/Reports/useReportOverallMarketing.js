import useAxios from "axios-hooks";
import { RETAILER_OVERALL } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useReportOverallMarketing = () => {
  const dispatch = useDispatch();

  const [{ data: reportOverallMarketing, loading, error, response }, execute] =
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

  const getReportOverallMarketing = (params) => {
    execute({
      params: params,
      url: `${RETAILER_OVERALL.url}/marketingEfficiency`,
    });
  };

  return [reportOverallMarketing, getReportOverallMarketing];
};
