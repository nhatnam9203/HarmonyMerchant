import { ButtonGradient, FormInput } from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { CameraScreen } from "react-native-camera-kit";

export const PopupScanCode = React.forwardRef(({ title, onSuccess }, ref) => {
  const [t] = useTranslation();
  const dialogRef = React.useRef(null);
  const textInputRef = React.useRef(null);

  const [value, setValue] = React.useState("");

  const hidePopup = () => {
    setValue("");
    textInputRef.current?.clear();
    dialogRef.current?.hide();
  };

  const handleSubmit = (text) => {
    if (typeof onSuccess === "function" && onSuccess) {
      onSuccess(text);
    }
  };

  const onSubmitButtonPress = (e) => {
    handleSubmit(value);
    hidePopup();
  };

  const onReadCode = (event) => {
    if (event) {
      const codeString = event.nativeEvent?.codeStringValue;
      handleSubmit(codeString);
    }
    hidePopup();
  };

  React.useImperativeHandle(ref, () => ({
    show: () => {
      dialogRef.current?.show();
    },
    hide: hidePopup,
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
            <CameraScreen
              scanBarcode={true}
              onReadCode={onReadCode} // optional
              laserColor="#0764B0" // (default red) optional, color of laser in scanner frame
              frameColor="white" // (default white) optional, color of border of scanner frame
              showFrame={true} //(default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
              hideControls={true}
              offsetForScannerFrame={400}
              heightForScannerFrame={400}
              colorForScannerFrame={"blue"}
            />
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
              showSoftInputOnFocus={false}
            >
              {/* <View style={layouts.marginHorizontal} /> */}
              <ButtonGradient
                label={t("Submit")}
                width={scaleWidth(120)}
                height={scaleHeight(40)}
                borderRadius={scaleWidth(3)}
                disable={value?.length <= 0}
                onPress={onSubmitButtonPress}
              />
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
    width: scaleWidth(440),
    height: scaleHeight(400),
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
});
