import React from "react";
import { Layout } from "./Layout";
import { useProps } from "./useProps";
import { createScreenComponent } from "@shared/helpers/createScreenComponent";
import { ScreenName } from "@src/ScreenName";

export const PageLayout = createScreenComponent(
  ScreenName.SALON.HOME_PAGE_LAYOUT,
  (props) => <Layout {...useProps(props)} />,
  {
    title: "Salon Home",
  }
);
