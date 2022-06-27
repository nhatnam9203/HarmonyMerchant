import React from "react";
import { Layout } from "./Layout";
import { useCheckoutProps } from "./useCheckoutProps";
import { createScreenComponent } from "@shared/helpers/createScreenComponent";
import { ScreenName } from "@src/ScreenName";

export const CheckoutPage = createScreenComponent(
  ScreenName.SALON.CHECK_OUT,
  (props) => <Layout {...useCheckoutProps(props)} />,
  {
    title: "CHECK-OUT",
  },
  {
    tabPress: (e) => {
      // Prevent default action
      // e.preventDefault();
    },
  }
);
