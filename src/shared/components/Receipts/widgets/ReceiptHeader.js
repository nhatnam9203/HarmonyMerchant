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
      <TextLabel numberOfLines={2}>{`${profile?.address ?? " "}`}</TextLabel>
      <TextLabel numberOfLines={1}>
        {`${profile?.city ?? " "},  ${profile?.state?.name ?? " "} ${
          profile?.zip ?? " "
        }`}
      </TextLabel>
      <TextLabel numberOfLines={2}>
        {`Tel : ${profile?.phone ?? " "}`}
      </TextLabel>
      {!!profile?.webLink && (
        <TextLabel>{`${profile?.webLink ?? " "}`}</TextLabel>
      )}
      <View style={styles.margin} />
      <TextSymbol>{` ${symbol} `}</TextSymbol>
      {/* <View style={styles.margin} /> */}
      <TextTime>
        {` ${formatWithMoment(new Date(), "MM/DD/YYYY hh:mm A")} `}
      </TextTime>
      {/* <LineHeader />
       */}
      <View style={styles.margin} />
      <View style={styles.margin} />
      {!!staffName && (
        <TextInvoice label="Staff name   ">{`${staffName}`}</TextInvoice>
      )}
      <TextInvoice label="Customer     ">
        {`${customer?.firstName ?? "Unknown"} ${
          customer?.lastName ?? "Unknown"
        }`}
      </TextInvoice>
      {invoiceNO && (
        <TextInvoice label="Invoice No    ">{`#${invoiceNO}`}</TextInvoice>
      )}
      <TextInvoice label="Invoice Date ">
        {`${formatWithMoment(invoiceDate, "MM/DD/YYYY hh:mm A")}`}
      </TextInvoice>
      <View style={styles.margin} />
    </View>
  );
};

const TextTime = ({ children }) => (
  <Text style={styles.textTimeStyle}>{children}</Text>
);

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
    {` ${label} :   `}
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
    fontSize: scaleFont(21),
    textAlign: "center",
  },

  textLabelStyle: {
    fontFamily: fonts.MEDIUM,
    color: "#000",
    fontSize: scaleFont(19),
    textAlign: "center",
  },

  textTimeStyle: {
    fontFamily: fonts.MEDIUM,
    color: "#000",
    fontSize: scaleFont(18),
    textAlign: "center",
  },

  textSymbolStyle: {
    fontFamily: fonts.BOLD,
    color: "#000",
    fontSize: scaleFont(21),
    textAlign: "center",
  },

  textInvoiceLabelStyle: {
    fontFamily: fonts.MEDIUM,
    color: "#000",
    fontSize: scaleFont(18),
    textAlign: "left",
  },

  textInvoiceStyle: {
    fontFamily: fonts.MEDIUM,
    color: "#000",
    fontSize: scaleFont(18),
    textAlign: "left",
  },

  margin: {
    width: scaleWidth(10),
    height: scaleHeight(10),
  },
});
