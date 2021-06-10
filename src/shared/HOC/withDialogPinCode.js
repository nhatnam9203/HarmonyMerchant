import React from 'react';
import { View } from 'react-native';
import { DialogPinCode } from '@shared/components/DialogPinCode';
import { useSelector } from 'react-redux';

export const WithDialogPinCode = (WrappedComponent) => {
  return function WithDialogPinCodeComponent({ onPress, ...props }) {
    const dialogRef = React.useRef(null);
    const staff = useSelector((state) => state.authMerchant?.staff);
    const token = useSelector((state) => state.authMerchant?.token);

    const showPinCodeDialog = () => {
      dialogRef.current?.show();
    };

    const onHandlePinCodeSubmit = (value) => {
      dialogRef.current?.hide();

      if (onPress && typeof onPress === 'function') {
        onPress(value);
      }
    };

    React.useEffect(() => {
      if (!staff && token) {
        dialogRef.current?.show();
      }
    }, [staff]);

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
