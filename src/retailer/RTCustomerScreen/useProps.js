import React from "react";

export const useProps = ({ navigation }) => {
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

  return { openDrawer };
};
