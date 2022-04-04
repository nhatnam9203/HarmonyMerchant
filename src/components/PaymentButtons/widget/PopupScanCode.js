import IMAGE from "@resources";
import { ButtonGradient, FormInput } from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";

export const PopupScanCode = React.forwardRef(({ title, onSuccess }, ref) => {
  const [t] = useTranslation();
  const dialogRef = React.useRef(null);
  const textInputRef = React.useRef(null);

  const [value, setValue] = React.useState("");
  const [softInputOnFocus, showSoftInputOnFocus] = React.useState(false);
  const [cameraType, setCameraType] = React.useState("back");

  const hidePopup = async () => {
    await setValue("");
    await showSoftInputOnFocus(false);

    textInputRef.current?.clear();
    dialogRef.current?.hide();
  };

  const handleSubmit = (text) => {
    if (typeof onSuccess === "function" && onSuccess) {
      console.log(text);
      onSuccess(text);
    }
  };

  const onSubmitButtonPress = (e) => {
    handleSubmit(value);
    hidePopup();
  };

  const onReadCode = (event) => {
    if (event) {
      // const codeString = event.nativeEvent?.codeStringValue;
      const codeString = event?.data;
      handleSubmit(codeString);
    }
    hidePopup();
  };

  const showKeyboardInput = async () => {
    await showSoftInputOnFocus(true);
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 500);
  };

  const onModalWillHide = async () => {
    await setValue("");
    await showSoftInputOnFocus(false);

    textInputRef.current?.clear();
  };

  React.useImperativeHandle(ref, () => ({
    show: () => {
      dialogRef.current?.show();
    },
    hide: hidePopup,
  }));

  const switchCamera = async () => {
    await setCameraType((prev) => (prev === "back" ? "front" : "back"));
  };

  return (
    <View>
      <DialogLayout
        title={title ?? t("HarmonyPay - Gift Card")}
        ref={dialogRef}
        style={styles.dialog}
        onModalWillHide={onModalWillHide}
      >
        <View style={styles.container}>
          <View style={styles.camera}>
            {/* <CameraScreen
              scanBarcode={true}
              onReadCode={onReadCode} // optional
              laserColor="#0764B0" // (default red) optional, color of laser in scanner frame
              frameColor="white" // (default white) optional, color of border of scanner frame
              showFrame={true} //(default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
              hideControls={true}
              offsetForScannerFrame={400}
              heightForScannerFrame={400}
              colorForScannerFrame={"blue"}
            /> */}
            <QRCodeScanner
              //ref={this.scannerRef}
              onRead={onReadCode}
              showMarker={true}
              // flashMode={RNCamera.Constants.FlashMode.off}
              // reactivateTimeout={500}
              reactivateTimeout={500}
              containerStyle={styles.qrStyle}
              cameraStyle={styles.qrStyle}
              cameraType={cameraType}
              customMarker={
                <Image
                  style={styles.markerStyle}
                  source={IMAGE["scan_marker"]}
                />
              }
            />
            <TouchableOpacity
              style={{
                width: scaleWidth(50),
                height: scaleHeight(50),
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
          </View>
          <View style={styles.marginVertical} />
          <Text style={styles.textCamera}>
            {t("Please! Focus Camera on Barcode Or QR Code to Scan")}
          </Text>
          <View style={styles.inputContent}>
            <FormInput
              // label={t("Input Barcode")}
              placeholder={t("Enter code here")}
              //required={true}
              onChangeValue={setValue}
              defaultValue={""}
              // editable={false}
              textInputRef={textInputRef}
              autoFocus={true}
              showSoftInputOnFocus={softInputOnFocus}
              autoCorrect={false}
            >
              <View style={{ width: 3 }} />
              <ButtonGradient
                label={t("Submit")}
                width={scaleWidth(120)}
                height={scaleHeight(40)}
                borderRadius={scaleWidth(3)}
                disable={value?.length <= 0}
                onPress={onSubmitButtonPress}
              />
            </FormInput>
            <TouchableOpacity
              style={styles.editButton}
              onPress={showKeyboardInput}
            >
              <Image
                style={[
                  styles.icon,
                  { tintColor: softInputOnFocus ? "#0764B0" : "#666" },
                ]}
                source={IMAGE["edit_customer_icon"]}
              />
            </TouchableOpacity>
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
    // justifyContent: "center",
    // alignItems: "center",
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
    backgroundColor: "#000",
    alignSelf: "center",
  },

  qrStyle: {
    width: scaleWidth(400),
    height: scaleHeight(400),
  },

  markerStyle: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },

  marginVertical: {
    height: scaleHeight(10),
  },

  textCamera: {
    ...layouts.fontLightBlue,
    color: colors.GREYISH_BROWN,
    fontSize: scaleFont(14),
    fontStyle: "italic",
    fontWeight: "400",
    textAlign: "center",
    width: "100%",
  },

  inputContent: {
    width: "100%",
  },

  editButton: {
    top: 0,
    bottom: 0,
    right: scaleWidth(120),
    // height: scaleHeight(40),
    width: scaleWidth(50),
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },

  icon: {
    width: scaleWidth(20),
    height: scaleHeight(20),
    tintColor: "grey",
  },
});
