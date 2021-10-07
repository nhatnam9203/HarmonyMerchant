import React from "react";
import { View, StyleSheet, Text } from "react-native";
import {
  checkIsTablet,
  formatMoney,
  formatNumberFromCurrency,
  formatWithMoment,
  getInfoFromModelNameOfPrinter,
  getPaymentString,
  getStaffNameForInvoice,
  localize,
  scaleSize,
} from "@utils";

export const ItemReceipt = ({ item, index, isSalonApp }) => {
  const renderItemInvoice = () => {
    const price = item.data && item.data.price ? item.data.price : 0;
    const quanlitySet = item.quanlitySet ? item.quanlitySet : 1;
    const total = formatMoney(price * quanlitySet);
    const note = item.note ? item.note : "";

    return (
      <View style={styles.content}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={[styles.textStyle]}>
            {`${index + 1}. ${
              item.data && item.data.name ? item.data.name : ""
            }`}
          </Text>
          {note ? (
            <Text style={styles.textStyle}>{`(Note: ${note})`}</Text>
          ) : null}
        </View>

        <View style={{ justifyContent: "center", width: scaleWidth(80) }}>
          <Text style={styles.textStyle}>{`$ ${price}`}</Text>
        </View>

        <View
          style={[
            styles.headerContent,
            {
              width: scaleWidth(50),
            },
          ]}
        >
          <Text style={styles.textStyle}>{quanlitySet}</Text>
        </View>

        <View
          style={[
            styles.headerContent,
            {
              width: scaleWidth(80),
            },
          ]}
        >
          <Text style={styles.textStyle}>{`$ ${total ? total : ""}`}</Text>
        </View>
      </View>
    );
  };

  const renderSalonItemInvoice = () => {
    const price = item.data && item.data.price ? item.data.price : 0;
    const quanlitySet = item.quanlitySet ? item.quanlitySet : 1;
    const total = formatMoney(price * quanlitySet);
    const note = item.note ? item.note : "";
    const staffName = item.staff?.displayName ?? "";
    return (
      <View style={styles.content}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={[styles.textStyle]}>
            {`${index + 1}. ${
              item.data && item.data.name ? item.data.name : ""
            }`}
          </Text>
          {note ? (
            <Text style={styles.textStyle}>{`(Note: ${note})`}</Text>
          ) : null}
        </View>

        <View style={{ justifyContent: "center", width: scaleWidth(120) }}>
          <Text style={styles.textStyle}>{` ${staffName}`}</Text>
        </View>

        <View
          style={[
            styles.headerContent,
            {
              width: scaleWidth(80),
            },
          ]}
        >
          <Text style={styles.textStyle}>{`$ ${total ? total : ""}`}</Text>
        </View>
      </View>
    );
  };

  return isSalonApp ? renderSalonItemInvoice() : renderItemInvoice();
};

export const ItemHeaderReceipt = ({ isSalonApp }) => {
  const renderHeaderInvoice = () => {
    return (
      <View style={styles.content}>
        <View style={[styles.headerContent, { flex: 1 }]}>
          <Text style={styles.headerStyle}>{`DESCRIPTION`}</Text>
        </View>
        <View style={{ justifyContent: "center", width: scaleWidth(80) }}>
          <Text style={styles.headerStyle}>{`PRICE`}</Text>
        </View>
        <View
          style={[
            styles.headerContent,
            {
              width: scaleWidth(50),
            },
          ]}
        >
          <Text style={styles.headerStyle}>{`QTY`}</Text>
        </View>
        <View
          style={[
            styles.headerContent,
            {
              width: scaleWidth(80),
            },
          ]}
        >
          <Text style={styles.headerStyle}>{`TOTAL`}</Text>
        </View>
      </View>
    );
  };

  const renderSalonHeaderInvoice = () => {
    return (
      <View style={styles.content}>
        <View style={[styles.headerContent, { flex: 1 }]}>
          <Text style={styles.headerStyle}>{`DESCRIPTION`}</Text>
        </View>
        <View style={{ justifyContent: "center", width: scaleWidth(120) }}>
          <Text style={styles.headerStyle}>{`STAFF`}</Text>
        </View>

        <View
          style={[
            styles.headerContent,
            {
              width: scaleWidth(80),
            },
          ]}
        >
          <Text style={styles.headerStyle}>{`TOTAL`}</Text>
        </View>
      </View>
    );
  };

  return isSalonApp ? renderSalonHeaderInvoice() : renderHeaderInvoice();
};

const styles = StyleSheet.create({
  content: { flexDirection: "row" },

  textStyle: { fontSize: 18, fontWeight: "300", textAlign: "left" },

  headerStyle: {
    fontSize: scaleFont(17),
    fontWeight: "500",
    textAlign: "left",
  },

  headerContent: { justifyContent: "center", alignItems: "flex-start" },
});
