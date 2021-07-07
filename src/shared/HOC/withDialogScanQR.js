import { DialogScanQR } from '@shared/components/DialogScanQR';
import React from 'react';
import { View } from 'react-native';

export const WithDialogScanQR = (WrappedComponent) => {
  return function WithDialogScanQRComponent({
    onResultScanCode,
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
        <DialogScanQR
          ref={dialogRef}
          title={title}
          onSuccess={onResultScanCode}
        />
      </View>
    );
  };
};
