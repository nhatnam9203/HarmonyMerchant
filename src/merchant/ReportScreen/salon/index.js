import NavigationServices from "@navigators/NavigatorServices";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import IMAGE from "@resources";
import { colors } from "@shared/themes";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { CustomTopBarScreenReport } from "../widget";
import {
  StaffTab,
  GiftCardTab,
  CustomerTab,
  ServiceTab,
  ProductTab,
  OverallTab,
} from "./contents";
// import { StaffTab } from "../general";
import { RTStaffCheckIn } from "../general";

const { Screen, Navigator } = createMaterialTopTabNavigator();

export const SalonReportScreen = React.forwardRef(({ showBackButton }, ref) => {
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

  const staffRef = useRef(null);
  const giftCardRef = useRef(null);
  const customerRef = useRef(null);
  const serviceRef = useRef(null);
  const productRef = useRef(null);
  const overallRef = useRef(null);

  /**public function  */
  useImperativeHandle(ref, () => ({
    goBack: () => {
      switch (tabIndex) {
        case 0:
          staffRef.current?.goBack();
          break;
        case 1:
          giftCardRef.current?.goBack();
          break;
        case 2:
          customerRef.current?.goBack();
          break;
        case 3:
          serviceRef.current?.goBack();
          break;
        case 4:
          productRef.current?.goBack();
          break;
        case 5:
          overallRef.current?.goBack();
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
          staffRef?.current?.didBlur();
          giftCardRef?.current?.didBlur();
          customerRef?.current?.didBlur();
          serviceRef?.current?.didBlur();
          productRef?.current?.didBlur();
          overallRef?.current?.didBlur();
          break;
      }
      scrollTabRef?.current?.goToFirstTab();
    },
    didFocus: () => {
      switch (tabIndex) {
        case 0:
          staffRef.current?.didFocus();
          break;
        case 1:
          giftCardRef.current?.didFocus();
          break;
        case 2:
          customerRef.current?.didFocus();
          break;
        case 3:
          serviceRef.current?.didFocus();
          break;
        case 4:
          productRef.current?.didFocus();
          break;
        case 5:
          overallRef.current?.didFocus();
          break;
        default:
          break;
      }
    },
  }));

  const onChangeTab = (index) => {
    switch (tabIndex) {
      case 0:
        staffRef.current?.goBack();
        break;
      case 1:
        giftCardRef.current?.goBack();
        break;
      case 2:
        customerRef.current?.goBack();
        break;
      case 3:
        serviceRef.current?.goBack();
        break;
      case 4:
        productRef.current?.goBack();
        break;
      case 5:
        overallRef.current?.goBack();
        break;
      default:
        break;
    }

    setTabIndex(index);
    onShowBackButton(false);
  };

  const onShowBackButton = (bl) => {
    if (showBackButton && typeof showBackButton === "function")
      showBackButton(bl);
  };

  //
  useEffect(() => {
    if (reportTabPermissionSuccess === true && isMount) {
      switch (tabIndex) {
        case 0:
          staffRef.current?.didFocus();
          break;
        case 1:
          giftCardRef.current?.didFocus();
          break;
        case 2:
          customerRef.current?.didFocus();
          break;
        case 3:
          serviceRef.current?.didFocus();
          break;
        case 4:
          productRef.current?.didFocus();
          break;
        case 5:
          overallRef.current?.didFocus();
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
        staffRef?.current?.getListStaffsSalaryTop();
        break;
      case 1:
        giftCardRef?.current?.getGiftCardReportSales();
        break;
      case 2:
        customerRef?.current?.getCustomerReportSales();
        break;
      case 5:
        overallRef?.current?.callAPIForTwoTabs();
        break;

      default:
        break;
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
        lazy={true}
        optimizationsEnabled={true}
        swipeEnabled={false}
        lazyPreloadDistance={1}
        tabBar={(props) => (
          <CustomTopBarScreenReport {...props} onChangeTab={onChangeTab} />
        )}
      >
        <Screen
          name={"ReportStaffTab"}
          options={{
            title: t("Staff Salary"),
            tabBarIcon: IMAGE.Staff,
          }}
          initialParams={{
            showBackButton: onShowBackButton,
          }}
        >
          {(props) => (
            <StaffTab
              {...props}
              ref={staffRef}
              showBackButton={onShowBackButton}
            />
          )}
        </Screen>

        <Screen
          name={"ReportGiftCardTab"}
          options={{
            title: t("Gift Card"),
            tabBarIcon: IMAGE.giftcard,
          }}
          initialParams={{
            showBackButton: onShowBackButton,
          }}
        >
          {(props) => (
            <GiftCardTab
              {...props}
              ref={giftCardRef}
              showBackButton={onShowBackButton}
            />
          )}
        </Screen>

        <Screen
          name={"ReportCustomerTab"}
          options={{
            title: t("Customer"),
            tabBarIcon: IMAGE.Customer,
          }}
          initialParams={{
            showBackButton: onShowBackButton,
          }}
        >
          {(props) => (
            <CustomerTab
              {...props}
              ref={customerRef}
              showBackButton={onShowBackButton}
            />
          )}
        </Screen>

        <Screen
          name={"ReportServiceTab"}
          options={{
            title: t("Service"),
            tabBarIcon: IMAGE.Services,
          }}
          initialParams={{
            showBackButton: onShowBackButton,
          }}
        >
          {(props) => (
            <ServiceTab
              {...props}
              ref={serviceRef}
              showBackButton={onShowBackButton}
            />
          )}
        </Screen>

        <Screen
          name={"ReportProductTab"}
          options={{
            title: t("Product"),
            tabBarIcon: IMAGE.Report_Product,
          }}
          initialParams={{
            showBackButton: onShowBackButton,
          }}
        >
          {(props) => (
            <ProductTab
              {...props}
              ref={productRef}
              showBackButton={onShowBackButton}
            />
          )}
        </Screen>

        <Screen
          name={"ReportOverallTab"}
          options={{
            title: t("Overall"),
            tabBarIcon: IMAGE.Report_Overall,
          }}
          initialParams={{
            showBackButton: onShowBackButton,
          }}
        >
          {(props) => (
            <OverallTab
              {...props}
              ref={overallRef}
              showBackButton={onShowBackButton}
            />
          )}
        </Screen>
        <Screen
          name={"RTStaffCheckInTab"}
          options={{
            title: t("Log Time"),
            tabBarIcon: IMAGE.Timekeeping,
          }}
          initialParams={{
            showBackButton: showBackButton,
          }}
        >
          {(props) => <RTStaffCheckIn.component {...props} />}
        </Screen>
      </Navigator>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
});
