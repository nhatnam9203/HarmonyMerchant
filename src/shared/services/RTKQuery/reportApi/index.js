import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosReportQuery } from "../axiosReportQuery";
import { staffBuilder } from "./staff";

export const reportApi = createApi({
  baseQuery: axiosReportQuery({
    baseUrl: "",
  }),
  endpoints: (builder) => {
    const staffBuilders = staffBuilder(builder);

    return {
      ...staffBuilders,
    };
  },
});
