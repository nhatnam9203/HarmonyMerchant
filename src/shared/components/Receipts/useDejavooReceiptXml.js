import {
  formatNumberFromCurrency,
  formatWithMoment,
  getCenterBoldStringArrayXml,
  getCenterStringArrayXml,
  getPaymentString,
  stringIsEmptyOrWhiteSpaces,
} from "@utils";
import _ from "lodash";
import { useSelector } from "react-redux";

export const useDejavooReceiptXml = ({
  items,
  checkoutPaymentMethods,
  invoiceNO,
  symbol,
  invoiceDate,
  subTotal,
  discount,
  tip,
  tax,
  total,
  fee,
  cashDiscount,
  due,
  change,
  taxRate,
  isSignature,
  printTemp,
  typeReceipt,
}) => {
  const profile = useSelector((state) => state.dataLocal.profile);

  const getInvoiceItemsXml = () => {
    if (!items?.length) return "";

    let stringItems = "";

    items.map((item, index) => {
      const { data = {}, note = "", staff = {}, extras = [] } = item || {};
      const {
        price = 0,
        discount = 0,
        discountPercent = 0,
        qty = 1,
        name = "",
        label = "",
        barCode,
      } = data;

      const staffName = staff?.displayName ?? "";
      const staffXml = staffName ? `<t>(${staffName})</t>` : ``;
      const noteXml = note ? `<t>(Note: ${note})</t>` : ``;
      const total = formatNumberFromCurrency(price) * qty;

      stringItems =
        stringItems +
        `<t>${_.padEnd(
          _.truncate(`${index + 1}.${name}`, {
            length: 15,
          }),
          15,
          "."
        )}${_.padStart(`$${total}`, 9, ".")}</t>
            ${noteXml}
            ${staffXml}`;
    });

    return stringItems;
  };

  const getContentXmlReceipt = () => {
    const invoiceNo = invoiceNO ? `Invoice No: ${invoiceNO ?? " "}` : ``;
    let entryMethodXml = "";
    if (!printTemp) {
      checkoutPaymentMethods?.map((data, index) => {
        entryMethodXml =
          entryMethodXml +
          `<br/><t>- Entry method:</t>
              <t>${_.padEnd(
                `${getPaymentString(data?.paymentMethod || "")}`,
                15,
                "."
              )}${_.padStart(
            `$${Number(formatNumberFromCurrency(data?.amount || "0")).toFixed(
              2
            )}`,
            9,
            "."
          )}</t>
                ${
                  (data.paymentMethod &&
                    data.paymentMethod === "credit_card") ||
                  data.paymentMethod === "debit_card"
                    ? `<t>${data?.paymentInformation?.type || ""}: ***********${
                        data?.paymentInformation?.number || ""
                      }</t>
                      ${
                        data?.paymentInformation?.sn
                          ? `<t>Terminal ID: ${data?.paymentInformation?.sn}</t>`
                          : ""
                      }
                      ${
                        data?.paymentInformation?.refNum
                          ? `<t>Transaction #: ${data?.paymentInformation?.refNum}</t>`
                          : ""
                      }
                      ${
                        !stringIsEmptyOrWhiteSpaces(
                          _.get(data, "paymentInformation.signData")
                        )
                          ? `<t>Signature: </t>
                          <img>${data?.paymentInformation?.signData}</img>`
                          : ""
                      }

                      ${
                        data?.paymentInformation?.name
                          ? `<t>${data?.paymentInformation?.name
                              ?.replace(/%20/g, " ")
                              .replace(/%2f/g, " ")}</t>`
                          : ""
                      }
                      `
                    : ``
                }`;
      });
    }

    let xmlContent = `${getCenterBoldStringArrayXml(
      profile?.businessName || " "
    )}
        ${getCenterStringArrayXml(profile?.addressFull || " ")}
        <t><c>${`Tel : ${profile?.phone || " "}`}</c></t>
        <t><c>${profile?.webLink}</c></t>
        <t><b><c>${`${symbol}`}</c></b></t>
        <t><c>${`( ${formatWithMoment(
          new Date(),
          "MM/DD/YYYY hh:mm A"
        )} )`}</c></t>
        <t><c>${"-".repeat(24)}</c></t>
        <t>Customer: ${getCustomerName()}</t>
        <t>Invoice Date: ${invoiceDate}</t>
        <t>${invoiceNo}</t>
        <t><c>${"-".repeat(24)}</c></t>
        <t><b><c>DESCRIPTION.......TOTAL</c></b></t>
        <t><c>${"-".repeat(24)}</c></t>
        ${getInvoiceItemsXml()}
        <t><c>${"-".repeat(24)}</c></t>
        <t/>
        <t>${_.padEnd("Subtotal: ", 15, ".")}${_.padStart(
      `$${subTotal}`,
      9,
      "."
    )}</t>
        <t>${_.padEnd("Discount: ", 15, ".")}${_.padStart(
      `$${discount}`,
      9,
      "."
    )}</t>
        <t>${_.padEnd("Tip: ", 15, ".")}${_.padStart(`$${tip}`, 9, ".")}</t>
        <t>${_.padEnd("Tax: ", 15, ".")}${_.padStart(`$${tax}`, 9, ".")}</t>
        ${
          fee != 0 &&
          `<t>${_.padEnd("Non-Cash Fee:", 15, ".")}${_.padStart(
            `$${fee}`,
            9,
            "."
          )}</t>`
        }
        ${
          cashDiscount != 0 &&
          `<t>${_.padEnd("Cash Discount: ", 15, ".")}${_.padStart(
            `$${cashDiscount}`,
            9,
            "."
          )}</t>`
        }
        ${
          !printTemp
            ? `<t><b><c>${_.padEnd("Total: ", 15, ".")}${_.padStart(
                `$${getTotal()}`,
                9,
                "."
              )}</c></b></t>
       ${entryMethodXml}
       ${
         isSignature
           ? `<br/><br/><t>Signature: _____________</t><br/><br/>`
           : ``
       }
        `
            : ``
        }
        ${
          printTemp
            ? `<t>${_.padEnd("Tip: ", 24, ".")}</t>
                        <t>${_.padEnd("Total:", 24, ".")}</t>
                        <br/>
                        <br/>
                        <t>Signature: _____________</t>
                        <br/><br/>`
            : ``
        }
        ${
          profile?.receiptFooter
            ? `<t>${getCenterStringArrayXml(profile?.receiptFooter)}</t>`
            : `<t><c>Thank you!</c></t>
            <t><c>Please come again</c></t>`
        }
        ${!!promotionNotes ? `<t>Discount note: ${promotionNotes}</t>` : ``}
        <t>${_.pad(typeReceipt, 24, "*")}</t>
        <br/><br/><br/><br/><br/><br/><br/><br/>
        `;
    return xmlContent;
  };

  return {
    getContentXmlReceipt,
  };
};
