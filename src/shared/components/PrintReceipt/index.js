import React from "react";
import { StarPRNT } from "react-native-star-prnt";
import { useSelector } from "react-redux";
import {
  checkIsTablet,
  formatNumberFromCurrency,
  formatWithMoment,
  getInfoFromModelNameOfPrinter,
  getPaymentString,
  getStaffNameForInvoice,
  scaleSize,
  PaymentTerminalType,
  stringIsEmptyOrWhiteSpaces,
  requestPrintDejavoo,
  getCenterStringArrayXml,
  formatMoney,
  formatMoneyWithUnit,
} from "@utils";

export const useHarmonyPrinter = ({ profile, printerList, printerSelect }) => {
  const { portName, emulation, widthPaper } = getInfoFromModelNameOfPrinter(
    printerList,
    printerSelect
  );

  const printAppointment = async ({ emphasis, isSalon, name }) => {
    let commands = [];
    // Store Name
    commands.push({
      alignment: "center",
      appendBitmapText: `${profile?.businessName ?? ""}\n`,
      fontSize: scaleFont(22),
    });
    // Store Address
    commands.push({
      alignment: "center",
      appendBitmapText: `${profile?.addressFull ?? ""}\n`,
      fontSize: scaleFont(18),
    });
    // Store Phone
    commands.push({
      alignment: "center",
      appendBitmapText: `Tel : ${profile?.phone || " "}\n`,
      fontSize: scaleFont(18),
    });
    // Store WebLink
    commands.push({
      alignment: "center",
      appendBitmapText: `${profile?.webLink ?? ""}`,
      fontSize: scaleFont(18),
    });
    // SALE/VOID/REFUND
    commands.push({
      appendEmphasis: `${emphasis}\n`,
      enableEmphasis: true,
    });
    // DATE
    commands.push({
      alignment: "center",
      appendBitmapText: `( ${formatWithMoment(
        new Date(),
        "MM/DD/YYYY hh:mm A"
      )} )`,
      fontSize: scaleFont(18),
    });
    // LINE
    commands.push({
      appendLineSpace: 32,
    });
    // STAFF/CUSTOMER
    commands.push({
      alignment: "left",
      appendBitmapText: `${isSalon ? "Customer:" : "Staff Name:"}   ${name}`,
      fontSize: scaleFont(18),
    });

    await PrintManager.getInstance().print(emulation, commands, portName);
  };

  return { printAppointment };
};
