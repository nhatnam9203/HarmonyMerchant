import IMAGE from "@resources";
import { DialogLayout } from "@shared/layouts";
import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";
import { RNCamera } from "react-native-camera";
import QRCodeScanner from "react-native-qrcode-scanner";
import { useDispatch } from "react-redux";
import { ButtonGradient, FormInput } from "@shared/components";

export const DialogScanQR = React.forwardRef(({ title, onSuccess }, ref) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const dialogRef = React.useRef(null);
  const textInputRef = React.useRef(null);

  const [value, setValue] = React.useState("");

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

  const onHandleSubmit = () => {
    dialogRef.current?.hide();
    // console.log(`====> onHandleSubmit:  ${value}`);
    if (typeof onSuccess === "function" && onSuccess) {
      onSuccess(value);
    }
    setValue("");
    textInputRef.current?.clear();
  };

  const onChangeValue = (text) => {
    setValue(text);
    dialogRef.current?.hide();

    if (typeof onSuccess === "function" && onSuccess) {
      onSuccess(text);
    }

    setTimeout(() => {
      setValue("");
      textInputRef.current?.clear();
    }, 100);
  };

  React.useImperativeHandle(ref, () => ({
    show: () => {
      setValue("");
      dialogRef.current?.show();
      // textInputRef.current?.focus();
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
          <View style={styles.camera}>
            <QRCodeScanner
              //ref={this.scannerRef}
              onRead={onHandleSuccess}
              // cameraProps={{ flashMode: RNCamera.Constants.FlashMode.auto }}
              flashMode={RNCamera.Constants.FlashMode.torch}
              showMarker={true}
              // reactivateTimeout={500}
              containerStyle={styles.qrStyle}
              cameraStyle={styles.qrStyle}
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

          <View style={styles.inputContent}>
            <FormInput
              // label={t("Input Barcode")}
              placeholder={t("Enter  barcode")}
              //required={true}
              onChangeValue={onChangeValue}
              defaultValue={""}
              // editable={false}
              textInputRef={textInputRef}
              autoFocus={true}
              showSoftInputOnFocus={false}
            >
              {/* <View style={layouts.marginHorizontal} /> */}
              {/* <ButtonGradient
                label={t("Submit")}
                width={scaleWidth(140)}
                height={scaleHeight(40)}
                borderRadius={scaleWidth(3)}
                disable={value?.length <= 0}
                onPress={onHandleSubmit}
              /> */}
            </FormInput>
          </View>
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
    width: scaleWidth(400),
    height: scaleHeight(400),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },

  qrStyle: {
    width: scaleWidth(400),
    height: scaleHeight(400),
  },

  markerStyle: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },

  marginVertical: {
    height: scaleHeight(10),
  },

  textCamera: {
    ...layouts.fontLightBlue,
    color: colors.WHITE,
    fontSize: scaleFont(14),
    fontStyle: "italic",
    fontWeight: "400",
  },

  inputContent: {
    width: "100%",
  },
});
