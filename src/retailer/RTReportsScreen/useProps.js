import React from "react";
import actions from "@actions";
import { useGetCategoriesList } from "@shared/services/api/retailer";
import { useDispatch, useSelector } from "react-redux";

export const useProps = ({ navigation }) => {
  const screenReportRef = React.useRef(null);
  const dispatch = useDispatch();

  const [isShowBackButton, showBackButton] = React.useState(false);

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return {
    openDrawer,
    screenReportRef,
    onShowBackButton: (bl) => {
      showBackButton(bl);
    },
    isShowBackButton,
    onHandleBack: () => {
      if (screenReportRef.current?.goBack) {
        screenReportRef.current?.goBack();
      }
    },
    navigation,
    tabPermission: useSelector((state) => state.staff?.reportTabPermission),
    togglePopupPermission: (bl) => {
      dispatch(actions.staff.toggleReportTabPermission(bl ?? true));
    },
  };
};
