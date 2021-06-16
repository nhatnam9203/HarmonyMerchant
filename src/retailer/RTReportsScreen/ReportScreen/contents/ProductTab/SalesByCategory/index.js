import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "@shared/themes";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import SalesByCategory from "./SalesByCategory";
import SalesByCategoryDetail from "./SalesByCategoryDetail";

const { Screen, Navigator } = createStackNavigator();

function SalesByCategoryTab({
  route: {
    params: { showBackButton },
  },
}) {
  /**redux store*/
  const dispatch = useDispatch();

  // public function
  // useImperativeHandle(ref, () => ({
  //   goBack: () => {
  //     layoutRef.current?.goBack();
  //   },
  //   didBlur: () => {
  //     // setTitleRangeTime("This week");
  //   },
  //   didFocus: () => {
  //     layoutRef?.current?.setTimeFilter(RANGE_TIME_DEFAULT);
  //   },
  // }));

  // React.useEffect(() => {
  //   setRefreshing(false);
  // }, [productSaleByCategoryList]);

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
        <Screen name="ReportSaleCategory" component={SalesByCategory} />
        <Screen name="ReportSaleCategory_Detail">
          {(props) => (
            <SalesByCategoryDetail {...props} showBackButton={showBackButton} />
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
