import useAxios from "axios-hooks";
import { RETAILER_ORDER } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";
import { basketRetailer } from "@redux/slices";

export const useGetAppointmentTemp = () => {
  const dispatch = useDispatch();

  const [{ data: appointment, loading, error, response }, execute] = useAxios(
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

      dispatch(basketRetailer.setAppointmentTemp(appointment?.data));
    }
  }, [dispatch, loading, response]);

  const getAppointmentTemp = (appointmentId) => {
    execute({
      url: `${RETAILER_ORDER.url}/temp/${appointmentId}`,
    });
  };

  return [appointment, getAppointmentTemp];
};
