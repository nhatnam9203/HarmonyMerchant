import React from "react";
import { View, StyleSheet } from "react-native";
import {
  ReceiptHeaderItem,
  ReceiptItem,
  ReceiptTotalItem,
} from "./ReceiptItem";

export const ReceiptContent = ({ items, type }) => {
  const getTotalQty = () => {
    const totalQty = items.reduce((prev, item, index) => {
      const qty = item.data?.qty ?? 1;
      return prev + qty;
    }, 0);

    return totalQty;
  };

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
      <ReceiptTotalItem
        key="receipt-total-qty"
        type={type}
        total={getTotalQty()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
