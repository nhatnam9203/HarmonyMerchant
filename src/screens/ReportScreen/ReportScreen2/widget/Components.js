import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";

import IMAGE from "@resources";

const MARGIN_Y = 10;
const MARGIN_X = 10;
const TOOLTIP_DEFAULT_HEIGHT = 50;
const BOX_DEFAULT_WIDTH = 160;
const BOX_DEFAULT_HEIGHT = 40;
const ICON_DEFAULT_SIZE = 24;

export function HeaderTitle({ title, style = {} }) {
  return (
    <Text
      style={[
        style,
        {
          fontSize: 17,
          fontWeight: "bold",
          color: "#404040",
          marginVertical: MARGIN_Y,
        },
      ]}
    >
      {title}
    </Text>
  );
}

export function HeaderTooltip({ children }) {
  return (
    <View
      style={{
        height: TOOLTIP_DEFAULT_HEIGHT,
        marginVertical: MARGIN_Y,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {children && children}
    </View>
  );
}

export function DateTimePickerButton({ timeText = "This Week" }) {
  return (
    <TouchableOpacity>
      <View
        style={[
          styles.borderStyle,
          {
            height: BOX_DEFAULT_HEIGHT,
            width: BOX_DEFAULT_WIDTH,
            flexDirection: "row",
            marginRight: 20,
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
          },
        ]}
      >
        <Text>{timeText}</Text>
        <Image
          style={{
            width: ICON_DEFAULT_SIZE,
            height: ICON_DEFAULT_SIZE,
            tintColor: "#6A6A6A",
          }}
          source={IMAGE.calendar}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  borderStyle: {
    borderWidth: 1,
    borderColor: "#C5C5C5",
    borderRadius: 4,
    backgroundColor: "rgb(246,246,246)",
  },
});
