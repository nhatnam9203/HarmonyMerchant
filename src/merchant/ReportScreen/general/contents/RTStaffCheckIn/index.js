import IMAGE from "@resources";
import { CustomDrawerIcon } from "@shared/components/CustomDrawerContent";
import { createScreenComponent } from "@shared/helpers/createScreenComponent";
import React from "react";
import { Layout } from "./Layout";
import { useProps } from "./useProps";

const SCREEN_KEY = "Timekeeping";

export const RTStaffCheckIn = createScreenComponent(
  "reatiler.staff_checkin",
  (props) => <Layout {...useProps(props)} />,
  {
    drawerIcon: ({ focused }) => (
      <CustomDrawerIcon
        source={focused ? IMAGE[`Se_${SCREEN_KEY}`] : IMAGE[SCREEN_KEY]}
      />
    ),
    title: "Staff check in",
  }
);
