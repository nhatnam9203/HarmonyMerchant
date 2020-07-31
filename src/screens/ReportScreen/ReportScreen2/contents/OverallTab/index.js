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
  const [urlTimeRange, setUrlTimeRange] = useState("thisWeek");
  /**func */
  const onTimeRangeChanged = async (titleTime, urlTime) => {
    console.log(titleTime);
    console.log(urlTime);

    await setUrlTimeRange(urlTime);
    await setTitleTimeRange(titleTime);

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
          urlRangeTime={urlTimeRange}
          tabLabel={"overallTab"}
        />
        <OverallStatistic
          style={{ flex: 1, paddingTop: 10 }}
          showCalendar={() => showCalendar(true)}
          titleRangeTime={titleTimeRange}
          urlRangeTime={urlTimeRange}
          tabLabel={"overallStatistic"}
        />
      </ReportTabLayout>
    </View>
  );
}
