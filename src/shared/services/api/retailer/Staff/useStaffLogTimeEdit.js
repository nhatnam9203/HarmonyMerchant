import { appMerchant } from "@redux/slices";
import useAxios from "axios-hooks";
import React from "react";
import { useDispatch } from "react-redux";

export const useStaffLogTimeEdit = () => {
  const dispatch = useDispatch();

  const [{ data: staffLogTimeEdit, loading, error, response }, execute] =
    useAxios(
      { method: "PUT" },
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

  const editStaffLogTime = (id, params) => {
    execute({
      params: params,
      url: `MerchantStaffLogtime/${id}`,
    });
  };

  return [staffLogTimeEdit, editStaffLogTime];
};
