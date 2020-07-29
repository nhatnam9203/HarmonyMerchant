import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { View, Platform } from "react-native";

import RNFetchBlob from "rn-fetch-blob";
import { useSelector, useDispatch } from "react-redux";
import ScrollableTabView from "react-native-scrollable-tab-view";

import { PopupCalendar } from "@components";
import actions from "@actions";
import { localize, scaleSzie, getQuickFilterTimeRange } from "@utils";

import { PopupExportReport, PopupLoadingExportReport } from "../../widget";

import GiftCardReportTab from "./GiftCardReportTab";
import GiftCardStatistic from "./GiftCardStatistic";

export default function GiftCardTab({ style }) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  /**refs */
  const scrollPage = useRef(null);

  /**state */
  const [currentTab, setCurrentTab] = useState(0);

  /**func */
  // callback  when scrollTab change
  const onChangeTab = (tabIndex) => {
    setCurrentTab(tabIndex.i);
    // showBackButton(tabIndex.i !== 0);
  };

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
        <GiftCardReportTab style={{ flex: 1, paddingTop: 10 }} />
        <GiftCardStatistic style={{ flex: 1, paddingTop: 10 }} />
      </ScrollableTabView>
    </View>
  );
}
