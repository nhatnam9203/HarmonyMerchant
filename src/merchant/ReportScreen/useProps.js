import actions from "@actions";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { APP_TYPE } from "@shared/constants";
import { menuTabs } from "@utils";
import { useFocusEffect } from "@react-navigation/native";
// import { usePermission } from "@shared/hooks";

export const useProps = ({ navigation }) => {
  const screenReportRef = React.useRef(null);
  const dispatch = useDispatch();
  const popupLoginStaffRef = React.useRef(null);
  // const { isPermission } = usePermission(menuTabs.MENU_REPORT);

  const [isShowBackButton, showBackButton] = React.useState(false);

  const tokenReportServer = useSelector(
    (state) => state.dataLocal.tokenReportServer
  );

  const openDrawer = () => {
    navigation.openDrawer();
  };

  useEffect(()=>{
    popupLoginStaffRef.current?.show()
  },[])

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (isPermission) {
  //       popupLoginStaffRef.current.hide();
  //     } else {
  //       popupLoginStaffRef.current.show();
  //     }
  //   }, [isPermission, tokenReportServer])
  // );

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
    popupLoginStaffRef,
    onForceClosePopupPermission: () => { },
  };
};
