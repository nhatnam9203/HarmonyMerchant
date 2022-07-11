import React from "react";
import { StyleSheet, View } from "react-native";
import {
  ReceiptHeaderItem,
  ReceiptItem,
  ReceiptTotalItem,
} from "./ReceiptItem";

export const ReceiptContent = ({
  items,
  type,
  symbol,
  isGroupLayout,
  groupTitle,
}) => {
  const getTotalQty = () => {
    const totalQty = items?.reduce((prev, item, index) => {
      const qty = item.data?.qty ?? 1;
      const returnQty = item.data?.returnQuantity ?? 0;
      return prev + (qty - returnQty);
    }, 0);

    return totalQty ?? 0;
  };

  return (
    <>
      <ReceiptHeaderItem
        key="receipt-header"
        type={type}
        symbol={symbol}
        label={groupTitle}
      />
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
    </>
  );
};
