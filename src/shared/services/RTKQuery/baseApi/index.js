import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { appointmentBuilder } from "./appointment";

export const harmonyApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: "",
  }),
  endpoints: (builder) => {
    const appointmentBuilders = appointmentBuilder(builder);

    return {
      ...appointmentBuilders,
    };
  },
});

export const { useGetAppointmentQuery, usePrefetch } = harmonyApi;
