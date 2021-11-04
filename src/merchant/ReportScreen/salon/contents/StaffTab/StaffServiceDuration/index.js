import actions from "@actions";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ReportLayout } from "../../../../widget";
import StaffDurationStatistic from "./StaffDurationStatistic";
import StaffDurationTab from "./StaffDurationTab";

const RANGE_TIME_DEFAULT = "This Week";

function StaffServiceDurationTab({ style, showBackButton }, ref) {
  /**redux store*/
  const dispatch = useDispatch();

  const staffServiceDurationList = useSelector(
    (state) => state.report.staffServiceDurationList
  );
  const nextPage = useSelector((state) => state.staff.listStaffsSalaryNextPage);

  const pathFileReportStaff = useSelector(
    (state) => state.report.staffServiceDurationExportPath
  );

  const pathFileReportStaffStatistic = useSelector(
    (state) => state.report.staffServiceDurationDetailExportPath
  );

  const isDownloadReportStaff = useSelector(
    (state) => state.report.isDownloadReport
  );

  /**state */
  const [titleRangeTime, setTitleRangeTime] = useState(RANGE_TIME_DEFAULT);
  const [filterNameItem, setFilterNameItem] = useState(undefined);
  const [filterNames, setFilterNames] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  /**ref */
  const layoutRef = useRef(null);

  /**function */
  const getListStaffsServiceDurationTop = async (staffId = 0) => {
    // if (page <= 0) return;

    await dispatch(
      actions.report.getReportStaffServiceDuration(
        true,
        layoutRef?.current?.getTimeUrl(),
        staffId
      )
    );
  };

  const getListStaffsServiceDurationDetail = async (staffId = 0) => {
    // if (page <= 0) return;

    await dispatch(
      actions.report.getReportStaffServiceDurationDetail(
        true,
        layoutRef?.current?.getTimeUrl(),
        staffId
      )
    );
  };

  const showCalendar = (isShow) => {
    layoutRef?.current?.showCalendar(isShow);
  };

  //callback
  const onChangeTimeTitle = async (timeTitle) => {
    await setTitleRangeTime(timeTitle);
    await getListStaffsServiceDurationTop();
  };

  const onChangeFilterNames = (names) => {
    setFilterNames(names);
  };

  const onChangeFilterId = async (filterId) => {
    const selectItem = staffServiceDurationList?.find(
      (x) => x.name === filterId
    );
    await setFilterNameItem(filterId);

    if (selectItem) {
      await getListStaffsServiceDurationDetail(selectItem.staffId);
    }
  };

  const onGoStatistics = async (item) => {
    await setFilterNameItem(item.name);
    await getListStaffsServiceDurationDetail(item.staffId);
    layoutRef.current?.goNext();
  };

  const onShowPopupExport = (title) => {
    layoutRef?.current?.showPopupExport(title);
  };

  const onRequestExportFileToServer = (currentTab, titleExportFile) => {
    switch (currentTab) {
      case 0:
        dispatch(
          actions.report.exportStaffServiceDuration(
            0,
            layoutRef?.current?.getTimeUrl(),
            true,
            "csv",
            titleExportFile
          )
        );
        break;
      case 1:
        const filterItem = staffServiceDurationList.find(
          (item) => item.name === filterNameItem
        );
        if (!filterItem) return;
        dispatch(
          actions.report.exportServiceStaffDurationDetail(
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
    layoutRef.current?.handleTheDownloadedFile(filePath);
  };

  // public function
  useImperativeHandle(ref, () => ({
    goBack: () => {
      layoutRef.current?.goBack();
      dispatch(actions.report.resetExportFiles());
    },
    getListStaffsSalaryTop: (staffId) => {
      getListStaffsServiceDurationTop(staffId);
    },
    didBlur: async () => {
      // await setTitleRangeTime(RANGE_TIME_DEFAULT);
    },
    didFocus: async () => {
      // await setTitleRangeTime(RANGE_TIME_DEFAULT);
      layoutRef?.current?.setTimeFilter(RANGE_TIME_DEFAULT);
    },
  }));

  /**effect */
  const refreshData = () => {
    // setRefreshing(true);
    // getListStaffsServiceDurationTop();
  };

  const loadMoreData = () => {
    // getListStaffsSalaryTop(nextPage);
  };

  React.useEffect(() => {
    setRefreshing(false);
  }, [staffServiceDurationList]);

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
        <StaffDurationTab
          style={{ flex: 1 }}
          tabLabel="Staff Service Duration"
          onGoStatistics={onGoStatistics}
          showCalendar={() => showCalendar(true)}
          titleRangeTime={titleRangeTime}
          onChangeFilterNames={onChangeFilterNames}
          showExportFile={() => onShowPopupExport("StaffServiceDuration")}
          pathFileExport={pathFileReportStaff}
          handleTheDownloadedFile={onHandleTheDownloadedFile}
          onRefresh={refreshData}
          isRefreshing={refreshing}
          onLoadMore={loadMoreData}
          endLoadMore={nextPage <= 0}
        />
        <StaffDurationStatistic
          style={{ flex: 1 }}
          tabLabel="Staff Service Duration Statistics"
          title="Staff Service Duration Statistics"
          titleRangeTime={titleRangeTime}
          showCalendar={() => showCalendar(true)}
          dataFilters={filterNames}
          filterId={filterNameItem}
          onChangeFilter={onChangeFilterId}
          showExportFile={() => onShowPopupExport("StafferviceDurationDetail")}
          pathFileExport={pathFileReportStaffStatistic}
          handleTheDownloadedFile={onHandleTheDownloadedFile}
          onRefresh={refreshData}
          isRefreshing={refreshing}
        />
      </ReportLayout>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default StaffServiceDurationTab = forwardRef(StaffServiceDurationTab);
