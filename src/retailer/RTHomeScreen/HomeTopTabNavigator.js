import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { colors } from "@shared/themes";
import { TabMarketing } from "@src/screens/HomeScreen/widget";
import { isPermissionToTab, menuTabs, role } from "@utils";
import * as l from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { CheckOutTabPage, OrderTabPage } from "./pages";
import { HomeTabBar } from "./widget";
import actions from "@actions";
import { PopupCheckStaffPermission } from "@components";
import NavigatorServices from "@navigators/NavigatorServices";
import NavigationServices from "@navigators/NavigatorServices";

const { Screen, Navigator } = createMaterialTopTabNavigator();

export const HomeTopTabNavigator = ({
  openDrawer,
  showPopupConfirm,
  isPayment,
  navigation,
}) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const checkPermissionRef = React.useRef(null);

  const profileStaffLogin = useSelector(
    (state) => state.dataLocal?.profileStaffLogin
  );

  const marketingTabPermission = useSelector(
    (state) => state.marketing.marketingTabPermission
  );

  const marketingTabNoPermission = () => {
    checkPermissionRef.current?.setStateFromParent("");

    const roleName = profileStaffLogin?.roleName || role.Admin;
    const permission = l.get(profileStaffLogin, "permission", []);
    if (roleName !== role.Admin) {
      if (roleName === role.Manager) {
        if (!isPermissionToTab(permission, menuTabs.MARKETING)) {
          return true;
        }
      } else {
        return true;
      }
    }

    return false;
  };

  const closePopupCheckMarketingTabPermission = () => {
    dispatch(actions.marketing.toggleMarketingTabPermission(false));
    NavigatorServices.navigate("retailer.home.order");
  };

  return (
    <>
      <Navigator
        initialRouteName="retailer.home.checkout"
        headerMode="none"
        screenOptions={{
          cardStyle: {
            backgroundColor: colors.WHITE_FA,
          },
        }}
        lazy={true}
        optimizationsEnabled={true}
        swipeEnabled={false}
        tabBar={(props) => <HomeTabBar {...props} onOpenDrawer={openDrawer} />}
      >
        <Screen
          name={t("Marketing")}
          component={TabMarketing}
          listeners={{
            tabPress: (e) => {
              if (isPayment) {
                showPopupConfirm(() => {
                  navigation.navigate("Marketing");
                });
                // Prevent default action
                e.preventDefault();
              } else if (marketingTabNoPermission()) {
                dispatch(actions.marketing.toggleMarketingTabPermission());
              }
            },
          }}
        />
        <Screen
          {...OrderTabPage}
          listeners={{
            tabPress: (e) => {
              if (isPayment) {
                showPopupConfirm(() => {
                  navigation.navigate(OrderTabPage.name, { reload: true });
                });

                // Prevent default action
                e.preventDefault();
              }
            },
          }}
        />
        <Screen
          {...CheckOutTabPage}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              if (isPayment) {
                showPopupConfirm(() => {
                  navigation.navigate(CheckOutTabPage.name);
                });

                // Prevent default action
              } else {
                console.log(CheckOutTabPage.name);
                NavigationServices.navigate(CheckOutTabPage.name, {
                  reload: true,
                });
              }
            },
          }}
        />
      </Navigator>
      <PopupCheckStaffPermission
        ref={checkPermissionRef}
        visiblePopupCheckStaffPermission={marketingTabPermission}
        title={t("Input PIN Number")}
        tabName={menuTabs.MARKETING}
        onRequestClose={closePopupCheckMarketingTabPermission}
      />
    </>
  );
};
