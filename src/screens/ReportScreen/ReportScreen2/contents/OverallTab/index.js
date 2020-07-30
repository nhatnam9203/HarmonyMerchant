import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { View, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import ScrollableTabView from "react-native-scrollable-tab-view";
import IMAGE from "@resources";
import { localize } from "@utils";

import OverallReportTab from "./OverallTab";
import OverallStatistic from "./OverallStatistic";

export default function OverallTab({ style }) {
  /**refs */
  const scrollPage = useRef(null);

  /**redux */
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  /**state */
  const [currentTab, setCurrentTab] = useState(0);

  // callback  when scroll tab change
  const onChangeTab = (tabIndex) => {
    setCurrentTab(tabIndex.i);
    // showBackButton(tabIndex.i !== 0);
  };

  /**render */
  return (
    <View style={style}>
      <ScrollableTabView
        ref={scrollPage}
        initialPage={0}
        locked={true}
        renderTabBar={() => <View />}
        style={{ flex: 1 }}
        tabBarPosition="bottom"
        springTension={1}
        springFriction={1}
        onChangeTab={onChangeTab}
      >
        <OverallReportTab style={{ flex: 1, paddingTop: 10 }} />
        <OverallStatistic style={{ flex: 1, paddingTop: 10 }} />
      </ScrollableTabView>
    </View>
  );
}
