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

import CustomerReportTab from "./CustomerReportTab";
import CustomerStatistic from "./CustomerStatistic";

export default function CustomerTab({ style }) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  /**state */
  const [isShowCalendar, showCalendar] = useState(false);
  const [titleTimeRange, setTitleTimeRange] = useState("This Week");

  /**func */
  const onTimeRangeChanged = async (titleTime, urlTime) => {
    if (setTitleTimeRange && titleTime !== titleTimeRange) {
      await setTitleTimeRange(titleTime);
      await setUrlTimeRange(urlTime);
    }

    showCalendar(false);
  };

  /**render */
  return (
    <View style={style}>
      <ReportTabLayout
        onCalendarClose={onTimeRangeChanged}
        showCalendar={isShowCalendar}
      >
        <CustomerReportTab
          style={{ flex: 1, paddingTop: 10 }}
          showCalendar={() => showCalendar(true)}
          titleRangeTime={titleTimeRange}
        />
        <CustomerStatistic
          style={{ flex: 1, paddingTop: 10 }}
          showCalendar={() => showCalendar(true)}
          titleRangeTime={titleTimeRange}
        />
      </ReportTabLayout>
    </View>
  );
}
