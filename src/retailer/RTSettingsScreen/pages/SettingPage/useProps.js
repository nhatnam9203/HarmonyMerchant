import NavigationServices from "@navigators/NavigatorServices";
import actions from "@redux/actions";
import { isPermissionToTab, role, menuTabs } from "@utils";
import * as l from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import TabGaneral from "../../../RTGeneral";
import { SettingAboutPage } from "../SettingAboutPage";
import { SettingAttributesPage } from "../SettingAttributesPage";
import { SettingCategoriesPage } from "../SettingCategoriesPage";
import { SettingGeneralPage } from "../SettingGeneralPage";
import { SettingHardwarePage } from "../SettingHardwarePage";
import { SettingLayoutPage } from "../SettingLayoutPage";
import { SettingStaffPage } from "../SettingStaffPage";
import { SettingTaxPage } from "../SettingTaxPage";
import {
  // TabGaneral,
  TabHardware,
  TabTAX,
} from "@src/screens/SettingScreen/widget";
import { settingRetailer } from "@redux/slices";

export const useProps = ({ navigation, params: { reload } }) => {
  const dispatch = useDispatch();
  const checkPermissionRef = React.useRef(null);
  const { i18n } = useTranslation();
  const [isWaitingLogout, setIsWaitingLogout] = React.useState(false);

  // const [active, setActive] = React.useState(SettingGeneralPage.name);
  const active = useSelector((state) => state.settingRetailer?.activeTab);

  const profileStaffLogin = useSelector(
    (state) => state.dataLocal?.profileStaffLogin
  );

  const settingTabPermission = useSelector(
    (state) => state.app.settingTabPermission
  );

  const togglePopupPermission = async (bl = true) => {
    checkPermissionRef.current?.setStateFromParent("");

    await dispatch(actions.app.toggleSettingTabPermission(bl));
  };

  const checkPermissionTab = () => {
    if (!active) return;

    if (
      active !== SettingHardwarePage.name &&
      active !== SettingAboutPage.name
    ) {
      const roleName = profileStaffLogin?.roleName || role.Admin;
      const permission = l.get(profileStaffLogin, "permission", []);

      if (roleName !== role.Admin) {
        if (roleName === role.Manager) {
          if (!isPermissionToTab(permission, menuTabs.MENU_SETTING)) {
            togglePopupPermission();
          }
        } else {
          togglePopupPermission();
        }
      } else {
        togglePopupPermission(false);
      }
    }
  };

  const renderContentDrawer = React.useCallback(() => {
    switch (active) {
      case SettingGeneralPage.name:
        return <TabGaneral currentTab={active} />;
      case SettingAttributesPage.name:
        return <SettingAttributesPage.component reloadPage={reload} />;
      case SettingCategoriesPage.name:
        return <SettingCategoriesPage.component reloadPage={reload} />;
      case SettingStaffPage.name:
        return <SettingStaffPage.component reloadPage={reload} />;
      // case SettingPaymentPage.name:
      //   return <SettingPaymentPage.component reloadPage={reload} />;
      case SettingTaxPage.name:
        return <TabTAX reloadPage={reload} />;
      case SettingHardwarePage.name:
        return <TabHardware reloadPage={reload} />;
      case SettingAboutPage.name:
        return <SettingAboutPage.component reloadPage={reload} />;
      case SettingLayoutPage.name:
        return <SettingLayoutPage.component reloadPage={reload} />;
      default:
        return null;
    }
  }, [active]);

  React.useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      // console.log("focus" + active);
      // setActive(SettingGeneralPage.name);
      // checkPermissionTab();
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      checkPermissionRef.current?.setStateFromParent("");
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  React.useEffect(() => {
    checkPermissionTab();
  }, [active]);

  React.useEffect(() => {
    // console.log(settingTabPermission);
    if (!settingTabPermission && isWaitingLogout) {
      dispatch(actions.auth?.requestLogout());
      // setIsWaitingLogout(false);
    }
  }, [settingTabPermission, isWaitingLogout]);

  return {
    changeLanguage: (locale = "vi") => i18n.changeLanguage(locale),
    openDrawer: () => {
      navigation.openDrawer();
    },
    reload,
    logOut: () => {
      const roleName = profileStaffLogin?.roleName || role.Admin;
      const permission = l.get(profileStaffLogin, "permission", []);

      if (roleName !== role.Admin) {
        if (roleName === role.Manager) {
          if (!isPermissionToTab(permission, menuTabs.MENU_SETTING)) {
            setTimeout(async () => {
              await togglePopupPermission();
              await setIsWaitingLogout(true);
            }, 500);
            return;
          }
        } else {
          setTimeout(async () => {
            await togglePopupPermission();
            await setIsWaitingLogout(true);
          }, 500);
          return;
        }
      }

      dispatch(actions.auth?.requestLogout());
    },
    navigation,
    checkPermissionRef,
    active,
    setActive: (tab) => {
      dispatch(settingRetailer.setActiveTab(tab));
    },
    closePopupCheckTabPermission: async () => {
      await setIsWaitingLogout(false);
      await togglePopupPermission(false);
      NavigationServices.navigate("home.order.top_tab");
    },
    tabPermission: settingTabPermission,
    renderContentDrawer,
  };
};
