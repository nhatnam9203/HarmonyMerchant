import React from "react";
export const useProps = ({ navigation }) => {
  React.useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      // navigation?.popToTop();
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {});

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  return {};
};
