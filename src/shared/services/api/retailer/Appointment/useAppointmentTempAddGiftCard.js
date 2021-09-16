import useAxios from "axios-hooks";
import { RETAILER_ORDER } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export const useAppointmentTempAddGiftCard = () => {
  const dispatch = useDispatch();

  const appointmentTempId = useSelector(
    (state) => state.basketRetailer.appointmentTempId
  );

  const [
    { data: appointmentTempGiftCardAdd, loading, error, response },
    execute,
  ] = useAxios(
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

  const addAppointmentTempGiftCard = (data) => {
    execute({
      url: `${RETAILER_ORDER.url}/temp/${appointmentTempId}/addgiftcard`,
      data: data,
    });
  };

  return [appointmentTempGiftCardAdd, addAppointmentTempGiftCard];
};
