import React from "react";
import { role, menuTabs, isPermissionToTab } from "@utils";
import { useSelector, useDispatch } from "react-redux";
import * as l from "lodash";
import actions from "@actions";
import NavigatorServices from "@navigators/NavigatorServices";

export const useProps = ({ navigation }) => {
  const dispatch = useDispatch();
  const checkPermissionRef = React.useRef(null);

  const profileStaffLogin = useSelector(
    (state) => state.dataLocal?.profileStaffLogin
  );
  const customerTabPermission = useSelector(
    (state) => state.customer?.customerTabPermission
  );

  const openDrawer = () => {
    navigation.openDrawer();
  };

  React.useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      checkPermissionRef.current?.setStateFromParent("");

      const roleName = profileStaffLogin?.roleName || role.Admin;
      const permission = l.get(profileStaffLogin, "permission", []);

      if (roleName !== role.Admin) {
        if (roleName === role.Manager) {
          if (!isPermissionToTab(permission, menuTabs.MENU_CUSTOMER)) {
            dispatch(actions.customer.toggleCustomerTabPermission());
          }
        } else {
          dispatch(actions.customer.toggleCustomerTabPermission());
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

  return {
    openDrawer,
    navigation,
    handleLockScreen: () => {},
    closePopupCheckCustomerTabPermission: () => {
      dispatch(actions.customer.toggleCustomerTabPermission(false));
      NavigatorServices.navigate("home.order.top_tab");
    },
    customerTabPermission,
    checkPermissionRef,
  };
};
