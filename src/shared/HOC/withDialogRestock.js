import { DialogRestock } from "@shared/components/DialogRestock";
import React from "react";
import { View } from "react-native";

export const WithDialogRestock = (WrappedComponent) => {
  return function WithDialogRestockComponent({
    onPress,
    dialogTitle,
    dialogLabel,
    ...props
  }) {
    const dialogRef = React.useRef(null);
    const showRestockDialog = () => {
      dialogRef.current?.show();
    };

    const onHandleRestockSubmit = (value, reason) => {
      if (onPress && typeof onPress === "function") {
        onPress(value, reason);
      }
    };

    return (
      <View>
        <WrappedComponent {...props} onPress={showRestockDialog} />
        <DialogRestock
          ref={dialogRef}
          onRestockSubmit={onHandleRestockSubmit}
          title={dialogTitle}
          label={dialogLabel}
        />
      </View>
    );
  };
};
