import { fonts } from "@shared/themes";
import { formatWithMoment } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { LineHeader } from "./ReceiptLine";

export const ReceiptHeader = ({
  profile,
  symbol = "TICKET",
  customer,
  invoiceDate,
  invoiceNO = "Unknown",
  staffName,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.margin} />
      <TextName> {`${profile?.businessName ?? " "}`}</TextName>
      <TextLabel numberOfLines={2}>
        {`${profile?.addressFull ?? " "}`}
      </TextLabel>
      <TextLabel numberOfLines={2}>
        {`Tel : ${profile?.phone ?? " "}`}
      </TextLabel>
      {!!profile?.webLink && (
        <TextLabel>{`${profile?.webLink ?? " "}`}</TextLabel>
      )}
      <View style={styles.margin} />
      <TextSymbol>{` ${symbol} `}</TextSymbol>
      <View style={styles.margin} />
      <TextLabel>
        {`( ${formatWithMoment(new Date(), "MM/DD/YYYY hh:mm A")} )`}
      </TextLabel>
      <LineHeader />
      <TextInvoice label="Customer     ">
        {`${customer?.firstName ?? " "} ${customer?.lastName ?? " "}`}
      </TextInvoice>
      {!!staffName && (
        <TextInvoice label="Staff name   ">{` ${staffName}`}</TextInvoice>
      )}
      <TextInvoice label="Invoice Date ">
        {`${formatWithMoment(invoiceDate, "MM/DD/YYYY hh:mm A")}`}
      </TextInvoice>
      <TextInvoice label="Invoice No    ">{` #${invoiceNO}`}</TextInvoice>
    </View>
  );
};

const TextLabel = ({ children, numberOfLines = 0 }) => (
  <Text style={styles.textLabelStyle} numberOfLines={numberOfLines}>
    {children}
  </Text>
);

const TextName = ({ children, numberOfLines = 0 }) => (
  <Text style={styles.textNameStyle} numberOfLines={numberOfLines}>
    {children}
  </Text>
);

const TextSymbol = ({ children }) => (
  <Text style={styles.textSymbolStyle}>{children}</Text>
);

const TextInvoice = ({ label = "", children }) => (
  <Text style={styles.textInvoiceLabelStyle}>
    {`${label}: `}
    <Text style={styles.textInvoiceStyle}>{children}</Text>
  </Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  textNameStyle: {
    fontFamily: fonts.BOLD,
    color: "#000",
    fontSize: scaleFont(20),
    textAlign: "center",
  },

  textLabelStyle: {
    fontFamily: fonts.MEDIUM,
    color: "#000",
    fontSize: scaleFont(15),
    fontWeight: "normal",
    textAlign: "center",
  },

  textSymbolStyle: {
    fontFamily: fonts.BOLD,
    color: "#000",
    fontSize: scaleFont(20),
    textAlign: "center",
  },

  textInvoiceLabelStyle: {
    fontFamily: fonts.MEDIUM,
    color: "#000",
    fontSize: scaleFont(15),
    textAlign: "left",
    fontWeight: "400",
  },

  textInvoiceStyle: {
    fontFamily: fonts.MEDIUM,
    color: "#000",
    fontSize: scaleFont(15),
    textAlign: "left",
  },

  margin: {
    width: scaleWidth(10),
    height: scaleHeight(10),
  },
});
