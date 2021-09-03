import React from "react";
import NavigationServices from "@navigators/NavigatorServices";
import { PURCHASE_POINTS_STORE } from "@shared/utils";

export const useProps = ({ navigation }) => {
  React.useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      if (navigation?.canGoBack()) {
        NavigationServices.navigate("retailer.home.order.check_out", {
          purchasePoint: PURCHASE_POINTS_STORE,
        });
      }
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {});

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  return {};
};
