import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";


const BOX_DEFAULT_WIDTH = 60;
const BOX_DEFAULT_HEIGHT = 45;

const ICON_DEFAULT_SIZE = 30;

const TEXT_DEFAULT_FONT_SIZE = 17;

export default function PopupButton({
  text,
  onPress = () => {},
  imageSrc,
  style = {},
  txtStyle = {},
  imageStyle = {},
  children,
}) {
  // console.log(`===========> text render ${text}========`);
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, styles.borderStyle, style]}>
        {children ?? (
          <View style={styles.content}>
            {text && text.length > 0 && (
              <Text style={[styles.text, txtStyle]}>{text || ""}</Text>
            )}
            {imageSrc && (
              <Image
                style={[styles.image, imageStyle]}
                source={imageSrc}
                resizeMode="center"
              />
            )}
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
  },
  text: {
    fontSize: TEXT_DEFAULT_FONT_SIZE,
    fontWeight: "normal",
    color: "#404040",
    marginHorizontal: 10,
  },
});
