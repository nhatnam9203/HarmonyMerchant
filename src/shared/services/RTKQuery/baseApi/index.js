import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { appointmentBuilder } from "./appointment";
import { staffBuilder } from "./staff";
import { merchantBuilder } from "./merchant";
import { retailerBuilder } from "./retailer";
import { categoryBuilder } from "./category";
import { serviceBuilder } from "./service";
import { productBuilder } from "./product";

export const harmonyApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: "",
  }),
  endpoints: (builder) => {
    const appointmentBuilders = appointmentBuilder(builder);
    const staffBuilders = staffBuilder(builder);
    const merchantBuilders = merchantBuilder(builder);
    const retailerBuilders = retailerBuilder(builder);
    const categoryBuilders = categoryBuilder(builder);
    const serviceBuilders = serviceBuilder(builder);
    const productBuilders = productBuilder(builder);

    return {
      ...appointmentBuilders,
      ...staffBuilders,
      ...merchantBuilders,
      ...retailerBuilders,
      ...categoryBuilders,
      ...serviceBuilders,
      ...productBuilders,
    };
  },
});
