import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Spinner from "react-native-spinkit";

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
      {!!label && (
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
  label = " ",
  textStyle,
  onPress,
  borderWidth = scaleWidth(1),
  fontSize,
  fontWeight,
  children,
  disable,
  leftChildren,
  textColor = colors.WHITE,
  pressTextColor = colors.WHITE,
  firstColor = colors.OCEAN_BLUE,
  pressFirstColor = colors.OCEAN_BLUE,
  lastColor = colors.CERULEAN,
  pressLastColor = colors.PEACOCK_BLUE,
  borderColor = colors.OCEAN_BLUE,
  pressBorderColor = colors.OCEAN_BLUE,
  loading = false,
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

          {loading ? (
            <Spinner
              style={styles.spinner}
              type={"Circle"}
              size={scaleWidth(25)}
              color="#fff"
            />
          ) : (
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
    lastColor={colors.WHITE}
    textColor={textColor ?? colors.GREYISH_BROWN}
    borderColor={borderColor}
    pressFirstColor={colors.VERY_LIGHT_PINK_1}
    pressLastColor={colors.WHITE_TWO}
    pressTextColor={colors.GREYISH_BROWN}
    pressBorderColor={borderColor}
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
    firstColor={colors.TOMATO}
    lastColor={colors.ORANGEY_RED}
    textColor={textColor ?? colors.PALE_GREY}
    borderColor
    pressFirstColor={colors.TOMATO}
    pressLastColor={colors.TOMATO}
    pressTextColor={colors.PALE_GREY}
    pressBorderColor={borderColor}
    borderWidth={0}
    borderRadius={borderRadius}
  />
);

export const ButtonGradientGreen = ({
  textColor,
  borderRadius = scaleHeight(1),
  borderColor,
  ...props
}) => (
  <ButtonGradient
    {...props}
    lastColor="#4cd964"
    firstColor="#33cc33"
    textColor={textColor ?? colors.PALE_GREY}
    borderColor
    pressFirstColor="#33cc33"
    pressLastColor="#33cc33"
    pressTextColor={colors.PALE_GREY}
    pressBorderColor={borderColor}
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

  spinner: {
    justifyContent: "center",
    alignItems: "center",
  },
});
