import NavigationServices from "@navigators/NavigatorServices";
import actions from "@redux/actions";
import { isPermissionToTab, role } from "@utils";
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

export const useProps = ({ navigation, params: { reload } }) => {
  const dispatch = useDispatch();
  const checkPermissionRef = React.useRef(null);
  const { i18n } = useTranslation();
  const [active, setActive] = React.useState(SettingGeneralPage.name);
  const [isWaitingLogout, setIsWaitingLogout] = React.useState(false);

  const profileStaffLogin = useSelector(
    (state) => state.dataLocal?.profileStaffLogin
  );

  const settingTabPermission = useSelector(
    (state) => state.app.settingTabPermission
  );

  const togglePopupPermission = async (bl = true) => {
    await dispatch(actions.app.toggleSettingTabPermission(bl));
  };

  const checkPermissionTab = () => {
    if (
      active !== SettingGeneralPage.name &&
      active !== SettingHardwarePage.name &&
      active !== SettingAboutPage.name &&
      active !== SettingAboutPage.name
    ) {
      const roleName = profileStaffLogin?.roleName || role.Admin;
      const permission = l.get(profileStaffLogin, "permission", []);

      if (roleName !== role.Admin) {
        if (roleName === role.Manager) {
          if (!isPermissionToTab(permission, tabName)) {
            togglePopupPermission();
          }
        } else {
          togglePopupPermission();
        }
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
      console.log("focus" + active);
      checkPermissionRef.current?.setStateFromParent("");

      setActive(SettingGeneralPage.name);
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      checkPermissionRef.current?.setStateFromParent("");
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation, active]);

  React.useEffect(() => {
    checkPermissionTab();
  }, [active]);

  React.useEffect(() => {
    console.log(settingTabPermission);
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
          if (!isPermissionToTab(permission, tabName)) {
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
    setActive,
    closePopupCheckTabPermission: async () => {
      await setIsWaitingLogout(false);
      await togglePopupPermission(false);
      NavigationServices.navigate("home.order.top_tab");
    },
    tabPermission: settingTabPermission,
    renderContentDrawer,
  };
};
