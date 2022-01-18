import { fonts } from "@shared/themes";
import React from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button } from "@components";

const backgroundImage = require("../Assets/images/pay_button_background.png");
const iconImage = require("../Assets/images/harmony_payment.png");

export const QRCodePayButton = ({ selected = false, onPress }) => {
  const textColor = selected ? "#fff" : "#404040";

  return (
    // <Pressable style={styles.container} onPress={onPress}>
    //   {({ pressed }) => (
    //     <ImageBackground
    //       style={styles.background}
    //       imageStyle={(pressed || selected) && { tintColor: "#0764B0" }}
    //       source={backgroundImage}
    //       resizeMode="center"
    //     >
    //       <Image
    //         source={iconImage}
    //         style={[styles.icon, { tintColor: pressed ? "#fff" : textColor }]}
    //       />
    //       <View style={styles.margin} />
    //       <Text style={[styles.text, { color: pressed ? "#fff" : textColor }]}>
    //         {"HarmonyPay GC"}
    //       </Text>
    //     </ImageBackground>
    //   )}
    // </Pressable>

    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        onPress={onPress}
        style={[
          {
            width: scaleWidth(250),
            height: scaleHeight(120),
            backgroundColor: selected ? "#0764B0" : "#fff",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
              },
              android: {
                elevation: 2,
              },
            }),
          },
          styles.background,
        ]}
      >
        <Image source={iconImage} style={[styles.icon, { tintColor: selected ? "#fff" : textColor }]} />
        <Text
          style={[styles.text, { color: selected ? "#fff" : textColor }]}
        >
          {"HarmonyPay GC"}
        </Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    // backgroundColor: "red",
  },

  background: {
    // width: scaleWidth(270),
    // height: scaleHeight(140),
    width: scaleWidth(250),
    height: scaleHeight(120),
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(18),
    color: "#404040",
    textAlign: "center",
  },

  margin: {
    height: scaleHeight(10),
    width: scaleWidth(10),
  },

  icon: { height: scaleHeight(48), width: scaleWidth(48) },
});
