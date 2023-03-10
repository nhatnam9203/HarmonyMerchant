import React from "react";
import { Layout } from "./Layout";
import { useProps } from "./useProps";
import { createScreenComponent } from "@shared/helpers/createScreenComponent";

export const OrderTabPage = createScreenComponent(
  "retailer.home.order",
  (props) => <Layout {...useProps(props)} />,
  {
    title: "Order",
  }
);
