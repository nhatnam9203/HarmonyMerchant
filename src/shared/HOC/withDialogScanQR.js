import { DialogScanQR } from "@shared/components/DialogScanQR";
import React from "react";
import { View } from "react-native";

export const WithDialogScanQR = (WrappedComponent) => {
  return function WithDialogScanQRComponent({
    onResultScanCode,
    title,
    autoHideWhenComplete = false,
    ...props
  }) {
    const dialogRef = React.useRef(null);
    const show = () => {
      dialogRef.current?.show();
    };

    const onHandleResultScanCode = (result) => {
      if (onResultScanCode && typeof onResultScanCode === "function") {
        onResultScanCode(result);
      }

      if (autoHideWhenComplete) dialogRef.current?.hide();
    };

    return (
      <View>
        <WrappedComponent {...props} onPress={show} />
        <DialogScanQR
          ref={dialogRef}
          title={title}
          onSuccess={onHandleResultScanCode}
        />
      </View>
    );
  };
};
