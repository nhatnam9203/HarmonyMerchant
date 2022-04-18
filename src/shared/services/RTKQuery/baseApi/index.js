import { createApi } from "@reduxjs/toolkit/query";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { appointmentBuilder } from "./appointment";

const harmonyApi = createApi({
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

export const { useGetAppointmentQuery } = harmonyApi;
