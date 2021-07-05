import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export const ButtonNormal = ({
  width,
  height,
  borderRadius,
  backgroundColor = colors.WEIRD_GREEN,
  label,
  textStyle,
  textColor,
  onPress,
  borderColor = "#ccc",
  fontSize,
  fontWeight,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        layouts.center,
        width && { width },
        height && { height },
        borderRadius && { borderRadius },
        backgroundColor && { backgroundColor },
        borderColor && { borderColor },
      ]}
    >
      {label && (
        <Text
          style={[
            styles.buttonText,
            textStyle,
            textColor && { color: textColor },
            fontSize && { fontSize },
            fontWeight && { fontWeight },
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export const BlueButtonStyle = {
  textColor: colors.WHITE,
  pressTextColor: colors.PALE_GREY,
  firstColor: colors.OCEAN_BLUE,
  pressFirstColor: colors.VERY_LIGHT_PINK_1,
  lastColor: colors.CERULEAN,
  pressLastColor: colors.WHITE,
};

export const ButtonGradient = ({
  width,
  height,
  borderRadius = 1,
  label,
  textStyle,
  onPress,
  borderWidth = scaleWidth(1),
  fontSize,
  fontWeight,
  children,
  disable,
  leftChildren,
  textColor = colors.WHITE,
  pressTextColor = colors.GREYISH_BROWN,
  firstColor = colors.OCEAN_BLUE,
  pressFirstColor = colors.VERY_LIGHT_PINK_1,
  lastColor = colors.CERULEAN,
  pressLastColor = colors.WHITE,
  borderColor = colors.OCEAN_BLUE,
  pressBorderColor = "#ccc",
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { borderRadius },
        width && { width },
        height && { height },
        { borderColor: pressed ? pressBorderColor : borderColor },
        borderWidth && { borderWidth },
        disable && { opacity: 0.6 },
      ]}
      disabled={disable}
    >
      {({ pressed }) => (
        <LinearGradient
          style={[styles.linear, layouts.center]}
          colors={
            pressed
              ? [pressLastColor, pressFirstColor]
              : [lastColor, firstColor]
          }
        >
          {leftChildren && leftChildren()}

          {label && (
            <Text
              style={[
                styles.buttonText,
                textStyle,
                { color: pressed ? pressTextColor : textColor },
                fontSize && { fontSize },
                fontWeight && { fontWeight },
              ]}
            >
              {label}
            </Text>
          )}
          {children}
        </LinearGradient>
      )}
    </Pressable>
  );
};

export const ButtonGradientWhite = ({
  textColor,
  borderRadius = scaleHeight(1),
  borderColor = "#ccc",
  ...props
}) => (
  <ButtonGradient
    {...props}
    firstColor={colors.VERY_LIGHT_PINK_1}
    pressFirstColor={colors.OCEAN_BLUE}
    lastColor={colors.WHITE}
    pressLastColor={colors.CERULEAN}
    textColor={textColor ?? colors.GREYISH_BROWN}
    pressTextColor={colors.WHITE}
    borderColor={borderColor}
    pressBorderColor={colors.OCEAN_BLUE}
    borderWidth={scaleHeight(1)}
    borderRadius={borderRadius}
  />
);

export const ButtonGradientRed = ({
  textColor,
  borderRadius = scaleHeight(1),
  borderColor,
  ...props
}) => (
  <ButtonGradient
    {...props}
    firstColor={colors.ORANGEY_RED}
    lastColor={colors.TOMATO}
    textColor={textColor ?? colors.PALE_GREY}
    borderColor
    borderWidth={0}
    borderRadius={borderRadius}
  />
);

const styles = StyleSheet.create({
  button: {
    height: "100%",
    borderRadius: scaleHeight(3),
    overflow: "hidden",
  },

  buttonText: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.WHITE,
  },

  linear: {
    flex: 1,
    flexDirection: "row",
    padding: scaleWidth(6),
  },
});
