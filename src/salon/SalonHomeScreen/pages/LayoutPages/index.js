import React from "react";
import { Layout } from "./Layout";
import { useProps } from "./useProps";
import { createScreenComponent } from "@shared/helpers/createScreenComponent";
import { ScreenName } from "@src/ScreenName";

export const LayoutPages = createScreenComponent(
  ScreenName.SALON.HOME_TOP_TAB,
  (props) => <Layout {...useProps(props)} />,
  {
    title: "Customer List",
  }
);
