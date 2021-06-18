import React from 'react';
import { TouchableOpacity, Text, Linking } from 'react-native';
import { layouts } from '@shared/themes';
NUMBER_SPACE = scaleWidth(15);
export const CustomLink = ({ url, style }) => {
  const openUrl = async () => {
    const validLink = await Linking.canOpenURL(url);
    if (!!validLink) {
      Linking.openURL(url);
    }
  };

  return (
    <TouchableOpacity
      hitSlop={{
        left: NUMBER_SPACE,
        right: NUMBER_SPACE,
        top: NUMBER_SPACE,
        bottom: NUMBER_SPACE,
      }}
      onPress={openUrl}
      activeOpacity={0.7}
    >
      <Text style={[layouts.fontLightBlue, style]}>{url}</Text>
    </TouchableOpacity>
  );
};
