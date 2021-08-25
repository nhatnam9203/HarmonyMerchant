import React from "react";
import NavigationServices from "@navigators/NavigatorServices";
export const useProps = ({ navigation }) => {
  React.useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      if (navigation?.canGoBack()) {
        NavigationServices.navigate("retailer.home.order.list", {
          reload: true,
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
