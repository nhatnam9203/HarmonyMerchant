import { isPermissionToTab, role } from "@utils";
import * as l from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export const usePermissionReportServer = (tabName) => {

  const profileStaffLoginReportServer = useSelector(
    (state) => state.dataLocal?.profileStaffLoginReportServer
  );

  const [isPermission, setIsPermission] = React.useState(true);

  const checkPermissionOnSettings = (tab) => {
    const per = l.get(profileStaffLoginReportServer, "permission", []);
    return isPermissionToTab(per, tab);
  };


  React.useEffect(() => {

    const roleName = profileStaffLoginReportServer?.roleName || role.Admin;

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
  }, [profileStaffLoginReportServer?.roleName]);

  return {
    isPermission,
  };
};
