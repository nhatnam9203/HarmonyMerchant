import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CustomTableCheckBox } from './CustomCheckBox';
import FastImage from 'react-native-fast-image';
import IMAGE from '@resources';

export const TableImageCell = ({
  imageUrl,
  width,
  onValueChange,
  defaultValue,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, width && { width }]}
      onPress={() => {}}
      activeOpacity={1}
    >
      <CustomTableCheckBox value={defaultValue} onValueChange={onValueChange} />
      <FastImage
        style={styles.imageStyle}
        source={
          imageUrl
            ? {
                uri: imageUrl,
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }
            : IMAGE.product_holder
        }
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingHorizontal: scaleWidth(15),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  imageStyle: {
    width: scaleWidth(44),
    height: scaleHeight(44),
  },
});
