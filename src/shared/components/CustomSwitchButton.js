import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import IMAGE from '@resources';
export const CustomSwitchButton = ({
  onPress,
  defaultValue = false,
  disabled,
}) => {
  const [isEnabled, setIsEnabled] = React.useState(defaultValue);

  React.useEffect(() => {
    setIsEnabled(defaultValue);
  }, [defaultValue]);

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <Image
        source={
          isEnabled
            ? IMAGE['switch_button_active']
            : IMAGE['switch_button_inactive']
        }
        resizeMode="contain"
        style={{
          width: scaleWidth(40),
          height: scaleHeight(40),
        }}
      />
    </TouchableOpacity>
  );
};
