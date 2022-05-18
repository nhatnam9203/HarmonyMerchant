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

  const getGroupAppointment = (appointmentId) => {
    execute({
      url: `appointment/getGroupById/${appointmentId}`,
    });
  };

  return [groupAppointmentData, getGroupAppointment];
};
