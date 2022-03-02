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
import { processColumnText } from "./PrintColumn";

export const useHarmonyPrinter = ({ profile, printerList, printerSelect }) => {
  const {
    portName,
    emulation,
    widthPaper = 46,
  } = getInfoFromModelNameOfPrinter(printerList, printerSelect);

  const createTextReceipt = (items) => {
    console.log(items);

    let textFormat = "\n";
    textFormat += "--------------------------------------\n";
    let columnAliment = [0, 1, 2];
    let columnWidth = [30 - 14, 4, 10];
    const headers = ["DESCRIPTION", "QTY", "TOTAL"];

    const result = processColumnText(headers, columnWidth, columnAliment, [
      "",
      "",
      "",
    ]);
    textFormat += result + "\n";
    textFormat += "--------------------------------------\n";

    const itemText = items.reduce((prev, item, index) => {
      const price = item.data && item.data.price ? item.data.price : 0;
      // const discount = item?.data?.discount;
      // const discountPercent = item?.data?.discountPercent;

      const quanlitySet = item.quanlitySet ?? 1;
      const total = formatMoney(price * quanlitySet);
      const note = item.note;
      const label = item?.data?.value;
      const name = item.data?.name ?? "";
      let arr = [`${`${index}. ${name}`}`, `${quanlitySet}`, `$${total}`];

      let itemText = processColumnText(arr, columnWidth, columnAliment, [
        "",
        "",
        "",
      ]);
      if (label) {
        itemText += "\n" + label;
      }

      if (note) {
        itemText += "\n" + note;
      }

      return prev + itemText + "\n";
    }, "");

    textFormat += itemText + "\n";

    console.log(textFormat);

    return textFormat;
  };

  const printAppointment = async ({
    emphasis,
    isSalon,
    name,
    invoiceDate,
    invoiceNo,
    items,
    subTotal,
    discount,
    tipAmount,
    tax,
    total,
    change,
  }) => {
    let commands = [];
    commands.push({ appendLineFeed: 0 });
    // Store Name
    commands.push({ appendFontStyle: "B" });
    commands.push({
      alignment: "Center",
      appendBitmapText: `${profile?.businessName ?? ""}`,
      fontSize: 10,
    });
    commands.push({ appendFontStyle: "A" });
    // Store Address
    commands.push({
      alignment: "Center",
      appendBitmapText: `${profile?.addressFull ?? ""}`,
      fontSize: 10,
    });
    // Store Phone
    commands.push({
      alignment: "Center",
      appendBitmapText: `Tel : ${profile?.phone || " "}`,
      fontSize: 10,
    });
    // Store WebLink
    commands.push({
      alignment: "Center",
      appendBitmapText: `${profile?.webLink ?? ""}`,
      fontSize: 10,
    });
    commands.push({
      append: "\n",
    });
    // SALE/VOID/REFUND
    commands.push({
      alignment: "Center",
      appendBitmapText: `${emphasis}`,
      fontSize: 10,
    });
    // DATE
    commands.push({
      alignment: "Center",
      appendBitmapText: `(${formatWithMoment(
        new Date(),
        "MM/DD/YYYY hh:mm A"
      )})`,
      fontSize: 10,
    });
    // LINE
    commands.push({
      appendLineSpace: 2,
    });
    // STAFF/CUSTOMER
    commands.push({
      alignment: "Left",
      appendBitmapText: `${isSalon ? "Customer:" : "Staff Name:"}   ${name}`,
      fontSize: 10,
    });
    // INVOICE DATE
    if (invoiceDate) {
      commands.push({
        alignment: "Left",
        appendBitmapText: `Invoice Date:   ${invoiceDate}`,
        fontSize: 10,
      });
    }
    commands.push({
      alignment: "Left",
      appendBitmapText: `Invoice NO:   ${invoiceNo}`,
      fontSize: 10,
    });

    const text = createTextReceipt(items);

    commands.push({
      alignment: "Center",
      appendBitmapText: text,
      fontSize: 8,
    });

    commands.push({
      appendLineSpace: 20,
    });

    if (subTotal) {
      commands.push({
        alignment: "Left",
        appendBitmapText: `Subtotal: ${subTotal}`,
        fontSize: 10,
      });
    }

    if (discount) {
      commands.push({
        alignment: "Left",
        appendBitmapText: `Discount: ${discount}`,
        fontSize: 10,
      });
    }

    if (tipAmount) {
      commands.push({
        alignment: "Left",
        appendBitmapText: `Tip: ${tipAmount}`,
        fontSize: 10,
      });
    }

    if (tax) {
      commands.push({
        alignment: "Left",
        appendBitmapText: `Tax: ${tax}`,
        fontSize: 10,
      });
    }

    if (total) {
      commands.push({
        alignment: "Left",
        appendBitmapText: `Total: ${total}`,
        fontSize: 10,
      });
    }

    if (change) {
      commands.push({
        alignment: "Left",
        appendBitmapText: `Change: ${change}`,
        fontSize: 10,
      });
    }

    commands.push({
      appendCutPaper: StarPRNT.CutPaperAction.PartialCutWithFeed,
    });

    await PrintManager.getInstance().print(emulation, commands, portName);
  };

  return { printAppointment };
};
