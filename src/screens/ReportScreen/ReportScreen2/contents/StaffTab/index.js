import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { View, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import actions from "@actions";

import { ReportLayout } from "../../widget";

import StaffReportTab from "./StaffReportTab";
import StaffStatistic from "./StaffStatistic";

const RANGE_TIME_DEFAULT = "This Week";

function StaffTab({ style, showBackButton }, ref) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const listStaffsSalary = useSelector((state) => state.staff.listStaffsSalary);

  const pathFileReportStaff = useSelector(
    (state) => state.staff.pathFileReportStaffSalary
  );

  const pathFileReportStaffStatistic = useSelector(
    (state) => state.staff.pathFileReportStaffStatistic
  );

  const isDownloadReportStaff = useSelector(
    (state) => state.staff.isDownloadReportStaff
  );

  /**state */
  const [titleRangeTime, setTitleRangeTime] = useState(RANGE_TIME_DEFAULT);
  const [filterNameItem, setFilterNameItem] = useState(undefined);
  const [filterNames, setFilterNames] = useState([]);
  const [isMount, setIsMount] = useState(false);

  /**ref */
  const layoutRef = useRef(null);

  /**function */
  const getListStaffsSalaryTop = async () => {
    // console.log("======> getListStaffsSalaryTop");
    await dispatch(
      actions.staff.getListStaffsSalaryTop(
        layoutRef?.current?.getTimeUrl(),
        true
      )
    );
  };

  const showCalendar = (isShow) => {
    layoutRef?.current?.showCalendar(isShow);
  };

  //callback
  const onChangeTimeTitle = async (titmeTitle) => {
    // console.log("======> onChangeTimeTitle", titmeTitle);
    await setTitleRangeTime(titmeTitle);
    if (!isMount) {
      await setIsMount(true);
    } else {
      await getListStaffsSalaryTop();
    }
  };

  const onChangeFilterNames = (names) => {
    setFilterNames(names);
  };

  const onChangeFilterId = async (filterId) => {
    await setFilterNameItem(filterId);
  };

  const onGoStatistics = async (item) => {
    await setFilterNameItem(item.name);
    layoutRef.current.goNext();
  };

  const onShowPopupExport = (title) => {
    layoutRef?.current?.showPopupExport(title);
  };

  const onRequestExportFileToServer = (currentTab, titleExportFile) => {
    switch (currentTab) {
      case 0:
        dispatch(
          actions.staff.getExportStaffSalary(
            layoutRef?.current?.getTimeUrl(),
            true,
            "csv",
            titleExportFile
          )
        );
        break;
      case 1:
        const filterItem = listStaffsSalary.find(
          (item) => item.name === filterNameItem
        );
        if (!filterItem) return;
        dispatch(
          actions.staff.getExportStaffStatistics(
            filterItem.staffId,
            layoutRef?.current?.getTimeUrl(),
            true,
            "csv",
            titleExportFile
          )
        );
        break;
      default:
        break;
    }
  };

  const onHandleTheDownloadedFile = (filePath) => {
    layoutRef.current.handleTheDownloadedFile(filePath);
  };

  // public function
  useImperativeHandle(ref, () => ({
    goBack: () => {
      layoutRef.current.goBack();
      dispatch(actions.staff.resetDownloadExportFiles());
    },
    didBlur: async () => {
      //   setTitleRangeTime(RANGE_TIME_DEFAULT);
      await setIsMount(false);
    },
    didFocus: async () => {
      // console.log("====> screen report -> staff didFocus");
    },
  }));

  /**effect */
  useEffect(() => {
    if (!isMount) {
      layoutRef?.current?.setTimeFilter(RANGE_TIME_DEFAULT);
    }
  }, [listStaffsSalary]);

  return (
    <View style={[styles.container, style]}>
      <ReportLayout
        ref={layoutRef}
        style={style}
        showBackButton={showBackButton}
        onChangeTimeTitle={onChangeTimeTitle}
        onRequestExportFileToServer={onRequestExportFileToServer}
        isDownloadReport={isDownloadReportStaff}
      >
        <StaffReportTab
          style={{ flex: 1 }}
          tabLabel="Staff Salary"
          onGoStatistics={onGoStatistics}
          showCalendar={() => showCalendar(true)}
          titleRangeTime={titleRangeTime}
          onChangeFilterNames={onChangeFilterNames}
          showExportFile={() => onShowPopupExport("StaffSalary")}
          pathFileExport={pathFileReportStaff}
          handleTheDownloadedFile={onHandleTheDownloadedFile}
        />
        <StaffStatistic
          style={{ flex: 1 }}
          tabLabel="Staff Statistics"
          title="Staff Statistics"
          titleRangeTime={titleRangeTime}
          showCalendar={() => showCalendar(true)}
          dataFilters={filterNames}
          filterId={filterNameItem}
          onChangeFilter={onChangeFilterId}
          showExportFile={() => onShowPopupExport("StaffStatistic")}
          pathFileExport={pathFileReportStaffStatistic}
          handleTheDownloadedFile={onHandleTheDownloadedFile}
        />
      </ReportLayout>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default StaffTab = forwardRef(StaffTab);
