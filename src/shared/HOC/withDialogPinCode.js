import React from "react";
import { View } from "react-native";
import { DialogPinCode } from "@shared/components/DialogPinCode";
import { useSelector } from "react-redux";

export const WithDialogPinCode = (WrappedComponent) => {
  return function WithDialogPinCodeComponent({ onPress, ...props }) {
    const dialogRef = React.useRef(null);
    const isShowButtonEnterPinCode = useSelector(
      (state) => state.staff?.isShowButtonEnterPinCode
    );

    const showPinCodeDialog = () => {
      dialogRef.current?.show();
    };

    const onHandlePinCodeSubmit = (value) => {
      dialogRef.current?.hide();

      if (onPress && typeof onPress === "function") {
        onPress(value);
      }
    };

    React.useEffect(() => {
      if (isShowButtonEnterPinCode) {
        dialogRef.current?.show();
      }
    }, [isShowButtonEnterPinCode]);

    return (
      <View>
        <WrappedComponent {...props} onPress={showPinCodeDialog} />
        <DialogPinCode
          ref={dialogRef}
          onPinCodeSubmit={onHandlePinCodeSubmit}
        />
      </View>
    );
  };
};
