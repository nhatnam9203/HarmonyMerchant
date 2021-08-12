import actions from "@redux/actions";
import IMAGE from "@resources";
import { DialogLayout } from "@shared/layouts";
import { useGetCategoriesList } from "@shared/services/api/retailer";
import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Image, View, Text, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
const log = (obj, message = "") => {
  Logger.log(`[DialogPincode] ${message}`, obj);
};

export const DialogScanQR = React.forwardRef(({ title, onSuccess }, ref) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const dialogRef = React.useRef(null);
  /**
  |--------------------------------------------------
  | CALL API

  |--------------------------------------------------
  */
  const onHandleSuccess = (e) => {
    const code = e?.data;
    dialogRef.current?.hide();

    if (typeof onSuccess === "function" && onSuccess) {
      onSuccess(code);
    }
  };

  React.useImperativeHandle(ref, () => ({
    show: () => {
      // setValue('');
      dialogRef.current?.show();
    },
    hide: () => {
      dialogRef.current?.hide();
    },
  }));

  return (
    <View>
      <DialogLayout
        title={title ?? t("Scan QR code")}
        ref={dialogRef}
        style={styles.dialog}
      >
        <View style={styles.container}>
          <View style={styles.marginVertical} />

          <View style={styles.camera}>
            <QRCodeScanner
              //ref={this.scannerRef}
              onRead={onHandleSuccess}
              cameraProps={{ flashMode: RNCamera.Constants.FlashMode.auto }}
              showMarker={true}
              reactivateTimeout={500}
              containerStyle={styles.qrStyle}
              cameraStyle={styles.qrStyle}
              markerStyle={styles.qrStyle}
              cameraType="back"
              customMarker={
                <Image
                  style={styles.markerStyle}
                  source={IMAGE["scan_marker"]}
                />
              }
            />

            <Text style={styles.textCamera}>
              {t("Focus Camera on Barcode Or QR Code to Scan SKU Number")}
            </Text>
          </View>

          <View style={styles.marginVertical} />
        </View>
      </DialogLayout>
    </View>
  );
});

const styles = StyleSheet.create({
  dialog: {
    flex: 0,
    width: scaleWidth(480),
  },

  container: {
    justifyContent: "center",
    alignItems: "center",
  },

  row: { flexDirection: "row", alignItems: "center" },

  title: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(20),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.GREYISH_BROWN,
  },

  camera: {
    width: scaleWidth(480),
    height: scaleHeight(480),
    justifyContent: "center",
    alignItems: "center",
  },
  qrStyle: {
    width: scaleWidth(450),
    height: scaleHeight(450),
  },

  markerStyle: {
    width: scaleWidth(340),
    height: scaleHeight(340),
    resizeMode: "contain",
  },

  marginVertical: {
    height: scaleHeight(10),
  },
  textCamera: {
    ...layouts.fontLightBlue,
    color: colors.WHITE,
    fontSize: scaleFont(14),
    position: "absolute",
    bottom: scaleHeight(30),
    zIndex: 1000000,
    fontStyle: "italic",
    fontWeight: "400",
  },
});
