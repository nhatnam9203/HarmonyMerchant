import { PopupCheckPermission } from "@shared/components";
import React from "react";
import { View } from "react-native";
import { usePermission } from "@shared/hooks";

export const WithPopupPermission = (WrappedComponent) => {
  return function WithDialogPhoneComponent({
    onPermission,
    tabName,
    ...props
  }) {
    const popupRef = React.useRef(null);
    const [value, setValue] = React.useState(null);
    const { isPermission } = usePermission(tabName);

    const showPopup = (val) => {
      if (!isPermission) {
        popupRef.current?.show();
        setValue(val);
      } else {
        onPermission(val);
      }
    };

    const onForceClosePopupPermission = () => {
      popupRef.current?.hide();
    };

    const onClosePopup = () => {
      if (onPermission && typeof onPermission === "function") {
        onPermission(value);
      }
    };

    return (
      <View>
        <WrappedComponent
          {...props}
          onPress={showPopup}
          onValueChange={showPopup}
        />
        <PopupCheckPermission
          ref={popupRef}
          onForceClosePopup={onForceClosePopupPermission}
          tabName={tabName}
          onClosePopup={onClosePopup}
        />
      </View>
    );
  };
};
