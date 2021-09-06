import actions from "@actions";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export const useProps = ({ navigation }) => {
  const dispatch = useDispatch();

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return {
    openDrawer,
    navigation,
    handleLockScreen: () => {},
    tabPermission: useSelector(
      (state) => state.customer?.customerTabPermission
    ),
    togglePopupPermission: (bl) => {
      dispatch(actions.customer.toggleCustomerTabPermission(bl ?? true));
    },
  };
};
