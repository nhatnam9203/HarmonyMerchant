import useAxios from "axios-hooks";
import { RETAILER_ORDER } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export const useAddItemAppointmentTemp = () => {
  const dispatch = useDispatch();

  const appointmentTempId = useSelector(
    (state) => state.basketRetailer.appointmentTempId
  );

  const [{ data: appointmentTempItemAdd, loading, error, response }, execute] =
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

  const addItemAppointmentTemp = (productItem) => {
    execute({
      url: `${RETAILER_ORDER.url}/temp/${appointmentTempId}/additem`,
      data: productItem,
    });
  };

  return [appointmentTempItemAdd, addItemAppointmentTemp];
};
