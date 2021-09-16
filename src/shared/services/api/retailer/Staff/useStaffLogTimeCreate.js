import { appMerchant } from "@redux/slices";
import useAxios from "axios-hooks";
import React from "react";
import { useDispatch } from "react-redux";
import {
  CustomerGroupTypes,
  SORT_TYPE,
  statusSuccess,
} from "@shared/utils/app";

export const useStaffLogTimeCreate = () => {
  const dispatch = useDispatch();

  const [{ data: staffLogTimeCreate, loading, error, response }, execute] =
    useAxios(
      { method: "POST" },
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

  const createStaffLogTime = (data) => {
    execute({
      data: data,
      url: `MerchantStaffLogtime`,
    });
  };

  return [staffLogTimeCreate, createStaffLogTime];
};
