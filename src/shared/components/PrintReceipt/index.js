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
import PrintManager from "@lib/PrintManager";

export const useHarmonyPrinter = ({ profile, printerList, printerSelect }) => {
  const { portName, emulation, widthPaper } = getInfoFromModelNameOfPrinter(
    printerList,
    printerSelect
  );

  const printAppointment = async ({ emphasis, isSalon, name, invoiceDate }) => {
    let commands = [];
    // commands.push({ appendLineFeed: 2 });
    // Store Name
    commands.push({
      alignment: "Center",
      appendBitmapText: profile?.businessName ?? "",
      fontSize: 12,
    });
    // Store Address
    commands.push({
      alignment: "Center",
      appendBitmapText: `${profile?.addressFull ?? ""}`,
      fontSize: scaleFont(12),
    });
    // Store Phone
    commands.push({
      alignment: "Center",
      appendBitmapText: `Tel : ${profile?.phone || " "}`,
      fontSize: 12,
    });
    // Store WebLink
    commands.push({
      alignment: "Center",
      appendBitmapText: `${profile?.webLink ?? ""}`,
      fontSize: 12,
    });
    // SALE/VOID/REFUND
    commands.push({
      alignment: "Center",
      appendBitmapText: `${emphasis}\n`,
      fontSize: 14,
    });
    // DATE
    commands.push({
      alignment: "Center",
      appendBitmapText: `( ${formatWithMoment(
        new Date(),
        "MM/DD/YYYY hh:mm A"
      )} )`,
      fontSize: 12,
    });
    // LINE
    commands.push({
      appendLineSpace: 2,
    });
    // STAFF/CUSTOMER
    commands.push({
      alignment: "Left",
      appendBitmapText: `${isSalon ? "Customer:" : "Staff Name:"}   ${name}`,
      fontSize: 12,
    });
    // INVOICE DATE
    if (invoiceDate) {
      commands.push({
        alignment: "Left",
        appendBitmapText: `Invoice Date:   ${invoiceDate}`,
        fontSize: 12,
      });
    }
    commands.push({ appendLineFeed: 2, appendUnitFeed: 32 });
    commands.push({
      appendCutPaper: StarPRNT.CutPaperAction.PartialCutWithFeed,
    });
    await PrintManager.getInstance().print(emulation, commands, portName);
  };

  return { printAppointment };
};
