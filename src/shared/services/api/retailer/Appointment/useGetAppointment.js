import useAxios from "axios-hooks";
import { RETAILER_ORDER } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useGetAppointment = () => {
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
      // !! chua xu li truong hop get loi
      // dispatch({
      //   type: "GET_APPOINTMENT_BY_ID_FAIL",
      // });
      dispatch({
        type: "GET_APPOINTMENT_BY_ID_SUCCESS",
        payload: appointment?.data
      });
    }
  }, [ dispatch, loading, response]);

  const getAppointment = (appointmentId) => {
    execute({
      url: `${RETAILER_ORDER.url}/${appointmentId}`,
    });
  };

  return [appointment, getAppointment];
};
