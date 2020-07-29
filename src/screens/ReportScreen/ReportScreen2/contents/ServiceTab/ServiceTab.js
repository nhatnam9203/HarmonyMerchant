import React from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";

import IMAGE from "@resources";
import { localize } from "@utils";
import { CustomScrollTab } from "../../widget";

import SalesByServiceRp from "./report/SalesByServiceRP";
import SalesByCategoryRP from "./report/SalesByCategoryRP";

export default function ServiceReportTab({
  style,
  showCalendar,
  titleRangeTime,
}) {
  return (
    <View style={style}>
      <CustomScrollTab>
        <SalesByServiceRp
          style={{ flex: 1, paddingTop: 10 }}
          tabLabel="Sales By Service"
          showCalendar={showCalendar}
          titleRangeTime={titleRangeTime}
        />
        <SalesByCategoryRP
          style={{ flex: 1, paddingTop: 10 }}
          tabLabel="Sales By Category"
          showCalendar={showCalendar}
          titleRangeTime={titleRangeTime}
        />
      </CustomScrollTab>
    </View>
  );
}
