import { fonts } from "@shared/themes";
import {
  formatMoneyWithUnit,
  getPaymentString,
  stringIsEmptyOrWhiteSpaces,
} from "@utils";
import _ from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";

export const ReceiptTotal = ({
  subtotal = 0,
  discount = 0,
  tip = 0,
  tax = 0,
  taxRate = 0,
  total = 0,
  change = 0,
  fee = 0,
  cashDiscount = 0,
  due = 0,
  printTemp,
  fromAppointmentTab,
  checkoutPaymentMethods,
  isSignature,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.margin} />
      <View style={styles.line} />
      <View style={styles.margin} />

      <TextTotal label={"Subtotal"}>{`${formatMoneyWithUnit(
        subtotal
      )}`}</TextTotal>
      <TextTotal label={"Discount"}>{`${formatMoneyWithUnit(
        discount
      )}`}</TextTotal>
      <TextTotal label={"Tip"}>{`${formatMoneyWithUnit(tip)}`}</TextTotal>
      <TextTotal
        label={`Tax${taxRate > 0 ? "(" + taxRate + "%)" : ""}`}
      >{`${formatMoneyWithUnit(tax)}`}</TextTotal>
      {!printTemp && (
        <>
          {fee != 0 && (
            <TextTotal label={"Non-Cash Adjustment"}>{`${formatMoneyWithUnit(
              fee
            )}`}</TextTotal>
          )}
          {cashDiscount != 0 && (
            <TextTotal label={"Cash Discount"}>{`${formatMoneyWithUnit(
              cashDiscount
            )}`}</TextTotal>
          )}
          <TextTotal
            label={"Total"}
            fontWeight={"600"}
            fontSize={17}
          >{`${formatMoneyWithUnit(total)}`}</TextTotal>
        </>
      )}
      {change > 0 && (
        <TextTotal label={"Change"}>{`${formatMoneyWithUnit(
          change
        )}`}</TextTotal>
      )}
      {printTemp && !fromAppointmentTab && (
        <>
          <View style={styles.margin} />
          <TextFill label={`${_.padEnd("Tip", 15, " ")}`}>
            <View style={styles.line} />
          </TextFill>
          <View style={styles.margin} />
          <TextFill label={`${_.padEnd("Total", 14, " ")}`}>
            <View style={styles.line} />
          </TextFill>
        </>
      )}
      {!printTemp && (
        <>
          {checkoutPaymentMethods?.map((data, index) => (
            <View key={`${index}`}>
              <TextTotal
                label={`- Entry method: ${getPaymentString(
                  data?.paymentMethod || ""
                )}`}
              >{`${formatMoneyWithUnit(data?.amount || "0")}`}</TextTotal>
              {(data.paymentMethod && data.paymentMethod === "credit_card") ||
              data.paymentMethod === "debit_card" ? (
                <View>
                  <TextPayment>
                    {`    ${data?.paymentInformation?.type || ""}: ***********${
                      data?.paymentInformation?.number || ""
                    }`}
                  </TextPayment>
                  <TextPayment>
                    {`    ${
                      data?.paymentInformation?.sn
                        ? `Terminal ID: ${data?.paymentInformation?.sn}`
                        : ""
                    }`}
                  </TextPayment>
                  <TextPayment>
                    {`    ${
                      data?.paymentInformation?.refNum
                        ? `Transaction #: ${data?.paymentInformation?.refNum}`
                        : ""
                    }`}
                  </TextPayment>
                  {!stringIsEmptyOrWhiteSpaces(
                    _.get(data, "paymentInformation.signData")
                  ) && (
                    <View style={styles.rowSignature}>
                      <TextTotal label={"    Signature: "}>
                        <Image
                          style={styles.signImage}
                          source={{
                            uri: `data:image/png;base64,${data?.paymentInformation?.signData}`,
                          }}
                        />
                      </TextTotal>
                    </View>
                  )}
                </View>
              ) : null}
            </View>
          ))}
        </>
      )}
      <View style={styles.margin} />
      {((isSignature && !printTemp) || (printTemp && !fromAppointmentTab)) && (
        <TextFill label={`${_.padEnd("Signature", 10, " ")}`}>
          <View style={styles.line} />
        </TextFill>
      )}
      <View style={styles.margin} />
      <View style={styles.margin} />
    </View>
  );
};

const TextTotal = ({
  label = "",
  children,
  fontWeight = "normal",
  fontSize,
}) => (
  <View style={styles.textLabelContent}>
    <Text style={styles.textLabelStyle}>{`${label}: `}</Text>
    {children && (
      <Text
        style={[
          styles.textStyle,
          { fontWeight: fontWeight, ...(fontSize && { fontSize: fontSize }) },
        ]}
      >
        {children}
      </Text>
    )}
  </View>
);

const TextFill = ({ label = "", children }) => (
  <View style={styles.textLabelContent}>
    <Text style={styles.textLabelStyle}>{`${label}: `}</Text>
    {children}
  </View>
);

const TextPayment = ({ children }) => (
  <Text style={styles.textLabelStyle}>{children}</Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  textLabelStyle: {
    fontFamily: fonts.MEDIUM,
    color: "#000",
    fontSize: scaleFont(15),
    textAlign: "left",
    fontWeight: "500",
  },

  textStyle: {
    fontFamily: fonts.MEDIUM,
    color: "#000",
    fontSize: scaleFont(15),
    textAlign: "right",
    fontWeight: "normal",
  },

  margin: {
    width: scaleWidth(10),
    height: scaleHeight(15),
  },

  textLabelContent: {
    width: "100%",
    height: scaleHeight(26),
    paddingHorizontal: scaleWidth(10),
    paddingVertical: scaleHeight(1),
    alignContent: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  line: {
    flex: 1,
    borderBottomColor: "#0006",
    borderBottomWidth: 1,
  },

  rowSignature: {
    flexDirection: "row",
    alignItems: "center",
  },

  signImage: {
    width: scaleWidth(100),
    height: scaleHeight(40),
    resizeMode: "contain",
  },

  line: {
    flex: 1,
    borderBottomColor: "#000e",
    borderBottomWidth: 1,
  },
});
