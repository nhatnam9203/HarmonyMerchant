import { useFocusEffect } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AppLoading } from "@shared/components/AppLoading";
import { harmonyApi, reportApi } from "@shared/services";
import { colors } from "@shared/themes";
import { getTimeTitleFile, SORT_TYPE, statusSuccess } from "@shared/utils";
import { getQuickFilterTimeRange } from "@utils";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { StaffLogTimeTab } from "./StaffLogTime";
import { StaffLogTimeDetailTab } from "./StaffLogTimeDetail";
import { appMerchant } from "@redux/slices";

const RANGE_TIME_DEFAULT = "This Week";

const { Screen, Navigator } = createStackNavigator();

export const StaffLogTime = ({
  route: {
    params: { showBackButton },
  },
}) => {
  const dispatch = useDispatch();

  const exportRef = React.useRef(null);
  const calendarRef = React.useRef(null);

  const [timeVal, setTimeVal] = React.useState(null);
  const [reportData, setReportData] = React.useState([]);
  const [sortStaffName, setSortStaffName] = React.useState(SORT_TYPE.ASC);

  const [
    getStaffLogTime,
    { currentData: staffLogTimeData, isLoading: isGetStaffLogTime },
  ] = reportApi.useLazyStaffLogTimeReportQuery();

  const callGetReportStaffLogTime = React.useCallback(() => {
    // getStaffLogTime();
    getStaffLogTime({ ...timeVal });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeVal, sortStaffName]);

  React.useEffect(() => {
    const { codeStatus, data } = staffLogTimeData || {};
    if (statusSuccess(codeStatus)) {
      setReportData(data);
    }
  }, [staffLogTimeData]);

  const [
    exportStaffLogTimeReport,
    {
      currentData: exportStaffLogTimeReportData,
      isLoading: isExportStaffLogTimeReport,
    },
  ] = reportApi.useLazyExportStaffLogTimeReportQuery();

  React.useEffect(() => {
    const { codeStatus, data } = exportStaffLogTimeReportData || {};
    if (statusSuccess(codeStatus)) {
      exportRef.current?.onCreateFile(data?.path);
    }
    dispatch(appMerchant.hideExportLoading());
  }, [exportStaffLogTimeReportData]);

  React.useEffect(() => {
    if (isExportStaffLogTimeReport) {
      dispatch(appMerchant.showExportLoading());
    }
  }, [isExportStaffLogTimeReport]);

  const callExportStaffLogTimeReport = (values = {}) => {
    const params = Object.assign({}, values, {
      ...timeVal,
    });
    exportRef.current?.onSetFileName(
      getTimeTitleFile("StaffLogTimeReport", params)
    );

    exportStaffLogTimeReport(params);
  };

  useFocusEffect(
    React.useCallback(() => {
      callGetReportStaffLogTime();
    }, [timeVal, sortStaffName])
  );

  const onChangeTimeValue = (quickFilter, timeState) => {
    if (quickFilter === "Customize Date") {
      setTimeVal({
        quickFilter: "custom",
        quickFilterText: quickFilter,
        timeStart: timeState.startDate,
        timeEnd: timeState.endDate,
      });
    } else {
      setTimeVal({
        quickFilter: getQuickFilterTimeRange(quickFilter),
        quickFilterText: quickFilter,
      });
    }
  };

  const onSortWithKey = (sortKey) => {
    switch (sortKey) {
      case "staffName":
        const val =
          sortStaffName === SORT_TYPE.ASC ? SORT_TYPE.DESC : SORT_TYPE.ASC;
        setSortStaffName(val);
        break;
      default:
        break;
    }
  };

  const onRefresh = () => {};

  const onHandleExportFile = () => {
    callExportStaffLogTimeReport();
  };

  return (
    <>
      <View style={styles.container}>
        <Navigator
          headerMode="none"
          screenOptions={{
            cardStyle: {
              backgroundColor: colors.WHITE_FA,
            },
          }}
        >
          <Screen name="ReportStaffLogTime">
            {(props) => (
              <StaffLogTimeTab
                {...props}
                showBackButton={showBackButton}
                onChangeTimeValue={onChangeTimeValue}
                timeValue={timeVal}
                reportData={reportData}
                onRefresh={onRefresh}
                sortStaffName={sortStaffName}
                onSortWithKey={onSortWithKey}
                exportRef={exportRef}
                onHandleExportFile={onHandleExportFile}
              />
            )}
          </Screen>

          <Screen name="ReportStaffLogTime_Detail">
            {(props) => (
              <StaffLogTimeDetailTab
                {...props}
                showBackButton={showBackButton}
                onChangeTimeValue={onChangeTimeValue}
                timeValue={timeVal}
                reportData={reportData}
                onRefresh={onRefresh}
                exportRef={exportRef}
                onHandleExportFile={onHandleExportFile}
              />
            )}
          </Screen>
        </Navigator>
      </View>
      <AppLoading loading={isGetStaffLogTime} />
    </>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: colors.WHITE, flex: 1 },
});
