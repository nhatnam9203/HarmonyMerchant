import useAxios from "axios-hooks";
import { RETAILER_ORDER } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useGetAppointmentByCustomer = () => {
  const dispatch = useDispatch();

  const [{ data: appointmentByCustomer, loading, error, response }, execute] =
    useAxios(
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

  const getAppointmentByCustomer = (customerId, params) => {
    execute({
      url: `${RETAILER_ORDER.url}/getByCustomer/${customerId}`,
      params: params,
    });
  };

  return [appointmentByCustomer, getAppointmentByCustomer];
};
