import { appMerchant } from "@redux/slices";
import useAxios from "axios-hooks";
import React from "react";
import { useDispatch } from "react-redux";

export const useStaffLogTimeDelete = () => {
  const dispatch = useDispatch();

  const [{ data: staffLogTimeDelete, loading, error, response }, execute] =
    useAxios(
      { method: "DELETE" },
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

  const deleteStaffLogTime = (id) => {
    execute({
      data: data,
      url: `MerchantStaffLogtime/delete/${id}`,
    });
  };

  return [staffLogTimeDelete, deleteStaffLogTime];
};
