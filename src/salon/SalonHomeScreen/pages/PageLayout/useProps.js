import React from "react";
import * as controllers from "../../controllers";
import { ScreenName } from "@src/ScreenName";
import { useSelector } from "react-redux";
import actions from "@actions";
import _ from "lodash";

export const useProps = ({ navigation }) => {
  const popupNotifyRef = React.useRef(null);
  const notificationContUnread = useSelector(
    (state) => state.app.notificationContUnread
  );
  const homePageCtx = React.useContext(controllers.SalonHomePageContext);
  const _onHandleWillChangeTab = (tabName) => {
    homePageCtx.homePageDispatch(controllers.pressTab(tabName));
    if (homePageCtx.isBlockChangeTab)
      homePageCtx.homePageDispatch(
        controllers.showPopupConfirmCancelCheckout()
      );
  };

  return {
    navigation,
    popupNotifyRef,
    notificationContUnread: notificationContUnread,
    ...homePageCtx,
    onHandleWillChangeTab: _onHandleWillChangeTab,
    openDrawer: () => {
      navigation.openDrawer();
    },
    onChangeTab: (routeName) => {
      homePageCtx.homePageDispatch(controllers.ChangeTab(routeName));
    },
    handlePushNotifyDataToWebView: (noti) => () => {
      // this.tabAppointmentRef?.current?.pushNotiDataToWebView(noti);

      if (!_.get(noti, "view")) {
        dispatch(
          actions.app.maskNotiAsReadById(noti?.merchantNotificationId || 0)
        );
      }
    },
  };
};
