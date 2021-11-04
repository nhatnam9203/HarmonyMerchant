import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { colors } from "@shared/themes";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { CustomTopTab } from "../../../widget";
import SalesByCategory from "./SalesByCategory";
import SalesByProduct from "./SalesByProduct";

const { Screen, Navigator } = createMaterialTopTabNavigator();

function ProductTab(
  {
    route: {
      params: { showBackButton },
    },
  },
  ref
) {
  const { t } = useTranslation();

  const salesByCategoryTabRef = useRef(null);
  const salesByProductTabRef = useRef(null);

  // public func
  useImperativeHandle(ref, () => ({
    goBack: () => {},
    didBlur: () => {
      salesByCategoryTabRef?.current?.didBlur();
      salesByProductTabRef?.current?.didBlur();
    },
    didFocus: () => {
      salesByCategoryTabRef?.current?.didFocus();
      salesByProductTabRef?.current?.didFocus();
    },
  }));

  return (
    <View style={styles.container}>
      <Navigator
        headerMode="none"
        screenOptions={{
          cardStyle: {
            backgroundColor: colors.WHITE_FA,
          },
        }}
        lazy={true}
        optimizationsEnabled={true}
        swipeEnabled={false}
        tabBar={(props) => <CustomTopTab {...props} />}
      >
        <Screen
          name={"ReportSaleCategoryTab"}
          component={SalesByCategory}
          options={{
            title: t("Sales by category"),
          }}
          initialParams={{ showBackButton: showBackButton }}
        />
        <Screen
          name={"ReportSaleProductTab"}
          component={SalesByProduct}
          options={{
            title: t("Sales by product"),
          }}
          initialParams={{ showBackButton: showBackButton }}
        />
      </Navigator>
    </View>
  );
}

export default ProductTab = forwardRef(ProductTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    paddingTop: scaleHeight(15),
  },
});
