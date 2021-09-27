import useAxios from "axios-hooks";
import { RETAILER_ORDER } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useAppointmentUpdateItem = () => {
  const dispatch = useDispatch();

  const [
    { data: appointmentProductItemUpdate, loading, error, response },
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

  const appointmentUpdateProductItem = (appointmentId, productItemId, data) => {
    execute({
      data: data,
      url: `${RETAILER_ORDER.url}/${appointmentId}/updateitem/${productItemId}`,
    });
  };

  return [appointmentProductItemUpdate, appointmentUpdateProductItem];
};
