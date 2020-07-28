import React from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";

import IMAGE from "@resources";
import { localize } from "@utils";
import { CustomScrollTab } from "../../widget";

import MarketingEfficiencyRp from "./report/MarketingEfficiencyRP";
import PaymentMethodRp from "./report/PaymentMethodRP";

export default function OverallReportTab({ style }) {
  return (
    <View style={style}>
      <CustomScrollTab>
        <PaymentMethodRp tabLabel="Payment Method" />
        <MarketingEfficiencyRp tabLabel="Marketing Efficiency" />
      </CustomScrollTab>
    </View>
  );
}
