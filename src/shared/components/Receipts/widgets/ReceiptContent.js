import React from "react";
import { View, StyleSheet } from "react-native";
import {
  ReceiptHeaderItem,
  ReceiptItem,
  ReceiptTotalItem,
} from "./ReceiptItem";

export const ReceiptContent = ({ items, type, symbol }) => {
  const getTotalQty = () => {
    const totalQty = items?.reduce((prev, item, index) => {
      const qty = item.data?.qty ?? 1;
      return prev + qty;
    }, 0);

    return totalQty ?? 0;
  };

  return (
    <View style={styles.container}>
      <ReceiptHeaderItem key="receipt-header" type={type} symbol={symbol} />
      {items?.map((x, idx) => (
        <ReceiptItem
          key={`receipt-item-${x.id}`}
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
