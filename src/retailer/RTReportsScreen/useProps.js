import React from "react";
export const useProps = ({ navigation }) => {
  const screenReportRef = React.useRef(null);

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
  };
};
