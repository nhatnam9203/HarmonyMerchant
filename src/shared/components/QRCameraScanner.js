import QRCodeScanner from "react-native-qrcode-scanner";
import IMAGE from "@resources";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors, fonts, layouts } from "@shared/themes";
import { useTranslation } from "react-i18next";

export const QRCameraScanner = ({ onReadCode }) => {
  const { t } = useTranslation();

  const [cameraType, setCameraType] = React.useState("back");

  const switchCamera = async () => {
    await setCameraType((prev) => (prev === "back" ? "front" : "back"));
  };

  return (
    <View style={styles.container}>
      <View style={styles.camera}>
        <QRCodeScanner
          onRead={onReadCode}
          containerStyle={styles.qrStyle}
          cameraStyle={styles.qrStyle}
          cameraType={cameraType}
          customMarker={
            <Image style={styles.markerStyle} source={IMAGE["scan_marker"]} />
          }
        />
        <TouchableOpacity
          style={{
            width: scaleWidth(35),
            height: scaleHeight(35),
            backgroundColor: "transparent",
            justifyContent: "center",
            alignSelf: "center",
          }}
          onPress={switchCamera}
        >
          <Image
            source={IMAGE.camera_switcher}
            style={{ width: scaleWidth(25), height: scaleHeight(25) }}
          />
        </TouchableOpacity>

        <View style={styles.marginVertical} />
        <Text style={styles.textCamera}>
          {t("Please! Focus Camera on Barcode (QR Code) to Scan!")}
        </Text>
        <View style={styles.marginVertical} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},

  camera: {
    width: scaleWidth(400),
    height: scaleHeight(400),
    backgroundColor: "#000",
    alignSelf: "center",
  },

  qrStyle: {
    width: scaleWidth(400),
    height: scaleHeight(400),
  },

  marginVertical: {
    height: scaleHeight(5),
  },

  textCamera: {
    ...layouts.fontLightBlue,
    color: colors.WHITE,
    fontSize: scaleFont(14),
    fontStyle: "italic",
    fontWeight: "400",
    textAlign: "center",
    width: "100%",
  },
});
