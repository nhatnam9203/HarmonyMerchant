import useAxios from "axios-hooks";
import { RETAILER_ORDER } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useAppointmentTempUpdateItem = () => {
  const dispatch = useDispatch();

  const [
    { data: appointmentTempProductItemUpdate, loading, error, response },
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

  const appointmentTempUpdateProductItem = (
    appointmentId,
    productItemId,
    data
  ) => {
    execute({
      data: data,
      url: `${RETAILER_ORDER.url}/temp/${appointmentId}/updateitem/${productItemId}`,
    });
  };

  return [appointmentTempProductItemUpdate, appointmentTempUpdateProductItem];
};
