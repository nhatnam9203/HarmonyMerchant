import React from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";

import IMAGE from "@resources";
import { localize } from "@utils";
import { CustomScrollTab } from "../../widget";

import SalesByProductRp from "./report/SalesByProductRP";
import SalesByCategoryRP from "./report/SalesByCategoryRP";

export default function ProductReportTab({
  style,
  showCalendar,
  titleRangeTime,
}) {
  return (
    <View style={style}>
      <CustomScrollTab>
        <SalesByProductRp
          style={{ flex: 1, paddingTop: 10 }}
          tabLabel="Sales By Product"
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
