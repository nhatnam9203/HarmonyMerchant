import React from "react";
import { Pressable, Image, StyleSheet, TouchableOpacity } from "react-native";
import IMAGE from "@resources";

export const Row = ({
  style,
  children,
  onPress,
  disabled,
  height,
  onLongPress,
  onPressOut,
  isDragging,
  draggable = false,
  highlight = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        style,
        height && { height },
        isDragging && styles.shadow,
        highlight && { backgroundColor: "#ffa" },
      ]}
      onLongPress={onLongPress}
      onPressOut={onPressOut}
    >
      {draggable && <Image source={IMAGE.indicate} style={styles.image} />}
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "100%",
  },

  shadow: {
    shadowColor: "#0000001a",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 6,
    shadowOpacity: 0.42,
  },

  image: {
    height: "100%",
    width: scaleWidth(30),
    resizeMode: "center",
  },
});
