import useAxios from "axios-hooks";
import { RETAILER_ORDER } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useUpdateAppointmentCustomer = () => {
  const dispatch = useDispatch();

  const [
    { data: updateAppointmentCustomerData, loading, error, response },
    execute,
  ] = useAxios(
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

  const updateAppointmentCustomer = (params, appointmentId) => {
    execute({
      data: params,
      url: `${RETAILER_ORDER.url}/updateCustomer/${appointmentId}`,
    });
  };

  return [updateAppointmentCustomerData, updateAppointmentCustomer];
};
