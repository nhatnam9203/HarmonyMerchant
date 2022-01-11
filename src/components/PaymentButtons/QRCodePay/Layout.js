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
import { PopupScanCode, PopupCardDetail } from "../widget";

const backgroundImage = require("../Assets/images/pay_button_background.png");
const iconImage = require("../Assets/images/harmony_payment.png");

export const QRCodePayButton = ({ selected = false }) => {
  const textColor = selected ? "#fff" : "#404040";

  const popupScanRef = React.useRef(null);
  const popupCardDetailRef = React.useRef(null);

  const onShowQRCodeScan = () => {
    popupScanRef.current?.show();
  };

  const onResultScanCode = (data) => {
    console.log(data);

    // check serial number if giftcard

    // check consumer card

    // Test
    setTimeout(() => {
      popupCardDetailRef.current?.show();
    }, 1200);
  };

  return (
    <>
      <Pressable style={styles.container} onPress={onShowQRCodeScan}>
        {({ pressed }) => (
          <ImageBackground
            style={styles.background}
            imageStyle={(pressed || selected) && { tintColor: "#0764B0" }}
            source={backgroundImage}
            resizeMode="center"
          >
            <Image
              source={iconImage}
              style={[styles.icon, { tintColor: pressed ? "#fff" : textColor }]}
            />
            <View style={styles.margin} />
            <Text
              style={[styles.text, { color: pressed ? "#fff" : textColor }]}
            >
              {"HarmonyPay GC"}
            </Text>
          </ImageBackground>
        )}
      </Pressable>
      <PopupScanCode ref={popupScanRef} onSuccess={onResultScanCode} />
      <PopupCardDetail ref={popupCardDetailRef} onSuccess={onResultScanCode} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
  },

  background: {
    width: scaleWidth(270),
    height: scaleHeight(140),
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
