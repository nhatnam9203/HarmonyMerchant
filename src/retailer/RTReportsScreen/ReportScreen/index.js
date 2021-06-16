import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  useState,
  useEffect,
} from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import IMAGE from "@resources";
import { colors } from "@shared/themes";
import {
  StaffTab,
  OrderTab,
  CustomerTab,
  SalesTab,
  ProductTab,
  OverallTab,
} from "./contents";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";
import { CustomTopBarScreenReport } from "./widget";

const { Screen, Navigator } = createMaterialTopTabNavigator();

function ReportScreen({ showBackButton }, ref) {
  const { t } = useTranslation();

  const reportTabPermission = useSelector(
    (state) => state.staff.reportTabPermission
  );
  const reportTabPermissionSuccess = useSelector(
    (state) => state.staff.reportTabPermissionSuccess
  );
  /**state */
  const [tabIndex, setTabIndex] = useState(0);
  const [isMount, setIsMount] = useState(false);

  /**refs */
  const scrollTabRef = useRef(null);

  // const giftCardRef = useRef(null);
  // const serviceRef = useRef(null);

  const salesRef = useRef(null);
  const orderRef = useRef(null);
  const productRef = useRef(null);
  const customerRef = useRef(null);
  const overallRef = useRef(null);
  const staffRef = useRef(null);

  /**public function  */
  useImperativeHandle(ref, () => ({
    onBack: () => {
      switch (tabIndex) {
        case 0:
          salesRef.current?.goBack();
          break;
        case 1:
          orderRef.current?.goBack();
          break;
        case 2:
          productRef.current?.goBack();
          break;
        case 3:
          customerRef.current?.goBack();
          break;
        case 4:
          overallRef.current?.goBack();
          break;
        case 5:
          staffRef.current?.goBack();
          break;
        default:
          break;
      }
    },
    didBlur: () => {
      setIsMount(false);
      switch (tabIndex) {
        case 0:
        default:
          salesRef?.current?.didBlur();
          orderRef.current?.didBlur();
          productRef?.current?.didBlur();
          customerRef.current?.didBlur();
          overallRef?.current?.didBlur();
          staffRef?.current?.didBlur();

          break;
      }
      scrollTabRef?.current?.goToFirstTab();
    },
    didFocus: () => {
      switch (tabIndex) {
        case 0:
          salesRef.current?.didFocus();
          break;
        case 1:
          orderRef.current?.didFocus();
          break;
        case 2:
          productRef.current?.didFocus();
          break;
        case 3:
          customerRef.current?.didFocus();
          break;
        case 4:
          overallRef.current?.didFocus();
          break;
        case 5:
          staffRef.current?.didFocus();
          break;
        default:
          break;
      }
    },
  }));

  const onTabChange = (index) => {
    switch (tabIndex) {
      case 0:
        salesRef.current?.goBack();
        break;
      case 1:
        orderRef.current?.goBack();
        break;
      case 2:
        productRef.current?.goBack();
        break;
      case 3:
        customerRef.current?.goBack();
        break;
      case 4:
        overallRef.current?.goBack();
        break;
      case 5:
        staffRef.current?.goBack();
        break;
      default:
        break;
    }

    setTabIndex(index);
    showBackButton(false);
  };

  const onShowBackButton = (bl) => {
    showBackButton(bl);
  };

  //
  useEffect(() => {
    if (reportTabPermissionSuccess === true && isMount) {
      switch (tabIndex) {
        case 0:
          salesRef.current?.didFocus();
          break;
        case 1:
          orderRef.current?.didFocus();
          break;
        case 2:
          productRef.current?.didFocus();
          break;
        case 3:
          customerRef.current?.didFocus();
          break;
        case 4:
          overallRef.current?.didFocus();
          break;
        case 5:
          staffRef.current?.didFocus();
          break;
        default:
          break;
      }
    }

    if (reportTabPermission === true && isMount === false) {
      setIsMount(true);
    }
  }, [reportTabPermission, reportTabPermissionSuccess]);

  // ------------- New Code ---------------

  handleOnChangeTab = (i) => {
    switch (i) {
      case 0:
        // staffRef?.current?.getListStaffsSalaryTop();
        break;
      case 1:
        // giftCardRef?.current?.getGiftCardReportSales();
        break;
      case 2:
        // customerRef?.current?.getCustomerReportSales();
        break;
      case 5:
        // overallRef?.current?.callAPIForTwoTabs();
        break;

      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* <HeaderTabLayout
        ref={scrollTabRef}
        tabIcons={[
          IMAGE.Report_Sales,
          IMAGE.Report_Order,
          IMAGE.Report_Product,
          IMAGE.Customer,
          IMAGE.Report_Overall,
          IMAGE.Staff,
        ]}
        onHeaderTabChanged={onTabChange}
        handleOnChangeTab={handleOnChangeTab}
      >
        <SalesTab
          style={styles.content}
          tabLabel={localize("Sales", language)}
          ref={salesRef}
          showBackButton={onShowBackButton}
        />
        <OrderTab
          style={styles.content}
          tabLabel={localize("Order", language)}
          ref={salesRef}
          showBackButton={onShowBackButton}
        />
        <ProductTab
          style={styles.content}
          tabLabel={localize("Product", language)}
          ref={productRef}
          showBackButton={onShowBackButton}
        />
        <CustomerTab
          ref={customerRef}
          style={styles.content}
          tabLabel={localize("Customer", language)}
          showBackButton={onShowBackButton}
        />
        <OverallTab
          ref={overallRef}
          style={styles.content}
          tabLabel={localize("Overall", language)}
          showBackButton={onShowBackButton}
        />
        <StaffTab
          ref={staffRef}
          style={styles.content}
          tabLabel={localize("Staff Salary", language)}
          showBackButton={onShowBackButton}
        />
      </HeaderTabLayout> */}

      <Navigator
        headerMode="none"
        screenOptions={{
          cardStyle: {
            backgroundColor: colors.WHITE_FA,
          },
        }}
        lazy={true}
        swipeEnabled={false}
        tabBar={(props) => <CustomTopBarScreenReport {...props} />}
      >
        <Screen
          name={"ReportSalesTab"}
          component={SalesTab}
          options={{
            title: t("Sales"),
            tabBarIcon: IMAGE.Report_Sales,
          }}
          initialParams={{ showBackButton: showBackButton }}
        />
        <Screen
          name={"ReportOrderTab"}
          component={OrderTab}
          options={{
            title: t("Order"),
            tabBarIcon: IMAGE.Report_Order,
          }}
          initialParams={{ showBackButton: showBackButton }}
        />
        <Screen
          name={"ReportProductTab"}
          component={ProductTab}
          options={{
            title: t("Product"),
            tabBarIcon: IMAGE.Report_Product,
          }}
          initialParams={{ showBackButton: showBackButton }}
        />
        <Screen
          name={"ReportCustomerTab"}
          component={CustomerTab}
          options={{
            title: t("Customer"),
            tabBarIcon: IMAGE.Customer,
          }}
          initialParams={{ showBackButton: showBackButton }}
        />
        <Screen
          name={"ReportOverallTab"}
          component={OverallTab}
          options={{
            title: t("Overall"),
            tabBarIcon: IMAGE.Report_Overall,
          }}
          initialParams={{ showBackButton: showBackButton }}
        />
        <Screen
          name={"ReportStaffTab"}
          component={StaffTab}
          options={{
            title: t("Staff"),
            tabBarIcon: IMAGE.Staff,
          }}
          initialParams={{ showBackButton: showBackButton }}
        />
      </Navigator>
    </View>
  );
}

export default ReportScreen = forwardRef(ReportScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
});
