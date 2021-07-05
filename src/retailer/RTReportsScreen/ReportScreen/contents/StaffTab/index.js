import actions from '@actions';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ReportLayout } from '../../widget';
import StaffReportTab from './StaffReportTab';
import StaffStatistic from './StaffStatistic';
import { colors } from '@shared/themes';

const RANGE_TIME_DEFAULT = 'This Week';

function StaffTab(
  {
    route: {
      params: { showBackButton },
    },
  },
  ref
) {
  /**redux store*/
  const dispatch = useDispatch();

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
  const [refreshing, setRefreshing] = useState(false);

  /**ref */
  const layoutRef = useRef(null);

  /**function */
  const getListStaffsSalaryTop = async () => {
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
  const onChangeTimeTitle = async (timeTitle) => {
    await setTitleRangeTime(timeTitle);
    await getListStaffsSalaryTop();
  };

  const onChangeFilterNames = (names) => {
    setFilterNames(names);
  };

  const onChangeFilterId = async (filterId) => {
    await setFilterNameItem(filterId);
  };

  const onGoStatistics = async (item) => {
    await setFilterNameItem(item.name);
    layoutRef.current?.goNext();
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
            'csv',
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
            'csv',
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
      // dispatch(actions.staff.resetDownloadExportFiles());
    },
    getListStaffsSalaryTop: () => getListStaffsSalaryTop(),
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
    setRefreshing(true);
    getListStaffsSalaryTop();
  };

  React.useEffect(() => {
    getListStaffsSalaryTop();
  }, []);

  React.useEffect(() => {
    setRefreshing(false);
  }, [listStaffsSalary]);

  return (
    <View style={styles.container}>
      <ReportLayout
        ref={layoutRef}
        style={styles.container}
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
          showExportFile={() => onShowPopupExport('StaffSalary')}
          pathFileExport={pathFileReportStaff}
          handleTheDownloadedFile={onHandleTheDownloadedFile}
          onRefresh={refreshData}
          isRefreshing={refreshing}
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
          showExportFile={() => onShowPopupExport('StaffStatistic')}
          pathFileExport={pathFileReportStaffStatistic}
          handleTheDownloadedFile={onHandleTheDownloadedFile}
          onRefresh={refreshData}
          isRefreshing={refreshing}
        />
      </ReportLayout>
    </View>
  );
}

export default StaffTab = forwardRef(StaffTab);

const styles = StyleSheet.create({
  container: { backgroundColor: colors.WHITE, flex: 1 },
});
