import React from "react";
import { Layout } from "./Layout";
import { useProps } from "./useProps";
import { createScreenComponent } from "@shared/helpers/createScreenComponent";

export const EditAddressPage = createScreenComponent(
  "retailer.address.edit",
  (props) => <Layout {...useProps(props)} />,
  {
    title: "Edit Address",
  }
);
