import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosReportQuery } from "../axiosReportQuery";
import { staffBuilder } from "./staff";
import { retailerBuilder } from "./retailer";

export const reportApi = createApi({
  baseQuery: axiosReportQuery({
    baseUrl: "",
  }),
  endpoints: (builder) => {
    const staffBuilders = staffBuilder(builder);
    const retailerBuilders = retailerBuilder(builder);

    return {
      ...staffBuilders,
      ...retailerBuilders,
    };
  },
});
