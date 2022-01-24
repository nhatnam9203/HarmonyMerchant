import { isPermissionToTab, role } from "@utils";
import * as l from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export const usePermission = (tabName) => {

  const profileStaffLogin = useSelector(
    (state) => state.dataLocal?.profileStaffLogin
  );

  const [isPermission, setIsPermission] = React.useState(true);

  const checkPermissionOnSettings = (tab) => {
    const per = l.get(profileStaffLogin, "permission", []);
    return isPermissionToTab(per, tab);
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
  }, [profileStaffLogin?.roleName]);

  return {
    isPermission,
  };
};
