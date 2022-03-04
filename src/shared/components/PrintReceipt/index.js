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
import {
  processColumnText,
  processAlignText,
  PrintAlignmentText,
  processTotalLine,
} from "./PrintColumn";

export const useHarmonyPrinter = ({ profile, printerList, printerSelect }) => {
  const {
    portName,
    emulation,
    widthPaper = 46,
  } = getInfoFromModelNameOfPrinter(printerList, printerSelect);

  const width = parseFloat(widthPaper) || 32;
  const wQTY = 6;
  const wTOTAL = 10;

  const createTextReceipt = (items) => {
    let textFormat = "\n";
    textFormat += "--------------------------------------\n";
    let columnAliment = [
      PrintAlignmentText.LEFT,
      PrintAlignmentText.CENTER,
      PrintAlignmentText.RIGHT,
    ];
    let columnWidth = [width - wQTY - wTOTAL, wQTY, wTOTAL];
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
      const discount = item?.data?.discount;
      const discountPercent = item?.data?.discountPercent;

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

      if (discount > 0) {
        itemText += "\n";
        let itemsDiscount = [
          `Discount: $ ${discount}`,
          `- $${formatMoney(discount / quanlitySet)}`,
          `- $${formatMoney(discount)}`,
        ];
        itemText += processColumnText(
          itemsDiscount,
          columnWidth,
          columnAliment,
          ["", "", ""]
        );
      }

      if (discountPercent > 0) {
        itemText += "\n";
        let itemsDiscountPercents = [
          `Discount: ${discountPercent}%`,
          `- $${formatMoney((discountPercent * price) / 100)}`,
          `- $${formatMoney(((discountPercent * price) / 100) * quanlitySet)}`,
        ];
        itemText += processColumnText(
          itemsDiscountPercents,
          columnWidth,
          columnAliment,
          ["", "", ""]
        );
      }

      return prev + itemText + "\n";
    }, "");

    textFormat += itemText;
    textFormat += "--------------------------------------\n";

    const totalQty = items.reduce((prev, item, index) => {
      const quanlitySet = item.quanlitySet ?? 1;
      return prev + quanlitySet;
    }, 0);

    let totalQtyArr = ["Total QTY", `${totalQty}`, ""];
    textFormat += processColumnText(totalQtyArr, columnWidth, columnAliment, [
      "",
      "",
      "",
    ]);
    textFormat += "\n";

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
    taxRate,
    tax,
    total,
    change,
    barCode,
  }) => {
    let commands = [];
    commands.push({ appendLineFeed: 0 });
    commands.push({
      appendAlignment: StarPRNT.AlignmentPosition.Center,
    });
    // Store Name
    commands.push({
      append: `${profile?.businessName ?? ""}\n`,
    });
    // Store Address
    commands.push({
      append: `${profile?.addressFull ?? ""}\n`,
    });
    // Store Phone
    commands.push({
      append: `Tel : ${profile?.phone || " "}\n`,
    });
    // Store WebLink
    commands.push({
      append: `${profile?.webLink ?? ""}\n`,
    });
    // SALE/VOID/REFUND
    commands.push({
      append: `${emphasis}\n`,
    });
    // DATE
    commands.push({
      append: `(${formatWithMoment(new Date(), "MM/DD/YYYY hh:mm A")})\n`,
    });
    // LINE
    commands.push({
      appendLineSpace: 2,
    });
    commands.push({
      appendAlignment: StarPRNT.AlignmentPosition.Left,
    });
    // STAFF/CUSTOMER
    commands.push({
      append: `${isSalon ? "Customer:     " : "Staff Name:    "}${name}\n`,
    });
    // INVOICE DATE
    if (invoiceDate) {
      commands.push({
        append: `Invoice Date:   ${invoiceDate}\n`,
      });
    }
    commands.push({
      append: `Invoice NO:    ${invoiceNo}\n`,
    });

    const text = createTextReceipt(items);
    commands.push({
      appendAlignment: StarPRNT.AlignmentPosition.Left,
    });
    commands.push({
      appendBitmapText: text,
      fontSize: 10,
    });

    commands.push({
      appendBitmapText: "--------------------------------------\n",
      fontSize: 8,
    });

    if (subTotal) {
      commands.push({
        append: `${processTotalLine("Subtotal", subTotal)}\n`,
      });
    }

    if (discount) {
      commands.push({
        append: `${processTotalLine("Discount", discount)}\n`,
      });
    }

    if (tipAmount) {
      commands.push({
        append: `${processTotalLine("Tip", tipAmount)}\n`,
      });
    }

    if (tax) {
      commands.push({
        append: `${processTotalLine(`Tax:${taxRate}`, tax)}\n`,
      });
    }

    if (total) {
      commands.push({
        append: `${processTotalLine("Total", total)}\n`,
      });
    }

    if (change) {
      commands.push({
        append: `${processTotalLine("Change", change)}\n`,
      });
    }

    commands.push({
      appendBarcode: barCode ?? "09238292839",
      // BarcodeSymbology: BarcodeSymbology.Code128,
      // BarcodeWidth: BarcodeWidth.Mode2,
      height: 40,
      // hri: true,
    });

    commands.push({
      appendCutPaper: StarPRNT.CutPaperAction.PartialCutWithFeed,
    });

    // await PrintManager.getInstance().print(emulation, commands, portName);
  };

  return { printAppointment };
};
