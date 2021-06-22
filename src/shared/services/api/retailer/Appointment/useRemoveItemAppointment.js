import useAxios from "axios-hooks";
import { RETAILER_ORDER } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export const useRemoveItemAppointment = () => {
  const dispatch = useDispatch();

  const appointmentId = useSelector(
    (state) => state.basketRetailer.appointmentId
  );

  const [{ data: appointmentRemove, loading, error, response }, execute] =
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

  const removeItemAppointment = (itemId) => {
    execute({
      url: `${RETAILER_ORDER.url}/temp/${appointmentId}/removeitem/${itemId}`,
    });
  };

  return [appointmentRemove, removeItemAppointment];
};
