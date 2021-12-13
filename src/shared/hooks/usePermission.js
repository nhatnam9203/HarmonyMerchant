import { isPermissionToTab, role } from "@utils";
import * as l from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export const usePermission = (tabName) => {
  const { t } = useTranslation();

  const profileStaffLogin = useSelector(
    (state) => state.dataLocal?.profileStaffLogin
  );

  const [isPermission, setIsPermission] = React.useState(true);

  const checkPermissionOnSettings = (tab) => {
    const permission = l.get(profileStaffLogin, "permission", []);
    return isPermissionToTab(permission, tab);
  };
  React.useEffect(() => {
    const roleName = profileStaffLogin?.roleName || role.Admin;
    console.log(roleName);

    switch (roleName) {
      case role.Admin:
        setIsPermission(true);
        break;
      case role.Manager:
        setIsPermission(checkPermissionOnSettings(tabName));
        break;
      default:
        setIsPermission(false);
        break;
    }
  }, [profileStaffLogin]);

  return {
    isPermission,
  };
};
