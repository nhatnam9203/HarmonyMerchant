import React from "react";
import { StyleSheet, View } from "react-native";
import { ReceiptContent } from "./ReceiptContent";

export const ReceiptViewShot = React.forwardRef(({ backgroundColor }, ref) => {
  const viewShotRef = React.useRef(null);

  return (
    <View
      ref={viewShotRef}
      style={[styles.viewShotContainer, { backgroundColor }]}
    >
      <ReceiptContent />
    </View>
  );
});

const styles = StyleSheet.create({
  viewShotContainer: {
    paddingHorizontal: scaleWidth(10),
  },
});
