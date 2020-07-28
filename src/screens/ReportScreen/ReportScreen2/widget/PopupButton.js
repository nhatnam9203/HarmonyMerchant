import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";

import IMAGE from "@resources";
import style from "../../style";

const BOX_DEFAULT_WIDTH = 135;
const BOX_DEFAULT_HEIGHT = 45;

const ICON_DEFAULT_SIZE = 24;

const TEXT_DEFAULT_FONT_SIZE = 17;

export default function PopupButton({
  text = "This Week",
  onPress = () => {},
  imageSrc = IMAGE.calendar,
  style = {},
  children,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, styles.borderStyle, style]}>
        {children ?? (
          <View style={styles.content}>
            <Text style={styles.text}>{text}</Text>
            <Image style={styles.image} source={imageSrc} resizeMode="center" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  borderStyle: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 2,
  },
  container: {
    height: BOX_DEFAULT_HEIGHT,
    minWidth: BOX_DEFAULT_WIDTH,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  image: {
    width: ICON_DEFAULT_SIZE,
    height: ICON_DEFAULT_SIZE,
    tintColor: "#6A6A6A",
    marginLeft: 10,
  },
  text: {
    fontSize: TEXT_DEFAULT_FONT_SIZE,
    fontWeight: "normal",
    color: "#404040",
    marginRight: 10,
  },
});
