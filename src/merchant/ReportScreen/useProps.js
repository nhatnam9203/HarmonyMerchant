import actions from "@actions";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { APP_TYPE } from "@shared/constants";
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
    isSalonApp: () => {
      const merchant = useSelector((state) => state.dataLocal.profile);
      const { type = APP_TYPE.POS } = merchant || {};

      return type === APP_TYPE.POS;
    },
  };
};
