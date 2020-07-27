import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
} from "react";
import { View } from "react-native";

import { useSelector, useDispatch } from "react-redux";
import ScrollableTabView from "react-native-scrollable-tab-view";

import {
  Text,
  StatusBarHeader,
  Button,
  ParentContainer,
  PopupCheckStaffPermission,
  PopupCalendar,
} from "@components";
import actions from "@actions";
import { localize, scaleSzie, getQuickFilterTimeRange } from "@utils";

import StaffSalaryTab from "./StaffSalaryTab";
import StaffStatistic from "./StaffStatistic";

function StaffTab({ style, showBackButton }, ref) {
  const dispatch = useDispatch();

  const scrollable = useRef(null);
  const modalCalendarRef = useRef(null);

  /**state */
  const [visibleCalendar, setVisibleCalendar] = useState(false);
  const [titleRangeTime, setTitleRangeTime] = useState("This week");

  /**func */
  const goNext = () => {
    scrollable.current.goToPage(1);
    if (showBackButton) {
      showBackButton(true);
    }
  };

  const goBack = () => {
    scrollable.current.goToPage(0);
    if (showBackButton) {
      showBackButton(false);
    }
  };

  useImperativeHandle(ref, () => ({
    goBack: goBack,
  }));

  const searchStaffSalary = useCallback(
    (url) => dispatch(actions.staff.getListStaffsSalaryTop(url, true)),
    [dispatch]
  );

  const searchStaff = () => {
    const {
      isCustomizeDate,
      startDate,
      endDate,
      quickFilter,
    } = modalCalendarRef.current.state;

    let url;

    if (isCustomizeDate) {
      url = `timeStart=${startDate}&timeEnd=${endDate}`;
    } else {
      const filter = quickFilter === false ? "This Week" : quickFilter;
      // console.log("quickFilter", quickFilter);
      url = `quickFilter=${getQuickFilterTimeRange(filter)}`;
    }

    // searchStaffSalary(url);
    dispatch(actions.staff.getListStaffsSalaryTop(url, true));
  };

  const changeTitleTimeRange = async (title) => {
    setVisibleCalendar(false);
    setTitleRangeTime(title !== "Time Range" ? title : "All time");
    searchStaff();
  };

  return (
    <>
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
          titleRangeTime={titleRangeTime}
          showCalendar={() => setVisibleCalendar(true)}
        />
        <StaffStatistic
          style={{ flex: 1, padding: 10 }}
          onGoSalary={goBack}
          titleRangeTime={titleRangeTime}
          showCalendar={() => setVisibleCalendar(true)}
        />
      </ScrollableTabView>

      <PopupCalendar
        type="report"
        ref={modalCalendarRef}
        visible={visibleCalendar}
        onRequestClose={() => setVisibleCalendar(false)}
        changeTitleTimeRange={changeTitleTimeRange}
        paddingLeft={scaleSzie(60)}
      />
    </>
  );
}

export default StaffTab = forwardRef(StaffTab);
