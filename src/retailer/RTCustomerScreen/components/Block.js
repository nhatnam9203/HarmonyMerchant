import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { scaleSize } from '@utils';
export const Block = ({
  middle,
  center,
  top,
  bottom,
  left,
  right,
  space,
  row,
  width,
  height,
  flex,
  backgroundColor,
  border,
  style,
  children,
  ...rest
}) => {
  const styleBlock = [
    styles.column,
    row && styles.row,
    flex && { flex: flex === true ? 1 : flex },
    center && styles.center,
    middle && styles.middle,
    top && styles.top,
    bottom && styles.bottom,
    right && styles.right,
    left && styles.left,
    space && { justifyContent: `${space}` },
    height && { height },
    width && { width },
    backgroundColor && { backgroundColor: `${backgroundColor}` },
    border && border === true ? styles.border : border,
    style,
  ];

  return (
    <View style={styleBlock} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  column: { flexDirection: 'column' },
  row: { flexDirection: 'row' },
  middle: { alignItems: 'center', justifyContent: 'center' },
  left: { alignItems: 'flex-start' },
  right: { alignItems: 'flex-end' },
  center: { alignItems: 'center', alignSelf: 'center' },
  top: { alignItems: 'flex-start', alignSelf: 'flex-start' },
  bottom: { alignItems: 'flex-end', alignSelf: 'flex-end' },
  border: {
    borderColor: '#C5C5C5',
    borderWidth: 1,
    borderRadius: scaleSize(4),
  },
});

Block.defaultProps = {
  row: false,
  flex: false,
  center: false,
  middle: false,
  top: false,
  bottom: false,
  right: false,
  left: false,
  space: null,
  height: null,
  width: null,
  backgroundColor: null,
  style: {},
};
