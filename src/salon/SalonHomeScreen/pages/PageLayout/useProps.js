import React from "react";
import * as controllers from "../../controllers";
import { ScreenName } from "@src/ScreenName";

export const useProps = ({ navigation }) => {
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
    ...homePageCtx,
    onHandleWillChangeTab: _onHandleWillChangeTab,
    openDrawer: () => {
      navigation.openDrawer();
    },
    onChangeTab: (routeName) => {
      homePageCtx.homePageDispatch(controllers.ChangeTab(routeName));
    },
  };
};
