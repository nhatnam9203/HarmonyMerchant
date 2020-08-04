import React, { useState, forwardRef, useImperativeHandle } from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";

import IMAGE from "@resources";
import { localize } from "@utils";
import { CustomScrollTab } from "../../widget";

import MarketingEfficiencyRp from "./report/MarketingEfficiencyRP";
import PaymentMethodRp from "./report/PaymentMethodRP";

function OverallReportTab(
  {
    style,
    showCalendar,
    titleRangeTime,
    urlRangeTime,
    onGoStatistics,
    ...props
  },
  ref
) {
  /**redux store */
  const language = useSelector((state) => state.dataLocal.language);

  /**state store */
  const [currentTab, setCurrentTab] = useState(0);

  const onChangeTab = (i) => {
    setCurrentTab(i);
  };

  // public func
  useImperativeHandle(ref, () => ({
    getCurrentTabTitle: () => {
      switch (currentTab) {
        case 0:
          return localize("Payment Method Statistics", language);

        default:
          return localize("Marketing Efficiency Statistics", language);
      }
    },
  }));

  return (
    <View style={style}>
      <CustomScrollTab onHeaderTabChanged={onChangeTab}>
        <PaymentMethodRp
          {...props}
          style={{ flex: 1, paddingTop: 10 }}
          tabLabel="Payment Method"
          showCalendar={showCalendar}
          titleRangeTime={titleRangeTime}
          urlRangeTime={urlRangeTime}
          onGoStatistics={onGoStatistics}
        />

        <MarketingEfficiencyRp
          {...props}
          style={{ flex: 1, paddingTop: 10 }}
          tabLabel="Marketing Efficiency"
          showCalendar={showCalendar}
          titleRangeTime={titleRangeTime}
          urlRangeTime={urlRangeTime}
          onGoStatistics={onGoStatistics}
        />
      </CustomScrollTab>
    </View>
  );
}

export default OverallReportTab = forwardRef(OverallReportTab);
