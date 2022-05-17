import { ButtonGradient, CustomTextInput } from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import { colors, fonts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export const DialogInputBarcode = React.forwardRef(
  ({ onInputBarcode, loading }, ref) => {
    const { t } = useTranslation();
    const dialogRef = React.useRef(null);
    const [value, setValue] = React.useState(null);
    const [codeNotFound, setCodeNotFound] = React.useState(null);

    const onAddButtonPress = () => {
      if (!value) return;
      if (onInputBarcode && typeof onInputBarcode === "function") {
        onInputBarcode(value);
      }
    };

    const onHandleForceClosePopup = () => {
      reset();
    };

    const reset = () => {
      setCodeNotFound(null);
      setValue(null);
    };

    React.useImperativeHandle(ref, () => ({
      show: (oldCode) => {
        setCodeNotFound(oldCode);
        dialogRef.current?.show();
      },
      hide: () => {
        reset();
        dialogRef.current?.hide();
      },
      isShow: () => {
        return dialogRef.current?.isShow();
      },
    }));

    return (
      <View>
        <DialogLayout
          title={t("Input Barcode")}
          ref={dialogRef}
          style={styles.dialog}
          onForceClose={onHandleForceClosePopup}
        >
          <View style={styles.container}>
            <View style={styles.margin} />
            <View style={styles.textContent}>
              <Text style={styles.textInfo}>
                {t("No product match with ")}
                <Text style={styles.textCode}>{`${codeNotFound ?? ""}`}</Text>
                {t("\nPlease! input other barcode. ")}
              </Text>
            </View>
            <View style={styles.margin} />
            <CustomTextInput
              width={scaleWidth(400)}
              height={scaleHeight(40)}
              textAlign="center"
              value={value}
              onChangeText={setValue}
              placeholder={t("Input barcode")}
            />
            <View style={styles.margin} />

            <ButtonGradient
              loading={loading}
              disable={!value || loading}
              label={t("Add to basket")}
              width={scaleWidth(160)}
              height={scaleHeight(45)}
              borderRadius={scaleWidth(3)}
              onPress={onAddButtonPress}
            />
          </View>
        </DialogLayout>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  dialog: {
    flex: 0,
    width: scaleWidth(480),
  },

  margin: {
    width: scaleWidth(15),
    height: scaleHeight(15),
  },

  textInfo: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(16),
    fontStyle: "normal",
    color: colors.GREYISH_BROWN,
  },

  textCode: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(18),
    fontStyle: "normal",
    color: colors.OCEAN_BLUE,
  },

  textContent: {
    flex: 0,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: scaleWidth(50),
  },
});
