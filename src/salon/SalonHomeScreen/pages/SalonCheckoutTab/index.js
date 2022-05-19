import React from "react";
import { Layout } from "./Layout";
import { useProps } from "./useProps";
import { createScreenComponent } from "@shared/helpers/createScreenComponent";
import { ScreenName } from "@src/ScreenName";

export const SalonCheckoutTab = createScreenComponent(
  ScreenName.SALON.CHECK_OUT,
  (props) => <Layout {...useProps(props)} />,
  {
    title: "CHECK-OUT",
  }
);
