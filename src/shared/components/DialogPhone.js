import { ButtonGradient } from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { FormPhoneNumber } from "./FormPhoneNumber";

export const DialogPhone = React.forwardRef(({ title, onPhoneSubmit }, ref) => {
  const [t] = useTranslation();
  const dialogRef = React.useRef(null);
  const [phone, setPhone] = React.useState();

  React.useImperativeHandle(ref, () => ({
    show: () => {
      dialogRef.current?.show();
    },
    hide: () => {
      dialogRef.current?.hide();
    },
  }));

  const onHandleSubmitPhone = () => {
    if (onPhoneSubmit && typeof onPhoneSubmit === "function") {
      onPhoneSubmit(phone);
    }
  };

  return (
    <View>
      <DialogLayout
        title={title ?? t("Customer detail")}
        ref={dialogRef}
        style={styles.dialog}
      >
        <View style={styles.container}>
          <View style={styles.bottomStyle}>
            <ButtonGradient
              label={t("Next")}
              width={scaleWidth(140)}
              height={scaleHeight(40)}
              borderRadius={scaleWidth(3)}
              onPress={onHandleSubmitPhone}
            />
          </View>
          <View style={layouts.marginHorizontal} />
          <FormPhoneNumber
            hasTitle={false}
            // defaultPhone={phone}
            onChangePhoneNumber={setPhone}
          />
          <View style={styles.marginVertical} />
          <Text style={styles.title}>{t("Customer phone number")}</Text>
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

  container: { flex: 0, flexDirection: "column-reverse" },

  bottomStyle: {
    width: "100%",
    height: scaleHeight(80),
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },

  title: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(20),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.GREYISH_BROWN,
  },
});
