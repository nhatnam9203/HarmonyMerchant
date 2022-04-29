import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "@shared/themes";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { StaffLogTimeTab } from "./StaffLogTime";
import { StaffLogTimeDetailTab } from "./StaffLogTimeDetail";
import { useFocusEffect } from "@react-navigation/native";
import { harmonyApi } from "@shared/services";
import { getTimeTitleFile, SORT_TYPE, statusSuccess } from "@shared/utils";
import { getQuickFilterTimeRange } from "@utils";

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
  ] = harmonyApi.useLazyStaffLogTimeReportQuery();

  const callGetReportStaffLogTime = React.useCallback(() => {
    // getStaffLogTime();
    getStaffLogTime({ ...timeVal });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeVal, sortStaffName]);

  useFocusEffect(
    React.useCallback(() => {
      callGetReportStaffLogTime();
    }, [timeVal, sortStaffName])
  );

  React.useEffect(() => {
    const { codeStatus, data } = staffLogTimeData || {};
    if (statusSuccess(codeStatus)) {
      setReportData(data);
    }
  }, [staffLogTimeData]);

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

  return (
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
            />
          )}
        </Screen>
      </Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: colors.WHITE, flex: 1 },
});
