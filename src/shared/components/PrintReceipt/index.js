import {
  formatMoney,
  formatNumberFromCurrency,
  formatWithMoment,
  getInfoFromModelNameOfPrinter,
  getPaymentString,
  stringIsEmptyOrWhiteSpaces,
} from "@utils";
import _ from "lodash";
import { StarPRNT } from "react-native-star-prnt";
import {
  PrintAlignmentText,
  processColumnText,
  processTotalLine,
} from "./PrintColumn";
import PrintManager from "@lib/PrintManager";

export const useHarmonyPrinter = ({ profile, printerList, printerSelect }) => {
  const { portName, emulation, widthPaper } = getInfoFromModelNameOfPrinter(
    printerList,
    printerSelect
  );

  const width = Math.max(Math.round(parseFloat(widthPaper) / 14), 30);
  const wQTY = 5;
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
      let arr = [`${`${index + 1}. ${name}`}`, `${quanlitySet}`, `$${total}`];

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
    printTempt,
    fromAppointmentTab,
    getCheckoutPaymentMethods,
    isSignature,
    footerReceipt,
    promotionNotes,
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
      append: `${isSalon ? "Customer:    " : "Staff Name:  "}${name}\n`,
    });
    // INVOICE DATE
    if (invoiceDate) {
      commands.push({
        append: `Invoice Date:${invoiceDate}\n`,
      });
    }
    commands.push({
      append: `Invoice NO:  ${invoiceNo}\n`,
    });

    const text = createTextReceipt(items);
    commands.push({
      appendAlignment: StarPRNT.AlignmentPosition.Left,
    });
    commands.push({
      appendBitmapText: text,
      fontSize: 10,
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

    if (total && !printTempt) {
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
      append: "\n",
    });

    if (printTempt && !fromAppointmentTab) {
      commands.push({
        append: "Tip: \n\n",
      });

      commands.push({
        append: "Total: \n\n",
      });
    }

    if (!printTempt && getCheckoutPaymentMethods?.length > 0) {
      getCheckoutPaymentMethods.forEach((data) => {
        commands.push({
          append: `- Entry method: ${getPaymentString(
            data?.paymentMethod || ""
          )} $${Number(formatNumberFromCurrency(data?.amount || "0")).toFixed(
            2
          )}\n`,
        });
        if (
          data?.paymentMethod === "credit_card" ||
          data?.paymentMethod === "debit_card"
        ) {
          commands.push({
            append: `    ${data?.paymentInformation?.type || ""}: ***********${
              data?.paymentInformation?.number || ""
            }\n`,
          });
          commands.push({
            append: `    ${
              data?.paymentInformation?.name?.replace(/%20/g, " ") || ""
            }\n`,
          });
          commands.push({
            append: `    ${
              data?.paymentInformation?.sn
                ? `Terminal ID: ${data?.paymentInformation?.sn}`
                : ""
            }\n`,
          });
          commands.push({
            append: `    ${
              data?.paymentInformation?.refNum
                ? `Transaction #: ${data?.paymentInformation?.refNum}`
                : ""
            }\n`,
          });
        }
        if (
          !stringIsEmptyOrWhiteSpaces(
            _.get(data, "paymentInformation.signData")
          )
        ) {
          commands.push({
            append: `    Signature: `,
          });

          commands.push({
            appendBitmap: `data:image/png;base64,${data?.paymentInformation?.signData}`,
            width: 20,
            bothScale: true,
            diffusion: true,
            alignment: "Center",
          });

          commands.push({
            append: `\n`,
          });
        }
      });
    }

    if (isSignature && !printTempt) {
      commands.push({
        append: `Signature: \n\n\n`,
      });
    }

    if (printTempt && !fromAppointmentTab) {
      commands.push({
        append: `Signature: \n\n\n`,
      });
    }

    if (promotionNotes) {
      commands.push({
        append: `Discount note: ${promotionNotes} \n`,
      });
    }

    commands.push({
      append: `\n`,
    });

    commands.push({
      appendAlignment: StarPRNT.AlignmentPosition.Center,
    });

    if (profile?.receiptFooter) {
      commands.push({
        append: ` ${profile?.receiptFooter}\n`,
      });
    } else {
      commands.push({
        append: `Thank you!\nPlease come again\n`,
      });
    }

    commands.push({
      append: `***** ${footerReceipt} *****\n`,
    });

    if (barCode) {
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
    }

    commands.push({
      appendCutPaper: StarPRNT.CutPaperAction.PartialCutWithFeed,
    });

    await PrintManager.getInstance().print(emulation, commands, portName);
  };

  return { printAppointment };
};
