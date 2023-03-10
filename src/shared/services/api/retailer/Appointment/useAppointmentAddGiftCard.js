import useAxios from "axios-hooks";
import { RETAILER_ORDER } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export const useAppointmentAddGiftCard = () => {
  const dispatch = useDispatch();

  const appointmentId = useSelector(
    (state) => state.basketRetailer.appointmentId
  );

  const [{ data: appointmentGiftCardAdd, loading, error, response }, execute] =
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

  const addAppointmentGiftCard = (data) => {
    execute({
      url: `${RETAILER_ORDER.url}/${appointmentId}/addgiftcard`,
      data: data,
    });
  };

  return [appointmentGiftCardAdd, addAppointmentGiftCard];
};
