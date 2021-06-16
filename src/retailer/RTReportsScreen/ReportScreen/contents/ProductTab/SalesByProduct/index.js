import { createStackNavigator } from "@react-navigation/stack";
import { useReportSaleProduct } from "@shared/services/api/retailer";
import { colors } from "@shared/themes";
import { statusSuccess } from "@shared/utils";
import { getQuickFilterTimeRange } from "@utils";
import React from "react";
import { StyleSheet, View } from "react-native";
import SalesByProduct from "./SalesByProduct";
import SalesByProductDetail from "./SalesByProductDetail";

const { Screen, Navigator } = createStackNavigator();

function SalesByProductTab({
  route: {
    params: { showBackButton },
  },
}) {
  const [timeVal, setTimeVal] = React.useState(null);
  const [filterProduct, setFilterProduct] = React.useState(null);
  const [data, setData] = React.useState([]);

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [reportSaleProduct, getReportSaleProduct] = useReportSaleProduct();
  const callGetReportSaleProduct = React.useCallback(() => {
    getReportSaleProduct({
      ...timeVal,
      product: filterProduct?.value ?? "top",
      sort: {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeVal, filterProduct]);

  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */

  React.useEffect(() => {
    callGetReportSaleProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeVal, filterProduct]);

  /**effect */
  React.useEffect(() => {
    const { codeStatus, message, data, summary } = reportSaleProduct || {};
    if (statusSuccess(codeStatus)) {
      setData(data);
    }
  }, [reportSaleProduct]);

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
        <Screen name="ReportSaleProduct">
          {(props) => (
            <SalesByProduct
              {...props}
              onChangeTimeValue={onChangeTimeValue}
              timeValue={timeVal}
              data={data}
              setFilterProduct={setFilterProduct}
            />
          )}
        </Screen>
        <Screen name="ReportSaleProduct_Detail">
          {(props) => (
            <SalesByProductDetail
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

export default SalesByProductTab;
