import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { appointmentBuilder } from "./appointment";
import { staffBuilder } from "./staff";

export const harmonyApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: "",
  }),
  endpoints: (builder) => {
    const appointmentBuilders = appointmentBuilder(builder);
    const staffBuilders = staffBuilder(builder);

    return {
      ...appointmentBuilders,
      ...staffBuilders,
    };
  },
});

export const { useGetAppointmentQuery, usePrefetch, useStaffLoginMutation } =
  harmonyApi;
