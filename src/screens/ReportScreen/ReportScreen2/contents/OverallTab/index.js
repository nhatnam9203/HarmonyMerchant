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

import { ReportTabLayout } from "../../widget";

import OverallReportTab from "./OverallTab";
import OverallStatistic from "./OverallStatistic";

export default function OverallTab({ style }) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);
  /**state */
  const [isShowCalendar, showCalendar] = useState(false);
  const [titleTimeRange, setTitleTimeRange] = useState("This Week");
  /**func */
  const onTimeRangeChanged = async (timeRange) => {
    if (setTitleTimeRange && timeRange !== titleTimeRange) {
      await setTitleTimeRange(timeRange);
    }
    showCalendar(false);
  };

  return (
    <View style={style}>
      <ReportTabLayout
        onCalendarClose={onTimeRangeChanged}
        showCalendar={isShowCalendar}
      >
        <OverallReportTab
          style={{ flex: 1, paddingTop: 10 }}
          showCalendar={() => showCalendar(true)}
          titleRangeTime={titleTimeRange}
        />
        <OverallStatistic
          style={{ flex: 1, paddingTop: 10 }}
          showCalendar={() => showCalendar(true)}
          titleRangeTime={titleTimeRange}
        />
      </ReportTabLayout>
    </View>
  );
}
