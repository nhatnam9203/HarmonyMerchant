import { DialogPhone } from '@shared/components/DialogPhone';
import React from 'react';
import { View } from 'react-native';

export const WithDialogPhone = (WrappedComponent) => {
  return function WithDialogPhoneComponent({
    onPress,
    dialogPhoneRef,
    ...props
  }) {
    // const dialogRef = React.useRef(null);
    const showPhoneDialog = () => {
      dialogPhoneRef.current?.show();
    };

    const onHandlePhoneSubmit = (value) => {
      dialogPhoneRef.current?.hide();

      if (onPress && typeof onPress === 'function') {
        onPress(value);
      }
    };

    return (
      <View>
        <WrappedComponent {...props} onPress={showPhoneDialog} />
        <DialogPhone ref={dialogPhoneRef} onPhoneSubmit={onHandlePhoneSubmit} />
      </View>
    );
  };
};
