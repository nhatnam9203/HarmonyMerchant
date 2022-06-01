import React from "react";
import { Layout } from "./Layout";
import { useProps } from "./useProps";
import { createScreenComponent } from "@shared/helpers/createScreenComponent";
import { ScreenName } from "@src/ScreenName";

export const AppointmentLayout = createScreenComponent(
  ScreenName.SALON.APPOINTMENT_LAYOUT,
  (props) => <Layout {...useProps(props)} />,
  {
    title: "APPOINTMENT",
  }
);
