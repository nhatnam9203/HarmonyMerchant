import React from "react";
import { Layout } from "./Layout";
import { useProps } from "./useProps";
import { createScreenComponent } from "@shared/helpers/createScreenComponent";
import { ScreenName } from "@src/ScreenName";

export const BookAppointment = createScreenComponent(
  ScreenName.SALON.BOOKING,
  (props) => <Layout {...useProps(props)} />,
  {
    title: "",
  }
);
