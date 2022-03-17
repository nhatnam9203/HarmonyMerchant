import React from "react";
import { View, StyleSheet } from "react-native";
import { ReceiptHeaderItem, ReceiptItem } from "./ReceiptItem";

export const ReceiptContent = ({ items, type }) => {
  return (
    <View style={styles.styles}>
      <ReceiptHeaderItem key="receipt-header" type={type} />
      {items.map((x, idx) => (
        <ReceiptItem
          key={`receipt-item-${x.id ?? idx}`}
          item={x}
          index={idx}
          type={type}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
