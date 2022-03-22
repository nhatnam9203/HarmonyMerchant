import { useAxiosReport } from "@shared/services/api/useAxiosReport";
import { RETAILER_ORDER } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useExportStaffLogTime = () => {
  const dispatch = useDispatch();

  const [{ data: staffLogTimeExport, loading, response }, execute] = useAxiosReport(
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
  }, [dispatch, loading, response]);

  const exportStaffLogTime = (params) => {
    execute({
      params,
      url: `merchantstafflogtime/export`,
    });
  };

  return [staffLogTimeExport, exportStaffLogTime];
};
