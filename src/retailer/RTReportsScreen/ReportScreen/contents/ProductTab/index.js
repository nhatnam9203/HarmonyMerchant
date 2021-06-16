import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { colors } from "@shared/themes";
import { CustomScrollTab, CustomTopTab } from "../../widget";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";

import SalesByCategory from "./SalesByCategory";
import SalesByProduct from "./SalesByProduct";
const { Screen, Navigator } = createMaterialTopTabNavigator();

function ProductTab({ style, showBackButton }, ref) {
  /**redux store */
  const language = useSelector((state) => state.dataLocal.language);
  const { t } = useTranslation();

  /**state store */
  const [currentTab, setCurrentTab] = useState(0);
  const [showHeader, setShowHeader] = useState(true);

  /**refs */
  const salesByCategoryTabRef = useRef(null);
  const salesByProductTabRef = useRef(null);

  /**function */
  const onChangeTab = (tabIndex) => {
    salesByCategoryTabRef?.current?.goBack();
    salesByProductTabRef?.current?.goBack();
    setCurrentTab(tabIndex);
  };

  const onGoBack = () => {
    switch (currentTab) {
      case 0:
        salesByCategoryTabRef.current?.goBack();
        break;
      case 1:
        salesByProductTabRef.current?.goBack();
        break;
      default:
        break;
    }
    setShowHeader(true);
  };

  const onShowHeader = (bl) => {
    setShowHeader(bl);
  };

  // public func
  useImperativeHandle(ref, () => ({
    goBack: onGoBack,
    didBlur: () => {
      // setTitleRangeTime("This week");
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
      {/* <CustomScrollTab onHeaderTabChanged={onChangeTab} showHeader={showHeader}>
        <SalesByCategory
          style={{ flex: 1 }}
          ref={salesByCategoryTabRef}
          tabLabel="Sales by category"
          showBackButton={showBackButton}
          showHeader={onShowHeader}
        />

        <SalesByProduct
          style={{ flex: 1 }}
          ref={salesByProductTabRef}
          tabLabel="Sales by product"
          showBackButton={showBackButton}
          showHeader={onShowHeader}
        />
      </CustomScrollTab> */}
      <Navigator
        // initialRouteName="retailer.home.order"
        headerMode="none"
        screenOptions={{
          cardStyle: {
            backgroundColor: colors.WHITE_FA,
          },
        }}
        tabBar={(props) => <CustomTopTab {...props} />}
      >
        {/* <Screen {...MarketingTabPage} /> */}
        {/* <TabMarketing tabLabel={'MARKETING'} /> */}
        <Screen
          name={"ReportSaleCategoryTab"}
          component={SalesByCategory}
          options={{ title: t("Sales by category") }}
        />
        <Screen
          name={"ReportSaleProductTab"}
          component={SalesByProduct}
          options={{ title: t("Sales by product") }}
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
