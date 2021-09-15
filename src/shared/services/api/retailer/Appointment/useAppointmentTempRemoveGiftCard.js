import useAxios from "axios-hooks";
import { RETAILER_ORDER } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export const useAppointmentTempRemoveGiftCard = () => {
  const dispatch = useDispatch();

  const appointmentTempId = useSelector(
    (state) => state.basketRetailer.appointmentTempId
  );

  const [
    { data: appointmentTempGiftCardRemove, loading, error, response },
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

  const removeAppointmentTempGiftCard = (giftCardId) => {
    execute({
      url: `${RETAILER_ORDER.url}/temp/${appointmentTempId}/removegiftcard/${giftCardId}`,
    });
  };

  return [appointmentTempGiftCardRemove, removeAppointmentTempGiftCard];
};
