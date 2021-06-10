import React from 'react';
import { StyleSheet, Image, Text } from 'react-native';
import { Block } from './Block';
import { ButtonIcon } from './ButtonIcon';
import { scaleSize } from '@utils';
import { Button } from '@components';
import ICON from '@resources';
export const Pagination = ({
  currentPage = 2,
  pages = 55,
  //   width,
  //   height,
  //   imgWidth,
  //   imgHeight,
  //   borderRadius,
  //   borderWidth,
  //   source,
  //   borderColor,
  //   imgStyle,
  //   resizeMode,
  //   style,
  ...rest
}) => {
  //   const styleButtonIcon = [
  //     styles.container,
  //     height && { height },
  //     width && { width },
  //     borderColor && { borderColor },
  //     borderWidth && { borderWidth },
  //     borderRadius && width && height && { borderRadius: width / 2 },
  //     style,
  //   ];

  //   const styleImage = [
  //     height && { height: imgHeight ?? height / 2 },
  //     width && { width: imgWidth ?? width / 2 },
  //     imgStyle,
  //   ];

  return (
    <Block row middle width={scaleSize(140)} space="space-between">
      <ButtonIcon
        disabled={currentPage < 2}
        borderWidth={1}
        borderColor="#CCCCCC"
        source={ICON.ArrowLeft}
        width={scaleSize(32)}
        height={scaleSize(32)}
        imgWidth={scaleSize(10)}
        imgHeight={scaleSize(10)}
        tintColor="#6A6A6A"
        style={currentPage < 2 && { opacity: 0.5 }}
      />
      <Block border center middle width={scaleSize(60)} height={scaleSize(32)}>
        <Text style={styles.txtStyle}>{`${currentPage}/${pages}`}</Text>
      </Block>
      <ButtonIcon
        borderWidth={1}
        borderColor="#CCCCCC"
        source={ICON.ArrowRight}
        width={scaleSize(32)}
        height={scaleSize(32)}
        imgWidth={scaleSize(10)}
        imgHeight={scaleSize(10)}
        tintColor="#6A6A6A"
      />
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtStyle: {
    fontSize: scaleSize(14),
    color: '#404040',
  },
});

// Pagination.defaultProps = {
//   width: null,
//   height: null,
//   imgWidth: null,
//   imgHeight: null,
//   borderRadius: false,
//   borderWidth: null,
//   source: null,
//   borderColor: null,
//   imgStyle: {},
//   resizeMode: 'contain',
//   style: {},
// };
