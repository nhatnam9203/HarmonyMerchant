import { DialogConfirm } from '@shared/components/DialogConfirm';
import React from 'react';
import { View } from 'react-native';

export const WithDialogConfirm = (WrappedComponent) => {
  return function WithDialogConfirmComponent({
    onPress,
    description,
    ...props
  }) {
    const dialogRef = React.useRef(null);
    const showConfirmDialog = () => {
      dialogRef.current?.show();
    };

    const onHandleConfirmYes = () => {
      if (onPress && typeof onPress === 'function') {
        onPress();
      }
    };

    return (
      <View>
        <WrappedComponent {...props} onPress={showConfirmDialog} onValueChange={showConfirmDialog} />
        <DialogConfirm
          ref={dialogRef}
          onConfirmYes={onHandleConfirmYes}
          description={description}
        />
      </View>
    );
  };
};
