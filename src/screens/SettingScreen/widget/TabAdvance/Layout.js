import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, fonts, layouts } from "@shared/themes";
import { FormLabelSwitch } from "@shared/components";

export const Layout = ({ isLoyaltyProgram, setIsLoyaltyProgram }) => {
  return (
    <View style={styles.container}>
      <Title text={"Advance"} />
      <View style={styles.halfContent}>
        <FormLabelSwitch
          defaultValue={isLoyaltyProgram}
          onValueChange={setIsLoyaltyProgram}
          label={"Loyalty program"}
          textStyle={styles.text}
        />
      </View>
    </View>
  );
};

const Title = ({ text }) => <Text style={styles.header}>{`${text}`}</Text>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scaleWidth(15),
  },

  header: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(24),
    fontStyle: "normal",
    letterSpacing: 0,
    color: "rgb(37,37,37)",
  },

  text: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(18),
    fontStyle: "normal",
    letterSpacing: 0,
    color: "rgb(73,73,73)",
  },

  halfContent: {
    width: "50%",
    height: scaleHeight(100),
  },
});
