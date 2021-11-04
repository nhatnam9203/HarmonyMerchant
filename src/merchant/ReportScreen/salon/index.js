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
  // StaffTab,
  GiftCardTab,
  CustomerTab,
  ServiceTab,
  ProductTab,
  OverallTab,
} from "./contents";
import { StaffTab } from "../general";

const { Screen, Navigator } = createMaterialTopTabNavigator();

export const ReportScreen = React.forwardRef(({ showBackButton }, ref) => {
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
  const giftCardRef = useRef(null);

  /**public function  */
  useImperativeHandle(ref, () => ({
    goBack: () => {
      switch (tabIndex) {
        case 4:
          overallRef.current?.goBack();
          break;
        case 5:
          staffRef.current?.goBack();
          break;
        case 0:
        case 1:
        case 2:
        case 3:
        default:
          NavigationServices.goBack();

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

  const onChangeTab = (index) => {
    switch (tabIndex) {
      case 0:
        // salesRef.current?.goBack();
        break;
      case 1:
        // orderRef.current?.goBack();
        break;
      case 2:
        // productRef.current?.goBack();
        break;
      case 3:
        // customerRef.current?.goBack();
        break;
      case 4:
        overallRef.current?.goBack();
        showBackButton(false);

        break;
      case 5:
        staffRef.current?.goBack();
        showBackButton(false);

        break;
      default:
        break;
    }

    setTabIndex(index);
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
            showBackButton: showBackButton,
          }}
        >
          {(props) => <StaffTab {...props} ref={staffRef} />}
        </Screen>

        <Screen
          name={"ReportGiftCardTab"}
          options={{
            title: t("Gift Card"),
            tabBarIcon: IMAGE.GiftCard,
          }}
          initialParams={{
            showBackButton: showBackButton,
          }}
        >
          {(props) => <GiftCardTab {...props} ref={giftCardRef} />}
        </Screen>

        <Screen
          name={"ReportServiceTab"}
          options={{
            title: t("Service"),
            tabBarIcon: IMAGE.Service,
          }}
          initialParams={{
            showBackButton: showBackButton,
          }}
        >
          {(props) => <ServiceTab {...props} ref={giftCardRef} />}
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
