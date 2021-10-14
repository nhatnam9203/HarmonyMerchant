import { formatMoney } from "@utils";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const ItemReceipt = ({ item, index, type }) => {
  const renderItemInvoice = () => {
    const price = item.data && item.data.price ? item.data.price : 0;
    const quanlitySet = item.quanlitySet ?? 1;
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

        <View style={{ justifyContent: "center", width: scaleWidth(100) }}>
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

  const renderItemReturnReceipt = () => {
    const quanlitySet = item?.returnQuantity ?? 1;
    const total = item?.returnPrice;
    const price = item?.returnPrice / quanlitySet;

    return (
      <View style={styles.content}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={[styles.textStyle]}>
            {`${index + 1}. ${item?.productName ?? " "}`}
          </Text>
        </View>

        <View
          style={[
            styles.headerContent,
            {
              width: scaleWidth(50),
            },
          ]}
        >
          <Text style={styles.textStyle}>{item?.saleQuantity}</Text>
        </View>

        <View style={{ justifyContent: "center", width: scaleWidth(60) }}>
          <Text style={styles.textStyle}>{`$ ${item?.saslePrice}`}</Text>
        </View>

        <View
          style={[
            styles.headerContent,
            {
              width: scaleWidth(60),
              alignItems: "center",
            },
          ]}
        >
          <Text
            style={[styles.textStyle, { textAlign: "center", flex: 1 }]}
          >{`${item?.returnQuantity} `}</Text>
        </View>

        <View style={{ justifyContent: "center", width: scaleWidth(60) }}>
          <Text style={styles.textStyle}>{`$${item?.returnPrice}`}</Text>
        </View>
      </View>
    );
  };

  switch (type) {
    default:
      return renderItemInvoice();
    case "SalonPos":
      return renderSalonItemInvoice();
    case "ReturnReceipt":
      return renderItemReturnReceipt();
  }
};

export const ItemHeaderReceipt = ({ type }) => {
  const renderHeaderInvoice = () => {
    return (
      <View style={styles.content}>
        <View style={[styles.headerContent, { flex: 1 }]}>
          <Text style={styles.headerStyle}>{`DESCRIPTION`}</Text>
        </View>
        <View style={{ justifyContent: "center", width: scaleWidth(100) }}>
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

  const renderItemReturnHeaderReceipt = () => {
    return (
      <View style={styles.content}>
        <View style={[styles.headerContent, { flex: 1 }]}>
          <Text style={styles.headerStyle}>{`Name`}</Text>
        </View>

        <View
          style={[
            styles.headerContent,
            {
              width: scaleWidth(50),
            },
          ]}
        >
          <Text style={styles.headerStyle}>{`Qty`}</Text>
        </View>

        <View style={{ justifyContent: "center", width: scaleWidth(60) }}>
          <Text style={styles.headerStyle}>{` Price`}</Text>
        </View>

        <View
          style={[
            styles.headerContent,
            {
              width: scaleWidth(60),
            },
          ]}
        >
          <Text style={styles.headerStyle}>{`Return Qty`}</Text>
        </View>

        <View style={{ justifyContent: "center", width: scaleWidth(60) }}>
          <Text style={styles.headerStyle}>{`Return Total`}</Text>
        </View>
      </View>
    );
  };

  switch (type) {
    default:
      return renderHeaderInvoice();
    case "SalonPos":
      return renderSalonHeaderInvoice();
    case "ReturnReceipt":
      return renderItemReturnHeaderReceipt();
  }
};

const styles = StyleSheet.create({
  content: { flexDirection: "row" },

  textStyle: { fontSize: scaleFont(15), fontWeight: "400", textAlign: "left" },

  headerStyle: {
    fontSize: scaleFont(15),
    fontWeight: "500",
    textAlign: "left",
  },

  headerContent: { justifyContent: "center", alignItems: "flex-start" },
});
