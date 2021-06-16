import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "@shared/themes";
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
        <Screen name="ReportSaleProduct" component={SalesByProduct} />
        <Screen
          name="ReportSaleProduct_Detail"
          component={SalesByProductDetail}
        />
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
