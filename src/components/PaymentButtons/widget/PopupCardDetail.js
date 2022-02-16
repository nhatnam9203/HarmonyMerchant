import {
  ButtonGradient,
  FormInputMask,
  ButtonGradientWhite,
  FormInput,
  CustomTextInput,
} from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { formatNumberFromCurrency, formatMoneyWithUnit } from "@utils";
import { useSelector } from "react-redux";
import IMAGE from "@resources";
import { CardType } from "../QRCodePay/useProps";

export const PopupCardDetail = React.forwardRef(
  ({ cardDetail, appointment, onCancel, onSubmit }, ref) => {
    const [t] = useTranslation();
    const dialogRef = React.useRef(null);
    const textInputRef = React.useRef(null);
    const textInputStarRef = React.useRef(null);

    const paymentDetailInfo = useSelector(
      (state) => state.appointment.paymentDetailInfo
    );

    const [payAmount, setPayAmount] = React.useState(0);
    // const [dueAmount, setDueAmount] = React.useState(0);
    const [starNumberUse, setStarNumberUse] = React.useState(0);
    const [isCheck, setIsCheck] = React.useState(false);
    const [payStarAmount, setPayStarAmount] = React.useState(0);

    const hidePopup = () => {
      setPayAmount(0);
      setPayStarAmount(0);
      setStarNumberUse(0);
      setIsCheck(false);
      textInputRef.current?.clear();
      textInputStarRef.current?.clear();
      dialogRef.current?.hide();
    };

    const onSubmitButtonPress = () => {
      if (payAmount < 0) {
        alert(t("Amount must greater than 0!"));
        return;
      }

      const cardAmount = formatNumberFromCurrency(cardDetail?.amount);
      if (payAmount > cardAmount) {
        alert(t(`Amount must less than ${cardAmount}`));
        return;
      }

      if (onSubmit && typeof onSubmit === "function") {
        onSubmit({
          amount: formatNumberFromCurrency(payAmount),
          rewardStar: starNumberUse,
          totalAmount:
            formatNumberFromCurrency(payAmount) +
            formatNumberFromCurrency(payStarAmount),
        });
      }
      hidePopup();
    };

    const onCancelButtonPress = () => {
      hidePopup();
    };

    const onModalWillHide = () => {
      if (onCancel && typeof onCancel === "function") {
        onCancel();
      }
    };

    const getDueAmount = React.useCallback(() => {
      const { grandTotal = 0, dueAmount = 0 } = paymentDetailInfo || {};

      let dueValue =
        formatNumberFromCurrency(dueAmount) -
        formatNumberFromCurrency(payAmount) -
        formatNumberFromCurrency(payStarAmount);

      return dueValue;
    }, [payAmount, payStarAmount]);

    const onChangePaidAmount = (amount) => {
      const { grandTotal = 0, dueAmount = 0 } = paymentDetailInfo || {};

      let paidValue = formatNumberFromCurrency(amount);
      const cardAmount = formatNumberFromCurrency(cardDetail?.amount);

      if (paidValue > cardAmount) {
        paidValue = cardAmount;
      } else if (paidValue < 0) {
        paidValue = 0;
      }

      setPayAmount(paidValue);
    };

    const onChangeStarNumberUse = async (starUse = 0) => {
      //if(starUse > cardDetail?.star
      //   || starUse*100 > paymentDetailInfo?.dueAmount) return

      const { grandTotal = 0, dueAmount = 0 } = paymentDetailInfo || {};
      const dueAmountNumber = formatNumberFromCurrency(dueAmount);

      let tempStar = parseInt(starUse);
      if (isNaN(tempStar)) {
        tempStar = 0;
      }

      let maxStart = cardDetail?.star ? parseInt(cardDetail?.star) : 0;
      if (isNaN(maxStart)) {
        maxStart = 0;
      }

      if (tempStar > maxStart) {
        tempStar = maxStart;
      } else if (tempStar <= 0) {
        tempStar = 0;
      }

      await setStarNumberUse(tempStar);
      const tempAmount = parseFloat(
        tempStar / cardDetail.rewardStarRate
      ).toFixed(2);
      await setPayStarAmount(tempAmount);

      const cardAmount = formatNumberFromCurrency(cardDetail?.amount);
      let paidValue = dueAmountNumber - formatNumberFromCurrency(tempAmount);

      if (cardAmount < paidValue) {
        paidValue = cardAmount;
      }

      setPayAmount(paidValue);
    };

    React.useEffect(() => {
      if (!isCheck) {
        if (payStarAmount > 0) {
          const { dueAmount = 0 } = paymentDetailInfo || {};

          if (
            formatNumberFromCurrency(paymentDetailInfo?.dueAmount ?? 0) >= 0
          ) {
            onChangePaidAmount(paymentDetailInfo?.dueAmount);
          }
        }
        setPayStarAmount(0);
        setStarNumberUse(0);
      } else {
        const maxStart = cardDetail?.star ? parseInt(cardDetail?.star) : 0;
        const { dueAmount = 0 } = paymentDetailInfo || {};
        const dueValue = formatNumberFromCurrency(dueAmount);

        if (maxStart > 0) {
          const payStar = Math.min(
            maxStart,
            dueValue * cardDetail.rewardStarRate
          );
          onChangeStarNumberUse(payStar);
        }
      }
    }, [isCheck]);

    React.useImperativeHandle(ref, () => ({
      show: () => {
        dialogRef.current?.show();
        if (formatNumberFromCurrency(paymentDetailInfo?.dueAmount ?? 0) >= 0) {
          onChangePaidAmount(paymentDetailInfo?.dueAmount);
        }
      },
      hide: () => {
        setPayAmount(0);
        textInputRef.current?.clear();
        textInputStarRef.current?.clear();
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
              <Label
                text={
                  cardDetail?.cardType === "GiftCard"
                    ? t("Serial number")
                    : t("Customer name")
                }
              />
              <TextValue text={cardDetail?.name + " "} />
            </Row>
            {cardDetail?.cardType === CardType.CUSTOMER_CARD && (
              <Row>
                <Label text={t("Star available")} />
                <View style={styles.viewRow}>
                  <Image source={IMAGE.star} style={styles.starIcon} />
                  <TextValue text={" " + cardDetail?.star ?? 0 + " "} />
                </View>
              </Row>
            )}
            <Row>
              <Label text={t("Card balance")} />
              <TextValue text={`${formatMoneyWithUnit(cardDetail?.amount)}`} />
            </Row>

            <View style={styles.margin} />
            <View style={styles.line} />
            <View style={styles.margin} />
            <Title text={t("Payment details")} />
            <View style={styles.margin} />

            <Row>
              <Label text={t("Charge amount")} />
              <TextValue text={`${formatMoneyWithUnit(appointment?.total)}`} />
            </Row>

            <Row>
              <Label text={t("Pay amount")} />
              <View style={styles.payAmount}>
                <FormInputMask
                  // label={t("Input Barcode")}
                  placeholder={t("Enter price")}
                  //required={true}
                  onChangeValue={onChangePaidAmount}
                  defaultValue={formatMoneyWithUnit(payAmount)}
                  // editable={false}
                  textInputRef={textInputRef}
                  autoFocus={true}
                  showSoftInputOnFocus={false}
                  keyboardType="numeric"
                  textAlign="right"
                />
              </View>
            </Row>

            {cardDetail?.cardType === CardType.CUSTOMER_CARD &&
              cardDetail?.star > 0 && (
                <Row>
                  <View style={styles.viewRow}>
                    <TouchableOpacity
                      style={{ marginRight: scaleWidth(10) }}
                      onPress={() => setIsCheck(!isCheck)}
                    >
                      <Image
                        source={isCheck ? IMAGE.checkBox : IMAGE.checkBoxEmpty}
                        style={styles.starIcon}
                      />
                    </TouchableOpacity>
                    <Label text={t("Use HP star")} />
                  </View>

                  <View style={styles.payAmount}>
                    {/* <FormInput
                      onChangeValue={onChangeStarNumberUse}
                      defaultValue={starNumberUse}
                      textInputRef={textInputStarRef}
                      autoFocus={true}
                      showSoftInputOnFocus={false}
                      keyboardType="numeric"
                      textAlign="right"
                      editable={isCheck}
                    /> */}
                    <CustomTextInput
                      width={scaleWidth(180)}
                      height={scaleHeight(42)}
                      autoFocus={true}
                      showSoftInputOnFocus={false}
                      selectTextOnFocus={true}
                      keyboardType="numeric"
                      textAlign="right"
                      editable={isCheck}
                      onChangeText={onChangeStarNumberUse}
                      value={`${starNumberUse}`}
                    />
                  </View>
                </Row>
              )}

            {isCheck && (
              <Row>
                <Label text={t("Conversation value")} />
                <TextValue text={`-${formatMoneyWithUnit(payStarAmount)}`} />
              </Row>
            )}

            <Row>
              <Label text={t("Due amount")} textColor={"red"} />
              <TextValue
                text={`${formatMoneyWithUnit(getDueAmount())}`}
                textColor={"red"}
              />
            </Row>
            <View style={styles.margin} />

            <View style={styles.buttonContent}>
              <ButtonGradientWhite
                label={t("Cancel")}
                width={scaleWidth(120)}
                height={scaleHeight(40)}
                borderRadius={scaleWidth(3)}
                onPress={onCancelButtonPress}
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
const Label = ({ text, textColor }) => (
  <Text
    style={[styles.label, textColor && { color: textColor }]}
  >{`${text}`}</Text>
);
const Title = ({ text }) => <Text style={styles.title}>{`${text}`}</Text>;
const TextValue = ({ text, textColor }) => (
  <Text
    style={[styles.value, textColor && { color: textColor }]}
  >{`${text}`}</Text>
);

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

  viewRow: {
    flexDirection: "row",
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

  textInputView: {
    borderRadius: 1,
    backgroundColor: colors.WHITE,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dddddd",
    width: scaleWidth(400),
    height: scaleHeight(48),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: scaleWidth(8),
  },

  line: {
    height: 1,
    width: "100%",
    backgroundColor: "#aaa",
  },
  starIcon: {
    width: scaleWidth(20),
    height: scaleHeight(20),
  },
  inputText: {
    width: scaleWidth(150),
    height: scaleHeight(40),
  },
});
