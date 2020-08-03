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

function OverallTab({ style, showBackButton }, ref) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  /**refs */
  const tabLayoutRef = useRef(null);
  const overallTabRef = useRef(null);
  const overallStatisticsRef = useRef(null);

  /**state */
  const [isShowCalendar, showCalendar] = useState(false);
  const [titleTimeRange, setTitleTimeRange] = useState("This Week");
  const [urlTimeRange, setUrlTimeRange] = useState("thisWeek");
  const [statisticItem, setStatisticItem] = useState([]);
  const [overallCurrentTab, setOverallCurrentTab] = useState(0);

  // public func
  useImperativeHandle(ref, () => ({
    goBack: onGoOverallTab,
    didBlur: () => {
      // setTitleRangeTime("This week");
    },
    didFocus: () => {
      // console.log("====> screen report -> staff didFocus");
    },
  }));

  /**func */
  const onTimeRangeChanged = async (titleTime, urlTime) => {
    await setUrlTimeRange(urlTime);
    await setTitleTimeRange(titleTime);

    showCalendar(false);
  };

  const onGoStatistics = (item) => {
    tabLayoutRef.current.goNext();

    setStatisticItem(item);
  };

  const onGoOverallTab = () => {
    tabLayoutRef.current.goBack();
  };

  const getTabTitle = () => {
    if (!overallTabRef) return "";
    return overallTabRef.current.getCurrentTabTitle();
  };

  const onOverallChangeTab = (index) => {
    setOverallCurrentTab(index);
  };

  return (
    <View style={style}>
      <ReportTabLayout
        ref={tabLayoutRef}
        onCalendarClose={onTimeRangeChanged}
        showCalendar={isShowCalendar}
        showBackButton={showBackButton}
      >
        <OverallReportTab
          ref={overallTabRef}
          style={{ flex: 1, paddingTop: 10 }}
          showCalendar={() => showCalendar(true)}
          titleRangeTime={titleTimeRange}
          urlRangeTime={urlTimeRange}
          tabLabel={"overallTab"}
          onGoStatistics={onGoStatistics}
          onChangeTab={onOverallChangeTab}
        />
        <OverallStatistic
          // ref={overallStatisticsRef}
          style={{ flex: 1, paddingTop: 10 }}
          showCalendar={() => showCalendar(true)}
          titleRangeTime={titleTimeRange}
          urlRangeTime={urlTimeRange}
          tabLabel={"overallStatistic"}
          getTitle={getTabTitle}
          item={statisticItem}
          tabIndex={overallCurrentTab}
        />
      </ReportTabLayout>
    </View>
  );
}

export default OverallTab = forwardRef(OverallTab);
