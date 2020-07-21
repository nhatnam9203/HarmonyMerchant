import React from "react";
import { View } from "react-native";

import IMAGE from "@resources";
import { HeaderTitle, HeaderTooltip, PopupButton } from "../widget";

export default function StaffSalaryTab({ style }) {
  return (
    <View style={style}>
      <HeaderTitle title="STAFF SALARY" />
      <HeaderTooltip>
        <PopupButton text="Last Week Last Week Last Week" />
        <PopupButton text="All Staff" imageSrc={IMAGE.Report_Dropdown_Arrow} />
        <PopupButton text="Export" imageSrc={IMAGE.Report_Export} />
      </HeaderTooltip>
    </View>
  );
}
