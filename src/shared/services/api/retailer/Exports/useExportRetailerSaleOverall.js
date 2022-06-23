import { useAxiosReport } from "@shared/services/api/useAxiosReport";
import { RETAILER_REPORT_PRODUCT } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useExportRetailerSaleOverall = () => {
  const dispatch = useDispatch();

  const [{ data: saleOverallExport, loading, error, response }, execute] =
    useAxiosReport(
      { method: "GET" },
      {
        manual: true,
      }
    );

  React.useEffect(() => {
    if (loading) {
      dispatch(appMerchant.showExportLoading());
    }
    if (!loading && response) {
      dispatch(appMerchant.hideExportLoading());
    }
  }, [saleOverallExport?.data, dispatch, loading, response]);

  const exportRetailerSaleOverall = (params) => {
    execute({
      params: params,
      url: `retailer/Appointment/report/sale/overall/export`,
    });
  };

  return [saleOverallExport, exportRetailerSaleOverall];
};
