import IMAGE from "@resources";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { CustomTableCheckBox } from "./CustomCheckBox";

export const TableImageCell = ({
  imageUrl,
  width,
  onValueChange,
  defaultValue,
  Í,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, width && { width }]}
      onPress={() => {}}
      activeOpacity={1}
    >
      <CustomTableCheckBox
        defaultValue={defaultValue}
        onValueChange={onValueChange}
      />
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
    height: "100%",
    paddingHorizontal: scaleWidth(15),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  imageStyle: {
    width: scaleWidth(44),
    height: scaleHeight(44),
  },
});
