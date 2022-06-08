import React from "react";
import { createScreenComponent } from "@shared/helpers/createScreenComponent";
import { Layout } from "./Layout";
import { useProps } from "./useProps";
import { CustomDrawerIcon } from "@shared/components/CustomDrawerContent";
import IMAGE from "@resources";
import { ScreenName } from "@src/ScreenName";

const SCREEN_KEY = "Home";

export const SalonHomeScreen = createScreenComponent(
  ScreenName.SALON.HOME_SCREEN,
  (props) => <Layout {...useProps(props)} />,
  {
    drawerIcon: ({ focused }) => (
      <CustomDrawerIcon
        source={focused ? IMAGE[`Se_${SCREEN_KEY}`] : IMAGE[SCREEN_KEY]}
      />
    ),
    title: "Home",
  }
);
