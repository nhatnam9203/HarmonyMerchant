import PrintManager from "@lib/PrintManager";
import IMAGE from "@resources";
import { getInfoFromModelNameOfPrinter, PaymentTerminalType } from "@utils";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { StarPRNT } from "react-native-star-prnt";
import { useDispatch, useSelector } from "react-redux";

export const ButtonPrintBarcode = ({ barCode }) => {
  const { printerSelect, printerList } = useSelector(
    (state) => state.dataLocal
  );
  const paymentMachineType = useSelector(
    (state) => state.hardware.paymentMachineType
  );

  const { portName, emulation, widthPaper } = getInfoFromModelNameOfPrinter(
    printerList,
    printerSelect
  );

  const onPrintCode = async () => {
    if (!barCode) return;
    if (paymentMachineType == PaymentTerminalType.Pax && !portName) {
      alert("Please connect to your printer!");
      return;
    }

    try {
      let commands = [];
      commands.push({ appendLineFeed: 0 });
      commands.push({
        appendAlignment: StarPRNT.AlignmentPosition.Center,
      });
      commands.push({
        append: `\n`,
      });
      commands.push({
        appendBarcode: "{B" + `${barCode}`,
        BarcodeSymbology: StarPRNT.BarcodeSymbology.Code128,
        BarcodeWidth: StarPRNT.BarcodeWidth.Mode1,
        height: 50,
        hri: true,
      });

      commands.push({
        append: `\n`,
      });

      commands.push({
        appendCutPaper: StarPRNT.CutPaperAction.FullCutWithFeed,
      });

      await PrintManager.getInstance().print(emulation, commands, portName);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.container} onPress={onPrintCode}>
        <Image source={IMAGE["printInvoice"]} style={styles.image} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: scaleWidth(4),
    marginLeft: scaleWidth(5),
  },

  image: {
    width: scaleWidth(25),
    height: scaleHeight(25),
    resizeMode: "contain",
  },
});
