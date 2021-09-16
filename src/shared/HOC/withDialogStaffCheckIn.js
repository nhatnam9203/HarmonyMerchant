import { StaffCheckInDialog } from "@shared/components/StaffCheckInDialog";
import React from "react";
import { View } from "react-native";

export const WithDialogStaffCheckIn = (WrappedComponent) => {
  return function WithDialogStaffCheckInComponent({
    showEditForm,
    onSuccess,
    ...props
  }) {
    const dialogRef = React.useRef(null);
    const show = () => {
      if (showEditForm && typeof showEditForm === "function") {
        const item = showEditForm();
        dialogRef.current?.showWithItem(item);
      } else {
        dialogRef.current?.show();
      }
    };

    return (
      <View>
        <WrappedComponent {...props} onPress={show} />
        <StaffCheckInDialog ref={dialogRef} onSuccess={onSuccess} />
      </View>
    );
  };
};
