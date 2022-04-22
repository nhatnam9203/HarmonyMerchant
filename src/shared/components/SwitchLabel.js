import { colors, fonts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, Switch, Text, View } from "react-native";

export const SwitchLabel = ({
  label = "Switch Label",
  style,
  textStyle,
  toggleSwitch,
  isEnabled,
  disabled = false,
  isLabelFront = true,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <View style={[styles.container, style]}>
      {isLabelFront && (
        <Text style={textStyle ?? styles.textStyle}>{label}</Text>
      )}
      <Switch
        trackColor={{ false: colors.WHITE, true: colors.OCEAN_BLUE }}
        thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
        ios_backgroundColor="#BCBCBC"
        onValueChange={toggleSwitch}
        value={isEnabled}
        disabled={disabled}
        style={{
          transform: [{ scale: Platform.OS === "ios" ? 0.9 : 1 }],
        }}
      />
      {!isLabelFront && (
        <Text style={textStyle ?? styles.textStyle}>{label}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: scaleHeight(8),
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  textStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },
});
