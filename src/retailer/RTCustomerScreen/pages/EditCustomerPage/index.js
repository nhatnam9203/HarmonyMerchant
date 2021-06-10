import React from "react";
import { Layout } from "./Layout";
import { useProps } from "./useProps";
import { createScreenComponent } from "@shared/helpers/createScreenComponent";

export const EditCustomerPage = createScreenComponent(
  "retailer.customer.edit",
  (props) => <Layout {...useProps(props)} />,
  {
    title: "Edit Customer",
  }
);
