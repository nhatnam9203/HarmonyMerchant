import {
  ButtonGradient,
  FormInput,
  ButtonGradientWhite,
} from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export const PopupCardDetail = React.forwardRef(({ title, onSuccess }, ref) => {
  const [t] = useTranslation();
  const dialogRef = React.useRef(null);

  const textInputRef = React.useRef(null);

  const [value, setValue] = React.useState("");

  const onSubmitButtonPress = () => {};

  React.useImperativeHandle(ref, () => ({
    show: () => {
      dialogRef.current?.show();
    },
    hide: () => {
      setValue("");
      textInputRef.current?.clear();
      dialogRef.current?.hide();
    },
  }));

  return (
    <View>
      <DialogLayout
        title={title ?? t("Payment Card Details")}
        ref={dialogRef}
        style={styles.dialog}
      >
        <View style={styles.container}>
          <View style={styles.margin} />
          <Row>
            <Label text={t("Serial Number")} />
            <TextValue text={t("#233424234")} />
          </Row>
          <Row>
            <Label text={t("Amount")} />
            <TextValue text={t("$ 1.00")} />
          </Row>

          <View style={styles.margin} />
          <View style={styles.line} />
          <View style={styles.margin} />
          <Title text={t("Payment details")} />
          <View style={styles.margin} />

          <Row>
            <Label text={t("Charge amount")} />
            <TextValue text={t("$ 1.00")} />
          </Row>
          <Row>
            <Label text={t("Amount")} />
            <View style={styles.payAmount}>
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
              </FormInput>
            </View>
          </Row>
          <Row>
            <Label text={t("Amount due")} />
            <TextValue text={t("$ 1.00")} />
          </Row>
          <View style={styles.margin} />

          <View style={styles.buttonContent}>
            <ButtonGradientWhite
              label={t("Cancel")}
              width={scaleWidth(120)}
              height={scaleHeight(40)}
              borderRadius={scaleWidth(3)}
              disable={value?.length <= 0}
              onPress={onSubmitButtonPress}
            />
            <View style={styles.margin} />
            <ButtonGradient
              label={t("Submit")}
              width={scaleWidth(120)}
              height={scaleHeight(40)}
              borderRadius={scaleWidth(3)}
              disable={value?.length <= 0}
              onPress={onSubmitButtonPress}
            />
          </View>

          <View style={styles.margin} />
        </View>
      </DialogLayout>
    </View>
  );
});

const Row = ({ children }) => <View style={styles.row}>{children}</View>;
const Label = ({ text }) => <Text style={styles.label}>{`${text}`}</Text>;
const Title = ({ text }) => <Text style={styles.title}>{`${text}`}</Text>;
const TextValue = ({ text }) => <Text style={styles.value}>{`${text}`}</Text>;

const styles = StyleSheet.create({
  dialog: {
    flex: 0,
    width: scaleWidth(480),
  },

  container: {
    // justifyContent: "center",
    // alignItems: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: scaleHeight(50),
  },

  title: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(18),
    fontStyle: "normal",
    letterSpacing: 0,
    color: "rgb(37,37,37)",
  },

  label: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(18),
    fontStyle: "normal",
    letterSpacing: 0,
    color: "rgb(73,73,73)",
  },

  value: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(18),
    fontStyle: "normal",
    letterSpacing: 0,
    color: "rgb(73,73,73)",
  },

  markerStyle: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },

  margin: {
    height: scaleHeight(12),
    width: scaleWidth(35),
  },

  text: {
    ...layouts.fontLightBlue,
    color: colors.GREYISH_BROWN,
    fontSize: scaleFont(14),
    fontStyle: "italic",
    fontWeight: "400",
    textAlign: "center",
    width: "100%",
  },

  buttonContent: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  payAmount: {
    width: "50%",
  },

  line: {
    height: 1,
    width: "100%",
    backgroundColor: "#aaa",
  },
});
