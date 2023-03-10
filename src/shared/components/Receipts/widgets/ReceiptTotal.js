import { fonts } from "@shared/themes";
import {
  formatMoneyWithUnit,
  getPaymentString,
  stringIsEmptyOrWhiteSpaces,
  formatNumberFromCurrency,
} from "@utils";
import _ from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";
import { LineFill } from "./ReceiptLine";

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
  returnTotal = 0,
  isGroupLayout = false,
}) => {
  const { t } = useTranslation();

  const isExistSignature = checkoutPaymentMethods?.find(
    (data) => data?.paymentInformation?.signData
  );
  const isExistCreditMethod = checkoutPaymentMethods?.find(
    (data) => data?.paymentMethod == "credit_card"
  );

  return (
    <View style={styles.container}>
      <View style={styles.margin} />
      <LineFill width={"100%"} />

      <View style={styles.margin} />

      <TextTotal
        label={"Subtotal"}
        fontSize={scaleFont(22)}
      >{`${formatMoneyWithUnit(subtotal)}`}</TextTotal>
      <TextTotal label={"Discount"}>{`${formatMoneyWithUnit(
        -discount
      )}`}</TextTotal>
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
        </>
      )}
      {
        <TextTotal
          label={"Total Amount Due"}
          fontWeight={"bold"}
          fontSize={scaleFont(22)}
        >
          {`${formatMoneyWithUnit(
            formatNumberFromCurrency(total) - formatNumberFromCurrency(tip)
          )}`}
        </TextTotal>
      }
      {tip > 0 ? (
        <TextTotal label={"Tip"}>{`${formatMoneyWithUnit(tip)}`}</TextTotal>
      ) : (
        <>
          <View style={styles.margin} />
          <TextFill label={`${_.padEnd("Tip", 15, " ")}`}>
            <LineFill width={"60%"} />
          </TextFill>
        </>
      )}
      {tip > 0 ? (
        <TextTotal label={"Total"} fontWeight={"bold"} fontSize={scaleFont(22)}>
          {`${formatMoneyWithUnit(total)}`}
        </TextTotal>
      ) : (
        <>
          <View style={styles.margin} />
          <TextFill label={`${_.padEnd("Total", 15, " ")}`}>
            <LineFill width={"60%"} />
          </TextFill>
        </>
      )}
      {change > 0 && (
        <TextTotal label={"Change"}>{`${formatMoneyWithUnit(
          change
        )}`}</TextTotal>
      )}
      {returnTotal > 0 && (
        <TextTotal
          label={"Return total"}
          fontWeight={"bold"}
          fontSize={scaleFont(22)}
        >{`${formatMoneyWithUnit(returnTotal)}`}</TextTotal>
      )}
      {/* {printTemp && !fromAppointmentTab && (
        <>
          <View style={styles.margin} />
          <TextFill label={`${_.padEnd("Total", 14, " ")}`}>
            <LineFill width={"60%"} />
          </TextFill>
        </>
      )} */}
      {!printTemp && (
        <>
          {checkoutPaymentMethods?.map((data, index) => (
            <View key={`${index}`}>
              <TextTotal
                fontSize={scaleFont(17)}
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
                      <Text style={styles.textLabelStyle}>
                        {"    Signature:"}
                      </Text>
                      <Image
                        style={styles.signImage}
                        source={{
                          uri: `data:image/png;base64,${data?.paymentInformation?.signData}`,
                        }}
                      />
                    </View>
                  )}
                  {data?.paymentInformation?.name ? (
                    <TextPayment>
                      {`    ${data?.paymentInformation?.name
                        ?.replace(/%20/g, " ")
                        .replace(/%2f/g, " ")}`}
                    </TextPayment>
                  ) : null}
                </View>
              ) : null}
            </View>
          ))}
        </>
      )}

      <View style={styles.margin} />
      {isSignature && !printTemp && !isExistSignature && isExistCreditMethod && (
        <TextFill label={`${_.padEnd("Signature", 10, " ")}`}>
          <LineFill width={"60%"} />
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
    <Text
      style={[
        styles.textLabelStyle,
        { ...(fontSize && { fontSize: fontSize }) },
      ]}
    >{`${label}: `}</Text>
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
    // fontFamily: fonts.MEDIUM,
    color: "#000",
    fontSize: scaleFont(18),
    textAlign: "left",
    fontWeight: "500",
  },

  textStyle: {
    // fontFamily: fonts.MEDIUM,
    color: "#000",
    fontSize: scaleFont(18),
    textAlign: "right",
    fontWeight: "500",
  },

  margin: {
    width: scaleWidth(10),
    height: scaleHeight(10),
  },

  textLabelContent: {
    width: "100%",
    height: scaleHeight(32),
    paddingHorizontal: scaleWidth(10),
    paddingVertical: scaleHeight(1),
    alignContent: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  line: {
    flex: 1,
    height: scaleHeight(20),
    borderBottomColor: "#000",
    borderBottomWidth: scaleHeight(1),
  },

  rowSignature: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: scaleHeight(20),
  },

  signImage: {
    width: scaleWidth(100),
    height: scaleHeight(40),
    resizeMode: "contain",
    marginLeft: scaleWidth(10),
  },
});
