import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts, layouts } from "@shared/themes";
import Barcode from "@kichiyaki/react-native-barcode-generator";

export const ReceiptBarcode = ({ code, widthPaper }) => {
  return code ? (
    <View style={styles.container}>
      <View style={styles.margin} />
      <View style={styles.margin} />

      <Barcode
        format="CODE39"
        value={`${code}`}
        text={`${code}`}
        // textStyle={styles.textBarcode}
        style={{ marginBottom: 10 }}
        maxWidth={widthPaper ? parseFloat(widthPaper) : scaleWidth(300)}
        height={scaleHeight(85)}
        textStyle={styles.textBarcodeStyle}
      />
    </View>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  textBarcode: {
    fontSize: scaleFont(20),
  },

  textBarcodeStyle: {
    // fontFamily: fonts.MEDIUM,
    color: "#000",
    fontSize: scaleFont(16),
    fontWeight: "500",
    textAlign: "center",
  },

  margin: {
    width: scaleWidth(10),
    height: scaleHeight(10),
  },
});
