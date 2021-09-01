import { StaffCheckInDialog } from "@shared/components/StaffCheckInDialog";
import React from "react";
import { View } from "react-native";

export const WithDialogStaffCheckIn = (WrappedComponent) => {
  return function WithDialogStaffCheckInComponent({
    onSubmit,
    title,
    ...props
  }) {
    const dialogRef = React.useRef(null);
    const show = () => {
      dialogRef.current?.show();
    };

    return (
      <View>
        <WrappedComponent {...props} onPress={show} />
        <StaffCheckInDialog
          ref={dialogRef}
          title={title}
          onSuccess={onSubmit}
        />
      </View>
    );
  };
};
