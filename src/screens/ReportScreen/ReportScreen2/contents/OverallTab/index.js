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

const FILTER_NAME_DEFAULT = "All Method";

function OverallTab({ style, showBackButton }, ref) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);
  const overallPaymentMethodList = useSelector(
    (state) => state.report.overallPaymentMethodList
  );

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
  const [filterNameItem, setFilterNameItem] = useState(null);

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

  const onGoStatistics = async (item) => {
    await setStatisticItem(item);
    tabLayoutRef.current.goNext();
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

  // create filter name data
  const bindStaffNameFilter = () => {
    if (!overallPaymentMethodList) return [];

    let array = [];

    // if (currentTab === 0) {
    //   array.push({ value: localize(FILTER_NAME_DEFAULT, language) });
    // }

    // const arrMap = overallPaymentMethodList.map((staff) => ({
    //   value: staff.name,
    //   ...staff,
    // }));
    // array.push(...arrMap);

    return array;
  };

  const onChangeFilterName = async (text) => {
    await setFilterNameItem(text);
    // if (currentTab === 1) {
    //   const item = listStaffsSalary.find((staff) => staff.name === text);
    //   if (item) {
    //     dispatch(actions.staff.getListStaffCalendar(item.staffId));
    //   }
    // }
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
          onChangeFilterName={onChangeFilterName}
          dataNameFilter={bindStaffNameFilter()}
          filterNameItem={filterNameItem}
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
          onChangeFilterName={onChangeFilterName}
          dataNameFilter={bindStaffNameFilter()}
          filterNameItem={filterNameItem}
        />
      </ReportTabLayout>
    </View>
  );
}

export default OverallTab = forwardRef(OverallTab);
