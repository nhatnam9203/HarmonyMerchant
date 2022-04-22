import { DialogStaffLogTime } from "@shared/components";
import React from "react";
import { View } from "react-native";

export const WithDialogStaffLogTime = (WrappedComponent) => {
  return function WithDialogStaffLogTimeComponent({
    showEditForm,
    onSuccess,
    onShowed,
    ...props
  }) {
    const dialogRef = React.useRef(null);

    const show = () => {
      //   if (showEditForm && typeof showEditForm === "function") {
      //     const item = showEditForm();
      //     dialogRef.current?.showWithItem(item);
      //   } else {
      //     dialogRef.current?.show();
      //     if (onShowed && typeof onShowed === "function") {
      //       onShowed();
      //     }
      //   }

      dialogRef.current?.show();
    };

    return (
      <View>
        <WrappedComponent {...props} onPress={show} />
        <DialogStaffLogTime ref={dialogRef} />
      </View>
    );
  };
};
