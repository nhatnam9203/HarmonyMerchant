import React from "react";
import { Layout } from "./Layout";
import { useBookingProps } from "./useBookingProps";
import { createScreenComponent } from "@shared/helpers/createScreenComponent";
import { ScreenName } from "@src/ScreenName";

export const BookAppointment = createScreenComponent(
  ScreenName.SALON.BOOKING,
  (props) => <Layout {...useBookingProps(props)} />,
  {
    title: "",
  }
);
