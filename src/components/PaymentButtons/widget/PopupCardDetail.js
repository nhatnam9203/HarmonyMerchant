import {
  ButtonGradient,
  FormInputMask,
  ButtonGradientWhite,
} from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export const PopupCardDetail = React.forwardRef(
  ({ cardDetail, appointment, onCancel, onSuccess }, ref) => {
    const [t] = useTranslation();
    const dialogRef = React.useRef(null);

    const textInputRef = React.useRef(null);

    const [payAmount, setPayAmount] = React.useState(0);

    const onSubmitButtonPress = () => {};

    const onModalWillHide = () => {
      if (onCancel && typeof onCancel === "function") {
        onCancel();
      }
    };

    React.useImperativeHandle(ref, () => ({
      show: () => {
        dialogRef.current?.show();
      },
      hide: () => {
        setPayAmount(0);
        textInputRef.current?.clear();
        dialogRef.current?.hide();
      },
    }));

    return (
      <View>
        <DialogLayout
          title={t("Payment Card Details")}
          ref={dialogRef}
          style={styles.dialog}
          onModalWillHide={onModalWillHide}
        >
          <View style={styles.container}>
            <View style={styles.margin} />
            <Row>
              <Label text={t("Serial Number")} />
              <TextValue text={cardDetail?.name + " "} />
            </Row>
            <Row>
              <Label text={t("Amount")} />
              <TextValue text={cardDetail?.amount + " "} />
            </Row>

            <View style={styles.margin} />
            <View style={styles.line} />
            <View style={styles.margin} />
            <Title text={t("Payment details")} />
            <View style={styles.margin} />

            <Row>
              <Label text={t("Charge amount")} />
              <TextValue text={`${appointment?.total}`} />
            </Row>
            <Row>
              <Label text={t("Amount")} />
              <View style={styles.payAmount}>
                <FormInputMask
                  // label={t("Input Barcode")}
                  placeholder={t("Enter price")}
                  //required={true}
                  onChangeValue={setPayAmount}
                  defaultValue={payAmount}
                  // editable={false}
                  textInputRef={textInputRef}
                  autoFocus={true}
                  showSoftInputOnFocus={false}
                  keyboardType="numeric"
                  textAlign="right"
                />
              </View>
            </Row>
            <Row>
              <Label text={t("Amount due")} />
              <TextValue text={`${appointment?.paidAmount}`} />
            </Row>
            <View style={styles.margin} />

            <View style={styles.buttonContent}>
              <ButtonGradientWhite
                label={t("Cancel")}
                width={scaleWidth(120)}
                height={scaleHeight(40)}
                borderRadius={scaleWidth(3)}
                onPress={onSubmitButtonPress}
              />
              <View style={styles.margin} />
              <ButtonGradient
                label={t("Submit")}
                width={scaleWidth(120)}
                height={scaleHeight(40)}
                borderRadius={scaleWidth(3)}
                disable={payAmount?.length <= 0}
                onPress={onSubmitButtonPress}
              />
            </View>

            <View style={styles.margin} />
          </View>
        </DialogLayout>
      </View>
    );
  }
);

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
    width: "40%",
  },

  line: {
    height: 1,
    width: "100%",
    backgroundColor: "#aaa",
  },
});
