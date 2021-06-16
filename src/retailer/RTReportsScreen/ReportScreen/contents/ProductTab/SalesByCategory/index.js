import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "@shared/themes";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import SalesByCategory from "./SalesByCategory";
import SalesByCategoryDetail from "./SalesByCategoryDetail";
import {
  ButtonCalendarFilter,
  FormTitle,
  ExportModal,
} from "@shared/components";
import { useReportSaleCategory } from "@shared/services/api/retailer";
import { getQuickFilterTimeRange } from "@utils";
import {
  dateToString,
  DATE_SHOW_FORMAT_STRING,
  statusSuccess,
} from "@shared/utils";

const { Screen, Navigator } = createStackNavigator();

function SalesByCategoryTab({
  route: {
    params: { showBackButton },
  },
}) {
  const dispatch = useDispatch();

  const [timeVal, setTimeVal] = React.useState(null);
  const [data, setData] = React.useState([]);

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [reportSaleCategory, getReportSaleCategory] = useReportSaleCategory();
  const callGetReportSaleCategory = React.useCallback(() => {
    getReportSaleCategory({
      ...timeVal,
      sort: {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeVal]);

  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */

  React.useEffect(() => {
    callGetReportSaleCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeVal]);

  /**effect */
  React.useEffect(() => {
    const { codeStatus, message, data, summary } = reportSaleCategory || {};
    if (statusSuccess(codeStatus)) {
      setData(data);
    }
  }, [reportSaleCategory]);

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
        <Screen name="ReportSaleCategory">
          {(props) => (
            <SalesByCategory
              {...props}
              onChangeTimeValue={onChangeTimeValue}
              timeValue={timeVal?.quickFilterText}
              data={data}
            />
          )}
        </Screen>
        <Screen name="ReportSaleCategory_Detail">
          {(props) => (
            <SalesByCategoryDetail
              {...props}
              showBackButton={showBackButton}
              onChangeTimeValue={onChangeTimeValue}
              timeValue={timeVal?.quickFilterText}
              data={data}
            />
          )}
        </Screen>
      </Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE_FA,
  },
});

export default SalesByCategoryTab;
