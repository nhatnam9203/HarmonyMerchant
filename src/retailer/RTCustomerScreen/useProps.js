import actions from "@actions";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePermission } from "@shared/hooks";
import { menuTabs } from "@utils";
import { useFocusEffect } from "@react-navigation/native";

export const useProps = ({ navigation }) => {
  const dispatch = useDispatch();

  const popupCheckPermissionRef = React.useRef(null);
  const { isPermission } = usePermission(menuTabs.MENU_CUSTOMER);
  console.log("isPermission " + isPermission);

  const openDrawer = () => {
    navigation.openDrawer();
  };

  React.useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {});

    const unsubscribeBlur = navigation.addListener("blur", () => {});

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      if (isPermission) {
        popupCheckPermissionRef.current.hide();
      } else {
        popupCheckPermissionRef.current.show();
      }
    }, [isPermission])
  );

  return {
    openDrawer,
    navigation,
    popupCheckPermissionRef,
    // handleLockScreen: () => {},
    onForceClosePopupPermission: () => {},
    // tabPermission: useSelector(
    //   (state) => state.customer?.customerTabPermission
    // ),
    // togglePopupPermission: (bl) => {
    //   dispatch(actions.customer.toggleCustomerTabPermission(bl ?? true));
    // },
  };
};
