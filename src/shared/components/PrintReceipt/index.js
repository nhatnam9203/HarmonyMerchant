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
import _ from "lodash";

export const useHarmonyPrinter = ({ profile, printerList, printerSelect }) => {
  const { portName, emulation, widthPaper } = getInfoFromModelNameOfPrinter(
    printerList,
    printerSelect
  );

  const createTextReceipt = (items) => {
    console.log(items);

    const itemText = items.reduce((prev, item, index) => {
      const price = item.data && item.data.price ? item.data.price : 0;
      const discount = item?.data?.discount;
      const discountPercent = item?.data?.discountPercent;

      const quanlitySet = item.quanlitySet ?? 1;
      const total = formatMoney(price * quanlitySet);
      const note = item.note ? item.note : "";
      const label = item?.data?.value;
      const name = item.data?.name ?? "";

      return prev + `${`${index}. ${name}`}  ${quanlitySet}\n`;
    }, "");

    return (
      "\n--------------------------------------\n" +
      "DESCRIPTION        PRICE    QTY  TOTAL  \n" +
      "--------------------------------------\n" +
      `${itemText}` +
      ""
    );
  };

  const printAppointment = async ({
    emphasis,
    isSalon,
    name,
    invoiceDate,
    invoiceNo,
    items,
  }) => {
    let commands = [];
    commands.push({ appendLineFeed: 0 });
    // Store Name
    commands.push({
      alignment: "Center",
      appendBitmapText: `${profile?.businessName ?? ""}`,
      fontSize: 12,
      bothScale: true,
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
    commands.push({
      append: "\n",
    });
    // SALE/VOID/REFUND
    commands.push({
      alignment: "Center",
      appendBitmapText: `${emphasis}`,
      fontSize: 14,
    });
    // DATE
    commands.push({
      alignment: "Center",
      appendBitmapText: `(${formatWithMoment(
        new Date(),
        "MM/DD/YYYY hh:mm A"
      )})`,
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
    commands.push({
      alignment: "Left",
      appendBitmapText: `Invoice NO:   ${invoiceNo}`,
      fontSize: 12,
    });

    const text = createTextReceipt(items);
    console.log(text);

    commands.push({
      alignment: "Center",
      appendBitmapText: text,
      fontSize: 12,
    });

    commands.push({
      appendCutPaper: StarPRNT.CutPaperAction.PartialCutWithFeed,
    });
    await PrintManager.getInstance().print(emulation, commands, portName);
  };

  return { printAppointment };
};
