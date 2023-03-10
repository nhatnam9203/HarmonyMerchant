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
  CustomerTab,
  OrderTab,
  OverallTab,
  ProductTab,
  SalesTab,
  ReportStaffTab,
  GiftCardTab,
} from "./contents";
import { RTStaffCheckIn } from "../general";

const { Screen, Navigator } = createMaterialTopTabNavigator();

export const RetailerReportScreen = React.forwardRef(
  ({ showBackButton }, ref) => {
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
          // staffRef.current?.goBack();
          // showBackButton(false);

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
            options={{
              title: t("Overall"),
              tabBarIcon: IMAGE.Report_Overall,
            }}
            initialParams={{
              showBackButton: showBackButton,
            }}
          >
            {(props) => <OverallTab {...props} ref={overallRef} />}
          </Screen>
          {/* <Screen
            name={"ReportStaffTab"}
            options={{
              title: t("Staff"),
              tabBarIcon: IMAGE.Staff,
            }}
            initialParams={{
              showBackButton: showBackButton,
            }}
          >
            {(props) => <ReportStaffTab {...props} ref={staffRef} />}
          </Screen> */}

          <Screen
            name={"ReportStaffTab"}
            component={ReportStaffTab}
            options={{
              title: t("Staff"),
              tabBarIcon: IMAGE.Staff,
            }}
            initialParams={{ showBackButton: showBackButton }}
          />

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
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
});
