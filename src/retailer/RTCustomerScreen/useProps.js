import React from "react";
import { role, menuTabs, isPermissionToTab } from "@utils";
import { useSelector, useDispatch } from "react-redux";
import * as l from "lodash";
import actions from "@actions";
import NavigatorServices from "../../navigators/NavigatorServices";

export const useProps = ({ navigation }) => {
  const dispatch = useDispatch();

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
      console.log(profileStaffLogin);

      const roleName = profileStaffLogin?.roleName || role.Admin;
      const permission = l.get(profileStaffLogin, "permission", []);

      console.log(roleName);
      console.log(permission);
      // !! chỗ này show cái pincode lên nè
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

    const unsubscribeBlur = navigation.addListener("blur", () => {});

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
      navigation.reset("home.order.top_tab");
    },
    customerTabPermission,
  };
};
