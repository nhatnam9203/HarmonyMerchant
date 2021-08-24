import { PopupCheckStaffPermission } from "@components";
import NavigationServices from "@navigators/NavigatorServices";
import { isPermissionToTab, role } from "@utils";
import * as l from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export const PermissionChecker = ({
  navigation,
  tabName,
  tabPermission,
  togglePopupPermission = () => {},
}) => {
  const { t } = useTranslation();
  const checkPermissionRef = React.useRef(null);

  const profileStaffLogin = useSelector(
    (state) => state.dataLocal?.profileStaffLogin
  );

  const closePopupCheckCustomerTabPermission = () => {
    togglePopupPermission(false);
    NavigationServices.navigate("home.order.top_tab");
  };

  React.useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      checkPermissionRef.current?.setStateFromParent("");

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
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      checkPermissionRef.current?.setStateFromParent("");
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  return (
    <PopupCheckStaffPermission
      ref={checkPermissionRef}
      visiblePopupCheckStaffPermission={tabPermission}
      title={t("Input PIN Number")}
      tabName={tabName}
      onRequestClose={closePopupCheckCustomerTabPermission}
    />
  );
};
