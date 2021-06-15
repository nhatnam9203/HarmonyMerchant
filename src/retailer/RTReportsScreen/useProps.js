import React from "react";
export const useProps = ({ navigation }) => {
  const screenReportRef = React.useRef(null);

  const openDrawer = () => {
    navigation.openDrawer();
  };

  React.useEffect(() => {
    const didBlurSubscription = navigation.addListener("blur", (payload) => {
      screenReportRef?.current?.didBlur();
    });

    const didFocusSubscription = navigation.addListener("focus", (payload) => {
      //   const { profileStaffLogin } = this.props;
      //   const roleName = profileStaffLogin?.roleName || "Admin";
      //   if (roleName === "Admin") {
      //     screenReportRef?.current?.didFocus();
      //   } else {
      //     // this.props.actions.staff.toggleReportTabPermission();
      //   }
      screenReportRef?.current?.didFocus();
    });

    return () => {
      didBlurSubscription();
      didFocusSubscription();
    };
  }, []);

  return { openDrawer, screenReportRef, onShowBackButton: () => {} };
};
