import useAxios from "axios-hooks";
import { RETAILER_APPOINTMENT } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useUpdateAppointmentTax = () => {
  const dispatch = useDispatch();

  const [{ data: updateAppointmentTaxData, loading, error, response }, execute] = useAxios(
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

  const updateAppointmentTax = (isTax, appointmentId) => {
    execute({
      data: {isTax},
      url: `${RETAILER_APPOINTMENT.url}/taxupdate/${appointmentId}`,
    });
  };

  return [updateAppointmentTaxData, updateAppointmentTax];
};
