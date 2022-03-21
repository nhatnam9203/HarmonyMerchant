import { useSelector } from "react-redux";
import {
  useGetGroupAppointment,
  useGetInvoiceDetail,
} from "@shared/services/api/app";

export const useDejavooReceiptXml = () => {
  const profile = useSelector((state) => state.dataLocal.profile);

  const [groupAppointmentData, getGroupAppointment] = useGetGroupAppointment();

  const getInvoiceItemsXml = () => {
    if (!groupAppointment) return "";

    let stringItems = "";

    // let invoiceItems = getBasketOnline(groupAppointment?.appointments)?.map(
    //   (item, index) => {
    //     const price = item.data && item.data.price ? item.data.price : 0;
    //     const quanlitySet = item.quanlitySet ? item.quanlitySet : 1;
    //     const total = formatMoney(price * quanlitySet);
    //     const note = item.note ? item.note : "";
    //     const staffName = item.staff?.displayName ?? "";

    //     const noteXml = note ? `<t>(Note: ${note})</t>` : ``;
    //     const staffXml = staffName ? `<t>(${staffName})</t>` : ``;
    //     const extraItems = item.extras || []; // item : {extraName, price}

    //     stringItems =
    //       stringItems +
    //       `<t>${_.padEnd(
    //         _.truncate(`${index + 1}.${_.get(item, "data.name")}`, {
    //           length: 15,
    //         }),
    //         15,
    //         "."
    //       )}${_.padStart(`$${total}`, 9, ".")}</t>
    //         ${noteXml}
    //         ${staffXml}`;
    //   }
    // );
    return stringItems;
  };

  const getContentXmlReceipt = () => {
    // const invoiceNo = checkoutId ? `Invoice No: ${checkoutId ?? " "}` : ``;
    // let entryMethodXml = "";
    // if (!printTempt) {
    //   getCheckoutPaymentMethods()?.map((data, index) => {
    //     entryMethodXml =
    //       entryMethodXml +
    //       `<br/><t>- Entry method:</t>
    //           <t>${_.padEnd(
    //             `${getPaymentString(data?.paymentMethod || "")}`,
    //             15,
    //             "."
    //           )}${_.padStart(
    //         `$${Number(formatNumberFromCurrency(data?.amount || "0")).toFixed(
    //           2
    //         )}`,
    //         9,
    //         "."
    //       )}</t>
    //             ${
    //               (data.paymentMethod &&
    //                 data.paymentMethod === "credit_card") ||
    //               data.paymentMethod === "debit_card"
    //                 ? `<t>${data?.paymentInformation?.type || ""}: ***********${
    //                     data?.paymentInformation?.number || ""
    //                   }</t>
    //                   ${
    //                     data?.paymentInformation?.sn
    //                       ? `<t>Terminal ID: ${data?.paymentInformation?.sn}</t>`
    //                       : ""
    //                   }
    //                   ${
    //                     data?.paymentInformation?.refNum
    //                       ? `<t>Transaction #: ${data?.paymentInformation?.refNum}</t>`
    //                       : ""
    //                   }
    //                   ${
    //                     !stringIsEmptyOrWhiteSpaces(
    //                       _.get(data, "paymentInformation.signData")
    //                     )
    //                       ? `<t>Signature: </t>
    //                       <img>${data?.paymentInformation?.signData}</img>`
    //                       : ""
    //                   }

    //                   ${
    //                     data?.paymentInformation?.name
    //                       ? `<t>${data?.paymentInformation?.name
    //                           ?.replace(/%20/g, " ")
    //                           .replace(/%2f/g, " ")}</t>`
    //                       : ""
    //                   }
    //                   `
    //                 : ``
    //             }`;
    //   });
    // }

    // let xmlContent = `${getCenterBoldStringArrayXml(
    //   profile?.businessName || " "
    // )}
    //     ${getCenterStringArrayXml(profile?.addressFull || " ")}
    //     <t><c>${`Tel : ${profile?.phone || " "}`}</c></t>
    //     <t><c>${profile?.webLink}</c></t>
    //     <t><b><c>${`${
    //       invoiceDetail?.status &&
    //       invoiceDetail?.status !== "paid" &&
    //       invoiceDetail?.status !== "pending" &&
    //       invoiceDetail?.status !== "incomplete" &&
    //       invoiceDetail?.status !== "complete"
    //         ? `${invoiceDetail?.status}`.toUpperCase()
    //         : "SALE"
    //     }`}</c></b></t>
    //     <t><c>${`( ${formatWithMoment(
    //       new Date(),
    //       "MM/DD/YYYY hh:mm A"
    //     )} )`}</c></t>
    //     <t><c>${"-".repeat(24)}</c></t>
    //     <t>Customer: ${getCustomerName()}</t>
    //     <t>Invoice Date: ${formatWithMoment(
    //       invoiceDetail?.createdDate,
    //       "MM/DD/YYYY hh:mm A"
    //     )}</t>
    //     <t>${invoiceNo}</t>
    //     <t><c>${"-".repeat(24)}</c></t>
    //     <t><b><c>DESCRIPTION.......TOTAL</c></b></t>
    //     <t><c>${"-".repeat(24)}</c></t>
    //     ${getInvoiceItemsXml()}
    //     <t><c>${"-".repeat(24)}</c></t>
    //     <t/>
    //     <t>${_.padEnd("Subtotal: ", 15, ".")}${_.padStart(
    //   `$${getSubTotal()}`,
    //   9,
    //   "."
    // )}</t>
    //     <t>${_.padEnd("Discount: ", 15, ".")}${_.padStart(
    //   `$${getDiscount()}`,
    //   9,
    //   "."
    // )}</t>
    //     <t>${_.padEnd("Tip: ", 15, ".")}${_.padStart(
    //   `$${getTipAmount()}`,
    //   9,
    //   "."
    // )}</t>
    //     <t>${_.padEnd("Tax: ", 15, ".")}${_.padStart(
    //   `$${getTax()}`,
    //   9,
    //   "."
    // )}</t>
    //     ${
    //       getNonCashFee() != 0 &&
    //       `<t>${_.padEnd("Non-Cash Fee:", 15, ".")}${_.padStart(
    //         `$${getNonCashFee()}`,
    //         9,
    //         "."
    //       )}</t>`
    //     }
    //     ${
    //       getCashDiscount() != 0 &&
    //       `<t>${_.padEnd("Cash Discount: ", 15, ".")}${_.padStart(
    //         `$${getCashDiscount()}`,
    //         9,
    //         "."
    //       )}</t>`
    //     }
    //     ${
    //       !printTempt
    //         ? `<t><b><c>${_.padEnd("Total: ", 15, ".")}${_.padStart(
    //             `$${getTotal()}`,
    //             9,
    //             "."
    //           )}</c></b></t>
    //    ${entryMethodXml}
    //    ${
    //      isSignature
    //        ? `<br/><br/><t>Signature: _____________</t><br/><br/>`
    //        : ``
    //    }
    //     `
    //         : ``
    //     }
    //     ${
    //       printTempt
    //         ? `<t>${_.padEnd("Tip: ", 24, ".")}</t>
    //                     <t>${_.padEnd("Total:", 24, ".")}</t>
    //                     <br/>
    //                     <br/>
    //                     <t>Signature: _____________</t>
    //                     <br/><br/>`
    //         : ``
    //     }
    //     ${
    //       profile?.receiptFooter
    //         ? `<t>${getCenterStringArrayXml(profile?.receiptFooter)}</t>`
    //         : `<t><c>Thank you!</c></t>
    //         <t><c>Please come again</c></t>`
    //     }
    //     ${
    //       !!getPromotionNotes(groupAppointment?.appointments)
    //         ? `<t>Discount note: ${getPromotionNotes(
    //             groupAppointment?.appointments
    //           )}</t>`
    //         : ``
    //     }
    //     <t>${_.pad(getFooterReceipt(), 24, "*")}</t>
    //     <br/><br/><br/><br/><br/><br/><br/><br/>
    //     `;
    return "xmlContent";
  };

  return {
    getInvoiceItemsXml,
    getContentXmlReceipt,
  };
};
