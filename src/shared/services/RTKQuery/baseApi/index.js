import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { appointmentBuilder } from "./appointment";
import { staffBuilder } from "./staff";
import { merchantBuilder } from "./merchant";
import { retailerBuilder } from "./retailer";

export const harmonyApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: "",
  }),
  endpoints: (builder) => {
    const appointmentBuilders = appointmentBuilder(builder);
    const staffBuilders = staffBuilder(builder);
    const merchantBuilders = merchantBuilder(builder);
    const retailerBuilders = retailerBuilder(builder);

    return {
      ...appointmentBuilders,
      ...staffBuilders,
      ...merchantBuilders,
      ...retailerBuilders,
    };
  },
});

export const {
  usePrefetch,
  useGetAppointmentQuery,
  useStaffLoginMutation,
  useStaffLogTimeCreateMutation,
  useStaffLogTimeReportQuery,
} = harmonyApi;
