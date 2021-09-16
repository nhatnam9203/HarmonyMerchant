import { appMerchant } from "@redux/slices";
import useAxios from "axios-hooks";
import React from "react";
import { useDispatch } from "react-redux";

export const useStaffLogTimeGet = () => {
  const dispatch = useDispatch();

  const [{ data: staffLogTime, loading, error, response }, execute] = useAxios(
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

  const getStaffLogTime = (params) => {
    execute({
      params: params,
      url: `MerchantStaffLogtime`,
    });
  };

  return [staffLogTime, getStaffLogTime];
};
