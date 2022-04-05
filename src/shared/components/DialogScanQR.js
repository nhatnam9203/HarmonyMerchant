import IMAGE from "@resources";
import { InputText } from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { RNCamera } from "react-native-camera";
import QRCodeScanner from "react-native-qrcode-scanner";
import { useDispatch } from "react-redux";
import { QRCameraScanner } from "./QRCameraScanner";
import { Keyboard } from "react-native";

export const DialogScanQR = React.forwardRef(({ title, onSuccess }, ref) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const dialogRef = React.useRef(null);
  const timeOutRef = React.useRef(null);
  const textInputRef = React.useRef(null);

  const [value, setValue] = React.useState(null);
  const [softInputOnFocus, showSoftInputOnFocus] = React.useState(false);

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const onHandleSuccess = (e) => {
    const code = e?.data;

    if (typeof onSuccess === "function" && onSuccess) {
      onSuccess(code);
    }
  };

  const onHandleChangeText = (text) => {
    setValue(text);
    if (timeOutRef.current) clearTimeout(timeOutRef.current);
    timeOutRef.current = setTimeout(() => {
      if (typeof onSuccess === "function" && onSuccess) {
        onSuccess(text);
      }
      setValue("");
    }, 1500);
  };

  const onEditing = () => {
    showSoftInputOnFocus((prev) => !prev);
  };

  const onModalWillHide = async () => {
    setValue("");
    showSoftInputOnFocus(false);
    textInputRef.current?.clear();
  };

  React.useEffect(() => {
    if (softInputOnFocus) {
      textInputRef.current?.blur();
    } else {
      Keyboard.dismiss();
      textInputRef.current?.focus();
    }
  }, [softInputOnFocus]);

  React.useImperativeHandle(ref, () => ({
    show: () => {
      setValue("");
      dialogRef.current?.show();
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 1000);
    },
    hide: () => {
      dialogRef.current?.hide();
    },
    isShow: () => {
      return dialogRef.current?.isShow();
    },
  }));

  return (
    <View>
      <DialogLayout
        title={title ?? t("Scan QR code")}
        ref={dialogRef}
        style={styles.dialog}
        onModalWillHide={onModalWillHide}
      >
        <View style={styles.container}>
          <QRCameraScanner onReadCode={onHandleSuccess} />
          <View style={styles.margin} />
          <View style={styles.inputContent}>
            <InputText
              txtInputRef={textInputRef}
              placeholder={t("Enter  barcode")}
              onChangeText={onHandleChangeText}
              value={value}
              // autoFocus={true}
              showSoftInputOnFocus={softInputOnFocus}
              style={{ flex: 1 }}
            />

            <TouchableOpacity style={styles.editButton} onPress={onEditing}>
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
    width: scaleWidth(400),
    height: scaleHeight(45),
    flexDirection: "row",
  },

  margin: {
    height: scaleHeight(10),
    width: scaleWidth(10),
  },

  editButton: {
    height: scaleHeight(40),
    width: scaleWidth(50),
    justifyContent: "center",
    alignItems: "center",
  },
});
