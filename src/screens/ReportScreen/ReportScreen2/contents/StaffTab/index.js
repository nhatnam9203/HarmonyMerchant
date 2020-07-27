import React, { useRef } from "react";
import { View } from "react-native";
import ScrollableTabView from "react-native-scrollable-tab-view";

import StaffSalaryTab from "./StaffSalaryTab";
import StaffStatistic from "./StaffStatistic";

export default function StaffTab({ style }) {
  const scrollable = useRef(null);

  const goNext = () => {
    scrollable.current.goToPage(1);
  };

  const goBack = () => {
    scrollable.current.goToPage(0);
  };

  return (
    <ScrollableTabView
      ref={scrollable}
      initialPage={0}
      locked={true}
      renderTabBar={() => <View />}
      style={{ flex: 1 }}
      tabBarPosition="bottom"
      springTension={1}
      springFriction={1}
      // onChangeTab={onChangeTab}
    >
      <StaffSalaryTab
        style={{ flex: 1, padding: 10 }}
        onGoStatistics={goNext}
      />
      <StaffStatistic style={{ flex: 1, padding: 10 }} onGoSalary={goBack} />
    </ScrollableTabView>
  );
}
