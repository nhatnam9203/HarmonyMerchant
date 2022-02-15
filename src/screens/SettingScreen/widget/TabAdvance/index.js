import React from "react";
import { Layout } from "./Layout";
import { useProps } from "./useProps";
import { createScreenComponent } from "@shared/helpers/createScreenComponent";

export const TabAdvance = createScreenComponent(
  "salon.setting.tab.advance",
  (props) => <Layout {...useProps(props)} />,
  {
    title: "Advance",
  }
);
