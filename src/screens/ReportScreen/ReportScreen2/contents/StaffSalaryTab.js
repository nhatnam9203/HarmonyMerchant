import React from "react";
import { View, Text } from "react-native";
import { HeaderTitle, HeaderTooltip, DateTimePickerButton } from "../widget";

export default function StaffSalaryTab({ style }) {
  return (
    <View style={style}>
      <HeaderTitle title="STAFF SALARY" />
      <HeaderTooltip>
        <DateTimePickerButton timeText="Last Week" />
        <DateTimePickerButton />
      </HeaderTooltip>
    </View>
  );
}
