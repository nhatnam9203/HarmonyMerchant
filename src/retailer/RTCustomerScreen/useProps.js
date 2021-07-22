import React from "react";
import { role, menuTabs, isPermissionToTab } from "@utils";
import { useSelector, useDispatch } from "react-redux";
import * as l from "lodash";
import actions from "@actions";

export const useProps = ({ navigation }) => {
  const dispatch = useDispatch();

  const profileStaffLogin = useSelector(
    (state) => state.dataLocal.profileStaffLogin
  );

  const openDrawer = () => {
    navigation.openDrawer();
  };

  React.useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
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

  return { openDrawer };
};
