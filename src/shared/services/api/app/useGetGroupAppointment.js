import useAxios from "axios-hooks";
import { GET_ADDRESS_STATE } from "../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useGetGroupAppointment = () => {
  const dispatch = useDispatch();

  const [{ data: groupAppointmentData, loading, error, response }, execute] =
    useAxios(
      { method: "GET" },
      {
        manual: true,
      }
    );

  // React.useEffect(() => {
  //   if (loading) {
  //     dispatch(appMerchant.showLoading());
  //   }
  //   if (!loading && response) {
  //     dispatch(appMerchant.hideLoading());
  //   }
  // }, [dispatch, loading, response]);

  const getGroupAppointment = (appointmentId) => {
    execute({
      url: `appointment/getGroupById/${appointmentId}`,
    });
  };

  return [groupAppointmentData, getGroupAppointment];
};
