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
  returnCode,
  isGroupLayout,
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
      <TextTime>
        {` ${formatWithMoment(new Date(), "MM/DD/YYYY hh:mm A")} `}
      </TextTime>
      <View style={styles.margin} />
      <View style={styles.margin} />
      {!!staffName && (
        <TextInvoice label="Staff name   ">{`${staffName}`}</TextInvoice>
      )}
      {!isGroupLayout && (
        <TextInvoice label="Customer     ">
          {`${customer?.firstName ?? "Walking"} ${
            customer?.lastName ?? "customer"
          }`}
        </TextInvoice>
      )}
      {invoiceNO && (
        <TextInvoice label="Invoice No    ">{`#${invoiceNO}`}</TextInvoice>
      )}
      <TextInvoice label="Invoice Date ">
        {`${formatWithMoment(invoiceDate, "MM/DD/YYYY hh:mm A")}`}
      </TextInvoice>
      {returnCode && (
        <TextInvoice label="Return Code">{`#${returnCode}`}</TextInvoice>
      )}
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
    color: "#000",
    fontSize: scaleFont(22),
    textAlign: "center",
    fontWeight: "bold",
  },

  textLabelStyle: {
    color: "#000",
    fontSize: scaleFont(19),
    textAlign: "center",
    fontWeight: "500",
  },

  textTimeStyle: {
    color: "#000",
    fontSize: scaleFont(18),
    textAlign: "center",
    fontWeight: "500",
  },

  textSymbolStyle: {
    color: "#000",
    fontSize: scaleFont(22),
    textAlign: "center",
    fontWeight: "500",
  },

  textInvoiceLabelStyle: {
    color: "#000",
    fontSize: scaleFont(18),
    textAlign: "left",
    fontWeight: "500",
  },

  textInvoiceStyle: {
    color: "#000",
    fontSize: scaleFont(18),
    textAlign: "left",
    fontWeight: "500",
  },

  margin: {
    width: scaleWidth(10),
    height: scaleHeight(10),
  },
});
