import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Button } from '@components';
export const ButtonIcon = ({
  width,
  height,
  imgWidth,
  imgHeight,
  borderRadius,
  borderWidth,
  source,
  borderColor,
  imgStyle,
  resizeMode,
  tintColor,
  style,
  ...rest
}) => {
  const styleButtonIcon = [
    styles.container,
    height && { height },
    width && { width },
    borderColor && { borderColor },
    borderWidth && { borderWidth },
    borderRadius && width && height && { borderRadius: width / 2 },
    style,
  ];

  const styleImage = [
    imgHeight && { height: imgHeight },
    imgWidth && { width: imgWidth },
    tintColor && { tintColor },
    imgStyle,
  ];

  return (
    <Button style={styleButtonIcon} {...rest}>
      <Image source={source} style={styleImage} resizeMode={resizeMode} />
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

ButtonIcon.defaultProps = {
  width: null,
  height: null,
  imgWidth: null,
  imgHeight: null,
  borderRadius: false,
  borderWidth: null,
  source: null,
  borderColor: null,
  imgStyle: {},
  resizeMode: 'contain',
  style: {},
};
