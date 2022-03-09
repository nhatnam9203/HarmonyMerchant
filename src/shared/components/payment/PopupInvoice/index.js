import ButtonCustom from "@components/ButtonCustom";
import PrintManager from "@lib/PrintManager";
import {
  useGetGroupAppointment,
  useGetInvoiceDetail,
} from "@shared/services/api/app";
import { getFullName, statusSuccess } from "@shared/utils";
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
  getCenterBoldStringArrayXml,
  formatMoney,
  formatMoneyWithUnit,
} from "@utils";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import Dash from "react-native-dash";
import { StarPRNT } from "react-native-star-prnt";
import { captureRef, releaseCapture } from "react-native-view-shot";
import { useSelector } from "react-redux";
import RNFetchBlob from "rn-fetch-blob";
import { ItemHeaderReceipt, ItemReceipt } from "./ItemReceipt";
import { TotalView } from "./TotalView";
import { layouts } from "@shared/themes";
import _ from "lodash";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import { getTaxRateFromGroupAppointment } from "@utils";
import { useHarmonyPrinter } from "../../PrintReceipt";
import { useAppType } from "@shared/hooks";

export const PopupInvoice = React.forwardRef(
  ({ cancelInvoicePrint, doPrintClover }, ref) => {
    const viewShotRef = React.useRef(null);
    const tempHeight = checkIsTablet() ? scaleHeight(400) : scaleHeight(450);
    const { isRetailApp, isSalonApp } = useAppType();

    /**
  |--------------------------------------------------
  | REDUX variables
  |--------------------------------------------------
  */
    const profile = useSelector((state) => state.dataLocal.profile);
    const profileStaffLogin = useSelector(
      (state) => state.dataLocal.profileStaffLogin
    );
    const printerList = useSelector((state) => state.dataLocal.printerList);
    const printerSelect = useSelector((state) => state.dataLocal.printerSelect);
    /**
  |--------------------------------------------------
  | STATE variables
  |--------------------------------------------------
  */
    const [visible, setVisible] = React.useState(false);
    // const [titleInvoice, setTitleInvoice] = React.useState("TICKET");

    const [groupAppointment, setGroupAppointment] = React.useState(null);
    const [invoiceDetail, setInvoiceDetail] = React.useState(null);
    const [printTempt, setPrintTempt] = React.useState(false);
    const [isSignature, setIsSignature] = React.useState(true);
    const [isProcessingPrint, setIsProcessingPrint] = React.useState(false);
    const [isShare, setIsShare] = React.useState(false);
    const [paymentMachineType, setPaymentMachineType] = React.useState(null);
    const [fromAppointmentTab, setFromAppointmentTab] = React.useState(false);
    const [checkoutId, setCheckoutId] = React.useState(null);
    const [autoPrint, setAutoPrint] = React.useState(false);

    /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
    const [groupAppointmentData, getGroupAppointment] =
      useGetGroupAppointment();
    const [invoiceDetailData, getInvoiceDetail] = useGetInvoiceDetail();

    /**
  |--------------------------------------------------
  | FUNCTION
  |--------------------------------------------------
  */

    const { printAppointment } = useHarmonyPrinter({
      profile,
      printerList,
      printerSelect,
    });

    const reset = async () => {
      setAutoPrint(false);
      setGroupAppointment(null);
      setInvoiceDetail(null);
      // setTitleInvoice("TICKET");
      setIsShare(false);
      setPrintTempt(false);
      setIsSignature(true);
    };

    const getBasketOnline = (appointments) => {
      const arrayProductBuy = [];
      const arryaServicesBuy = [];
      const arrayExtrasBuy = [];
      const arrayGiftCards = [];
      const promotionNotes = [];

      appointments?.forEach((appointment) => {
        // ------ Push Service -------
        appointment?.services?.forEach((service) => {
          arryaServicesBuy.push({
            type: "Service",
            data: {
              name: service?.serviceName || "",
              price: service?.price || "",
            },
            staff: service?.staff || false,
            note: service?.note || "",
          });
        });

        // ------ Push Product -------
        appointment?.products?.forEach((product) => {
          arrayProductBuy.push({
            type: "Product",
            data: {
              name: product?.productName || "",
              price: product?.price || "",
              value: product?.value,
              discount: product?.discount,
              discountPercent: product?.discountPercent,
            },
            quanlitySet: product?.quantity || "",
          });
        });

        // ------ Push Product -------
        appointment?.extras?.forEach((extra) => {
          arrayExtrasBuy.push({
            type: "Extra",
            data: {
              name: extra?.extraName || "",
              price: extra?.price || "",
            },
          });
        });

        // ------ Push Gift Card -------
        appointment?.giftCards?.forEach((gift) => {
          arrayGiftCards.push({
            type: "GiftCards",
            data: {
              name: gift?.name || "Gift Card",
              price: gift?.price || "",
            },
            quanlitySet: gift?.quantity || "",
          });
        });
      });

      return arryaServicesBuy.concat(
        arrayExtrasBuy,
        arrayProductBuy,
        arrayGiftCards
      );
    };

    const getSubTotal = () => {
      if (groupAppointment) return groupAppointment?.subTotal;
      return 0;
    };
    const getDiscount = () => {
      if (groupAppointment) return groupAppointment?.discount;
      return 0;
    };
    const getTipAmount = () => {
      if (groupAppointment) return groupAppointment?.tipAmount;
      return 0;
    };

    const getTax = () => {
      if (groupAppointment) {
        return groupAppointment?.tax;
      }
      return 0;
    };

    const getTotal = () => {
      if (groupAppointment) return groupAppointment?.total;
      return 0;
    };

    const getNonCashFee = () => {
      if (groupAppointment) {
        return groupAppointment?.checkoutPaymentFeeSum;
      } else if (invoiceDetail) {
        return invoiceDetail?.checkoutPaymentFeeSum;
      }
      return 0;
    }

    const getCashDiscount = () => {
      if (groupAppointment) {
        return groupAppointment?.checkoutPaymentCashDiscountSum;
      } else if (invoiceDetail) {
        return invoiceDetail?.checkoutPaymentCashDiscountSum;
      }
      return 0;
    }

    const getDue = () => {
      if (groupAppointment && groupAppointment?.dueAmount > 0)
        return groupAppointment?.dueAmount;
      return 0;
    };

    const getChange = () => {
      if (groupAppointment && groupAppointment?.dueAmount < 0)
        return Math.abs(groupAppointment?.dueAmount);
      return 0;
    };

    const getTaxRate = () => {
      return getTaxRateFromGroupAppointment(groupAppointment);
    };

    const getEmphasisMode = () => {
      return fromAppointmentTab
        ? "TICKET"
        : `${
            invoiceDetail?.status &&
            invoiceDetail?.status !== "paid" &&
            invoiceDetail?.status !== "pending" &&
            invoiceDetail?.status !== "incomplete" &&
            invoiceDetail?.status !== "complete"
              ? `${invoiceDetail?.status}`.toUpperCase()
              : "SALE"
          }`;
    };

    // const getPaymentMethods = () => {
    //   return paymentDetailInfo.paidAmounts &&
    //     paymentDetailInfo.paidAmounts.length > 0
    //     ? paymentDetailInfo.paidAmounts.slice(0).reverse()
    //     : [];
    // };

    const getCheckoutPaymentMethods = () => {
      if (invoiceDetail) {
        return invoiceDetail?.checkoutPayments?.slice(0).reverse() || [];
      }

      return groupAppointment?.paymentMethods?.length > 0
        ? groupAppointment?.paymentMethods
        : groupAppointment?.checkoutPayments;
    };

    const getPromotionNotes = (appointments) => {
      let promotionNotes = [];
      appointments?.forEach((appointment) => {
        const note = appointment?.promotionNotes?.note || "";
        if (note) {
          promotionNotes.push(note);
        }
      });

      return promotionNotes.join(",");
    };

    const getFooterReceipt = () => {
      if (
        (invoiceDetail?.status === "paid" ||
          groupAppointment?.status === "paid") &&
        !isSignature
      ) {
        return "Customer's Receipt";
      }
      return "Merchant's Receipt";
    };

    const renderBarcodeReceipt = React.useCallback(() => {
      if (invoiceDetail?.code)
        return (
          <Barcode
            format="CODE128"
            value={invoiceDetail?.code + ""}
            text={`${invoiceDetail?.code}`}
            style={{ marginBottom: 10 }}
            maxWidth={scaleWidth(300)}
          />
        );
      return <View />;
    }, [invoiceDetail?.invoiceNo]);
    // const renderBarcodeReceipt = React.useCallback(() => {
    //   if (groupAppointment?.mainAppointmentId)
    //     return (
    //       <Barcode
    //         format="CODE128"
    //         value={groupAppointment?.mainAppointmentId + ""}
    //         text={"   "}
    //         style={{ marginBottom: 10 }}
    //         maxWidth={scaleWidth(300)}
    //       />
    //     );
    //   return <View />;
    // }, [groupAppointment?.mainAppointmentId]);

    const getInvoiceName = () => {
      let invoiceName = " ";

      if (groupAppointment) {
        invoiceName = getStaffNameForInvoice(
          profileStaffLogin,
          getBasketOnline(groupAppointment.appointments)
        );
      }

      if (!invoiceName && invoiceDetail?.user?.userId) {
        invoiceName = getFullName(invoiceDetail?.user);
      }
      if (!invoiceName) {
        invoiceName = profileStaffLogin?.displayName;
      }

      return invoiceName;
    };

    const getCustomerName = () => {
      if (groupAppointment && groupAppointment.appointments?.length > 0) {
        const { firstName = " ", lastName = " " } =
          groupAppointment.appointments[0] || {};
        return `${firstName} ${lastName}`;
      }
      return " ";
    };

    const onCancel = (temp) => {
      if (
        cancelInvoicePrint &&
        typeof cancelInvoicePrint === "function" &&
        !isShare
      ) {
        cancelInvoicePrint(temp ?? printTempt);
      }
      setVisible(false);
      reset();
    };

    const renderLoadingProcessingPrint = () => {
      if (isProcessingPrint) {
        return (
          <View
            style={{
              height: scaleSize(490),
              width: scaleSize(290),
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              rightL: 0,
              backgroundColor: "rgba(0,0,0,0.2)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#0764B0" />
          </View>
        );
      }
      return null;
    };

    const doPrintAgain = async () => {
      if (paymentMachineType === "Dejavoo") {
        setTimeout(() => {
          setIsSignature(false);
        }, 2000);
      } else {
        setIsSignature(false);
      }

      // setTimeout(() => {
      //   onPrintProcess();
      // }, 1000);
    };

    React.useEffect(() => {
      if (
        !isSignature &&
        !isShare &&
        !printTempt &&
        profile?.isPrintReceipt &&
        !fromAppointmentTab
      ) {
        onPrintProcess();
      }
    }, [isSignature, isShare, printTempt, profile?.isPrintReceipt]);

    const onPrintProcess = async () => {
      const { portName, emulation, widthPaper } = getInfoFromModelNameOfPrinter(
        printerList,
        printerSelect
      );

      try {
        await setIsProcessingPrint(true);
        const imageUri = await captureRef(viewShotRef, {
          ...(paymentMachineType === "Clover" &&
            !printerSelect && { result: "base64" }),
          format: "jpg",
          quality: 0.0,
        });
        await setIsProcessingPrint(false);

        if (imageUri) {
          if (portName) {
            if (isSalonApp()) {
              let commands = [];
              commands.push({ appendLineFeed: 0 });
              commands.push({
                appendBitmap: imageUri,
                width: parseFloat(widthPaper),
                bothScale: true,
                diffusion: true,
                alignment: "Center",
              });
              commands.push({
                appendCutPaper: StarPRNT.CutPaperAction.PartialCutWithFeed,
              });

              await PrintManager.getInstance().print(
                emulation,
                commands,
                portName
              );
            } else {
              await printAppointment({
                emphasis: getEmphasisMode(),
                isSalon: isSalonApp(),
                name: isSalonApp() ? getCustomerName() : getInvoiceName(),
                invoiceDate: formatWithMoment(
                  invoiceDetail?.createdDate,
                  "MM/DD/YYYY hh:mm A"
                ),
                invoiceNo: `${checkoutId}` ?? " ",
                items: getBasketOnline(groupAppointment?.appointments) || [],
                subTotal: getSubTotal(),
                discount: getDiscount(),
                tipAmount: getTipAmount(),
                taxRate: getTaxRate() > 0 ? "(" + getTaxRate() + "%)" : "",
                tax: getTax(),
                total: getTotal(),
                change: getChange(),
                barCode: invoiceDetail?.code + "",
                printTempt: printTempt,
                isSignature: isSignature,
                fromAppointmentTab: fromAppointmentTab,
                getCheckoutPaymentMethods: getCheckoutPaymentMethods(),
                footerReceipt: getFooterReceipt(),
                promotionNotes: getPromotionNotes(
                  groupAppointment?.appointments
                ),
              });
            }

            releaseCapture(imageUri);
          } else {
            if (paymentMachineType == "Clover") {
              if (doPrintClover && typeof doPrintClover === "function") {
                doPrintClover(imageUri);
              }
            } else if (paymentMachineType == "Dejavoo") {
              const content = getContentXmlReceipt();
              const params = {
                content,
              };
              requestPrintDejavoo(params);
            }
          }

          if (!printTempt && isSignature) {
            if (profile?.isPrintReceipt) {
              doPrintAgain();
            } else {
              Alert.alert(
                "Would you like to print  customer's receipt?",
                "",
                [
                  {
                    text: "Cancel",
                    onPress: onCancel,
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: doPrintAgain,
                  },
                ],
                { cancelable: false }
              );
            }
          } else {
            onCancel();
          }
        }
      } catch (error) {
        console.log(`Printer error with ${error}`);
        alert(`Printer error with ${error}`);
        onCancel();
      }
    };

    const onShareProcess = async () => {
      try {
        await setIsProcessingPrint(true);
        const imageUri = await captureRef(viewShotRef, {
          format: "jpg",
          quality: 0.0,
        });
        await setIsProcessingPrint(false);
        await setVisible(false);

        if (Platform.OS === "ios") {
          setTimeout(() => {
            RNFetchBlob.ios.previewDocument(imageUri);
          }, 500);
        } else {
          await Share.open({
            url: `file://${imageUri}`,
          });
        }
      } catch (error) {
        console.log(error);
        await setVisible(false);
      }
    };

    //---- Functions for Print text Receipt by Dejavoo  ----//

    const getInvoiceItemsXml = () => {
      if (!groupAppointment) return "";

      let stringItems = "";

      let invoiceItems = getBasketOnline(groupAppointment?.appointments)?.map(
        (item, index) => {
          const price = item.data && item.data.price ? item.data.price : 0;
          const quanlitySet = item.quanlitySet ? item.quanlitySet : 1;
          const total = formatMoney(price * quanlitySet);
          const note = item.note ? item.note : "";
          const staffName = item.staff?.displayName ?? "";

          const noteXml = note ? `<t>(Note: ${note})</t>` : ``;
          const staffXml = staffName ? `<t>(${staffName})</t>` : ``;

          stringItems =
            stringItems +
            `<t>${_.padEnd(
              _.truncate(`${index + 1}.${_.get(item, "data.name")}`, {
                length: 15,
              }),
              15,
              "."
            )}${_.padStart(`$${total}`, 9, ".")}</t>
          ${noteXml}
          ${staffXml}`;
        }
      );
      return stringItems;
    };

    const getContentXmlReceipt = () => {
      const invoiceNo = checkoutId ? `Invoice No: ${checkoutId ?? " "}` : ``;
      let entryMethodXml = "";
      if (!printTempt) {
        getCheckoutPaymentMethods()?.map((data, index) => {
          entryMethodXml = entryMethodXml +
            `<br/><t>- Entry method:</t>
            <t>${_.padEnd(`${getPaymentString(
              data?.paymentMethod || ""
            )}`, 15, ".")}${_.padStart(
              `$${Number(formatNumberFromCurrency(data?.amount || "0")).toFixed(2)}`,
              9,
              "."
            )}</t>
              ${(data.paymentMethod &&
              data.paymentMethod === "credit_card") ||
              data.paymentMethod === "debit_card" ?
              `<t>${data?.paymentInformation?.type || ""
              }: ***********${data?.paymentInformation?.number || ""
              }</t>
                              
              ${data?.paymentInformation?.sn
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

              ${data?.paymentInformation?.name ?
                `<t>${data?.paymentInformation?.name?.replace(
                  /%20/g,
                  " "
                ).replace(
                  /%2f/g,
                  " "
                )}</t>` : ""
              }
              `
              : ``
            }`
        })
      }

      let xmlContent = `${getCenterBoldStringArrayXml(
        profile?.businessName || " "
      )}
      ${getCenterStringArrayXml(profile?.addressFull || " ")}
      <t><c>${`Tel : ${profile?.phone || " "}`}</c></t>
      <t><c>${profile?.webLink}</c></t>
      <t><b><c>${`${
        invoiceDetail?.status &&
        invoiceDetail?.status !== "paid" &&
        invoiceDetail?.status !== "pending" &&
        invoiceDetail?.status !== "incomplete" &&
        invoiceDetail?.status !== "complete"
          ? `${invoiceDetail?.status}`.toUpperCase()
          : "SALE"
      }`}</c></b></t>
      <t><c>${`( ${formatWithMoment(
        new Date(),
        "MM/DD/YYYY hh:mm A"
      )} )`}</c></t>
      <t><c>${"-".repeat(24)}</c></t>
      <t>Customer: ${getCustomerName()}</t>
      <t>Invoice Date: ${formatWithMoment(
        invoiceDetail?.createdDate,
        "MM/DD/YYYY hh:mm A"
      )}</t>
      <t>${invoiceNo}</t>
      <t><c>${"-".repeat(24)}</c></t>
      <t><b><c>DESCRIPTION.......TOTAL</c></b></t>
      <t><c>${"-".repeat(24)}</c></t>
      ${getInvoiceItemsXml()}
      <t><c>${"-".repeat(24)}</c></t>
      <t/>
      <t>${_.padEnd("Subtotal: ", 15, ".")}${_.padStart(
        `$${getSubTotal()}`,
        9,
        "."
      )}</t>
      <t>${_.padEnd("Discount: ", 15, ".")}${_.padStart(
        `$${getDiscount()}`,
        9,
        "."
      )}</t>
      <t>${_.padEnd("Tip: ", 15, ".")}${_.padStart(
        `$${getTipAmount()}`,
        9,
        "."
      )}</t>
      <t>${_.padEnd("Tax: ", 15, ".")}${_.padStart(`$${getTax()}`, 9, ".")}</t>
      ${
        getNonCashFee() != 0 &&
        `<t>${_.padEnd("Non-Cash Fee:", 15, ".")}${_.padStart(
          `$${getNonCashFee()}`,
          9,
          "."
        )}</t>`
      }
      ${
        getCashDiscount() != 0 &&
        `<t>${_.padEnd("Cash Discount: ", 15, ".")}${_.padStart(
          `$${getCashDiscount()}`,
          9,
          "."
        )}</t>`

      }
      ${
        !printTempt
          ? `<t><b><c>${_.padEnd("Total: ", 15, ".")}${_.padStart(
              `$${getTotal()}`,
              9,
              "."
            )}</c></b></t>
     ${entryMethodXml}
     ${isSignature ? `<br/><br/><t>Signature: _____________</t><br/>` : ``}
      `
          : ``
      }
      ${
        printTempt
          ? `<t>${_.padEnd("Tip: ", 24, ".")}</t>
                      <t>${_.padEnd("Total:", 24, ".")}</t>
                      <br/>
                      <br/>
                      <t>Signature: _____________</t>
                      <br/>`
          : ``
      }
      ${
        profile?.receiptFooter
          ? `<t>${getCenterStringArrayXml(profile?.receiptFooter)}</t>`
          : `<t><c>Thank you!</c></t>
          <t><c>Please come again</c></t>`
      }
      ${
        !!getPromotionNotes(groupAppointment?.appointments)
          ? `<t>Discount note: ${getPromotionNotes(
              groupAppointment?.appointments
            )}</t>`
          : ``
      }
      <t>${_.pad(getFooterReceipt(), 24, "*")}</t>
      <br/><br/><br/><br/><br/><br/><br/><br/>
      `;
      return xmlContent;
    };

    /**
  |--------------------------------------------------
  | HOOKS
  |--------------------------------------------------
  */

    React.useImperativeHandle(ref, () => ({
      showAppointmentReceipt: async ({
        appointmentId,
        checkoutId,
        isPrintTempt = false,
        isShareMode = false,
        machineType,
        // title = "TICKET",
        isSalon = false,
        isAppointmentTab = false,
      }) => {
        reset();

        if (!appointmentId) {
          return;
        }

        if (!isShareMode) {
          const { portName } = getInfoFromModelNameOfPrinter(
            printerList,
            printerSelect
          );

          if (!portName && machineType == PaymentTerminalType.Pax) {
            onCancel(isPrintTempt);
            alert("Please connect to your printer! ");
            return;
          }
        }

        setPrintTempt(isPrintTempt);
        setIsShare(isShareMode);
        setPaymentMachineType(machineType);
        // setTitleInvoice(isAppointmentTab ? "TICKET" : "");
        // setIsSalonApp(isSalon);
        setFromAppointmentTab(isAppointmentTab);

        // call api get info
        await getGroupAppointment(appointmentId);

        if (checkoutId) {
          setCheckoutId(checkoutId);
          //if group checkout, there are array checkoutid
          let checkoutIdTemp = checkoutId;
          const arrayCheckoutId = `${checkoutId}`?.split("-");
          if (arrayCheckoutId && arrayCheckoutId.length > 0) {
            checkoutIdTemp = arrayCheckoutId[0];
          }
          getInvoiceDetail(checkoutIdTemp);
        }
        await setIsProcessingPrint(true);

        // show modal
        await setVisible(true);
      },
      printRetailerAppointment: async ({
        isPrintTempt = false,
        machineType,
        isAppointmentTab = false,
        invoice,
      }) => {
        if (isSalonApp()) return false;

        reset();

        const { portName } = getInfoFromModelNameOfPrinter(
          printerList,
          printerSelect
        );

        if (!portName && machineType == PaymentTerminalType.Pax) {
          onCancel(isPrintTempt);
          alert("Please connect to your printer! ");
          return;
        }
        await setAutoPrint(true);
        setPrintTempt(isPrintTempt);
        setPaymentMachineType(machineType);
        // setIsSalonApp(isSalon);
        setFromAppointmentTab(isAppointmentTab);
        await setIsProcessingPrint(true);

        if (invoice) {
          // call api get info
          await getGroupAppointment(invoice.appointmentId);
          await setCheckoutId(invoice.checkoutId);
          await setInvoiceDetail(invoice);
        }

        return true;
      },
    }));

    React.useEffect(() => {
      const { codeStatus, data } = groupAppointmentData || {};
      if (statusSuccess(codeStatus)) {
        setGroupAppointment(data);
        setIsProcessingPrint(false);
      }
    }, [groupAppointmentData]);

    React.useEffect(() => {
      const { codeStatus, data } = invoiceDetailData || {};
      if (statusSuccess(codeStatus)) {
        setInvoiceDetail(data);
        setIsProcessingPrint(false);
      }
    }, [invoiceDetailData]);

    React.useEffect(() => {
      if (autoPrint && groupAppointment) {
        setTimeout(() => {
          printAppointment({
            emphasis: getEmphasisMode(),
            isSalon: isSalonApp(),
            name: getInvoiceName(),
            invoiceDate: formatWithMoment(
              invoiceDetail?.createdDate,
              "MM/DD/YYYY hh:mm A"
            ),
            invoiceNo: `${invoiceDetail.checkoutId}` ?? " ",
            items: getBasketOnline(groupAppointment?.appointments) || [],
            subTotal: getSubTotal(),
            discount: getDiscount(),
            tipAmount: getTipAmount(),
            taxRate: getTaxRate() > 0 ? "(" + getTaxRate() + "%)" : "",
            tax: getTax(),
            total: getTotal(),
            change: getChange(),
            barCode: invoiceDetail?.code + "",
            printTempt: false,
            isSignature: false,
            fromAppointmentTab: false,
            getCheckoutPaymentMethods: getCheckoutPaymentMethods(),
            footerReceipt: getFooterReceipt(),
            promotionNotes: getPromotionNotes(groupAppointment?.appointments),
          });
          setAutoPrint(false);
        }, 500);
      }
    }, [groupAppointment]);

    return (
      <Modal visible={visible} onRequestClose={() => {}} transparent={true}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={{ height: tempHeight }}>
              <ScrollView
                style={{ flex: 1 }}
                automaticallyAdjustContentInsets={true}
                keyboardShouldPersistTaps="always"
              >
                <View
                  ref={viewShotRef}
                  style={[
                    {
                      backgroundColor:
                        isShare ||
                        paymentMachineType == PaymentTerminalType.Clover
                          ? "#fff"
                          : "#0000",
                    },
                    styles.receiptContent,
                  ]}
                >
                  {/* ------------- Store Name -----------*/}
                  <Text style={layouts.fontPrintTitleStyle}>
                    {profile?.businessName || " "}
                  </Text>

                  {/* ------------- Store Address ----------- */}
                  <Text
                    numberOfLines={2}
                    style={layouts.fontPrintSubTitleStyle}
                  >
                    {profile?.addressFull || " "}
                  </Text>

                  {/* ------------- Phone Address ----------- */}
                  <Text style={layouts.fontPrintSubTitleStyle}>
                    {`Tel : ${profile?.phone || " "}`}
                  </Text>

                  {/* ------------- Company Website ----------- */}
                  {!!profile?.webLink && (
                    <Text style={layouts.fontPrintSubTitleStyle}>
                      {profile?.webLink}
                    </Text>
                  )}

                  {/* ------------- SALE/VOID/REFUND  ----------- */}
                  <Text style={layouts.fontPrintTitleStyle}>
                    {fromAppointmentTab
                      ? "TICKET"
                      : `${
                          invoiceDetail?.status &&
                          invoiceDetail?.status !== "paid" &&
                          invoiceDetail?.status !== "pending" &&
                          invoiceDetail?.status !== "incomplete" &&
                          invoiceDetail?.status !== "complete"
                            ? `${invoiceDetail?.status}`.toUpperCase()
                            : "SALE"
                        }`}
                  </Text>
                  <Text
                    style={[
                      layouts.fontPrintStyle,
                      { fontSize: scaleFont(18), textAlign: "center" },
                    ]}
                  >
                    {`( ${formatWithMoment(
                      new Date(),
                      "MM/DD/YYYY hh:mm A"
                    )} )`}
                  </Text>
                  {/* ------------- Dot Border  ----------- */}
                  <Dash
                    style={{
                      width: "100%",
                      height: 1,
                      marginVertical: scaleHeight(4),
                      marginHorizontal: scaleWidth(4),
                    }}
                    dashGap={2}
                    dashLength={10}
                    dashThickness={1}
                  />
                  <View style={styles.marginVertical} />

                  {/* ------------- Staff ----------- */}
                  {isSalonApp() ? (
                    <View style={styles.rowContent}>
                      <View
                        style={{
                          width: scaleSize(90),
                          justifyContent: "flex-start",
                        }}
                      >
                        <Text
                          style={[
                            layouts.fontPrintSubTitleStyle,
                            { textAlign: "left" },
                          ]}
                        >{`Customer`}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[layouts.fontPrintStyle]}
                        >{`: ${getCustomerName()}`}</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.rowContent}>
                      <View style={{ width: scaleSize(90) }}>
                        <Text
                          style={[
                            layouts.fontPrintSubTitleStyle,
                            { textAlign: "left" },
                          ]}
                        >{`Staff Name`}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[layouts.fontPrintStyle]}
                        >{`: ${getInvoiceName()}`}</Text>
                      </View>
                    </View>
                  )}

                  {/* ------------- Invoice Date ----------- */}
                  {invoiceDetail && (
                    <View style={styles.rowContent}>
                      <View style={{ width: scaleSize(90) }}>
                        <Text
                          style={[
                            layouts.fontPrintSubTitleStyle,
                            { textAlign: "left" },
                          ]}
                        >{`Invoice Date`}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[layouts.fontPrintStyle]}>
                          {`: ${formatWithMoment(
                            invoiceDetail?.createdDate,
                            "MM/DD/YYYY hh:mm A"
                          )}`}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* ------------- Invoice No ----------- */}
                  {checkoutId && (
                    <View style={styles.rowContent}>
                      <View style={{ width: scaleSize(90) }}>
                        <Text
                          style={[
                            layouts.fontPrintSubTitleStyle,
                            { textAlign: "left" },
                          ]}
                        >{`Invoice No`}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[layouts.fontPrintStyle]}>
                          {`: ${checkoutId ?? " "}`}
                        </Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.marginVertical} />

                  {/* ------------- Dot Border  ----------- */}
                  <Dash
                    style={{
                      height: 1,
                      marginVertical: scaleHeight(4),
                      marginHorizontal: scaleWidth(4),
                    }}
                    dashGap={2}
                    dashLength={10}
                    dashThickness={1}
                  />

                  {/* ------------- Header  ----------- */}
                  <ItemHeaderReceipt
                    type={profile.type}
                    textStyle={layouts.fontPrintSubTitleStyle}
                  />

                  {/* ------------- Dot Border  ----------- */}
                  <Dash
                    style={{
                      width: "100%",
                      height: 1,
                      marginVertical: scaleHeight(4),
                      marginHorizontal: scaleWidth(4),
                    }}
                    dashGap={2}
                    dashLength={10}
                    dashThickness={1}
                  />

                  {/* ------------- Item Invoice   ----------- */}
                  {groupAppointment &&
                    getBasketOnline(groupAppointment?.appointments)?.map(
                      (receiptItem, index) => (
                        <ItemReceipt
                          key={index}
                          item={receiptItem}
                          index={index}
                          type={profile.type}
                          textStyle={[layouts.fontPrintStyle]}
                        />
                      )
                    )}
                  {/* ------------- Line end item invoice   ----------- */}
                  <View
                    style={{
                      height: 2,
                      backgroundColor: "#000",
                      marginVertical: scaleSize(10),
                    }}
                  />
                  {/* ------------- SubTotal   ----------- */}
                  <TotalView
                    title={"Subtotal"}
                    value={getSubTotal()}
                    styleTextTitle={layouts.fontPrintSubTitleStyle}
                    styleTextValue={layouts.fontPrintStyle}
                  />
                  <TotalView
                    title={"Discount"}
                    value={getDiscount()}
                    styleTextTitle={layouts.fontPrintSubTitleStyle}
                    styleTextValue={layouts.fontPrintStyle}
                  />
                  <TotalView
                    title={"Tip"}
                    value={getTipAmount()}
                    styleTextTitle={layouts.fontPrintSubTitleStyle}
                    styleTextValue={layouts.fontPrintStyle}
                  />
                  <TotalView
                    title={`Tax ${
                      getTaxRate() > 0 ? "(" + getTaxRate() + "%)" : ""
                    }`}
                    value={getTax()}
                    styleTextTitle={layouts.fontPrintSubTitleStyle}
                    styleTextValue={layouts.fontPrintStyle}
                  />
                  {!printTempt && (
                    <>
                    {getNonCashFee() != 0 &&
                      <TotalView
                        title={"Non-Cash Adjustment"}
                        value={getNonCashFee()}
                        styleTextTitle={layouts.fontPrintSubTitleStyle}
                        styleTextValue={layouts.fontPrintStyle}
                      />
                    }
                    {getCashDiscount() != 0 &&
                      <TotalView
                        title={"Cash Discount"}
                        value={getCashDiscount()}
                        styleTextTitle={layouts.fontPrintSubTitleStyle}
                        styleTextValue={layouts.fontPrintStyle}
                      />
                    }
                      <TotalView
                        title={"Total"}
                        value={getTotal()}
                        styleTextTitle={[layouts.fontPrintSubTitleStyle, {fontSize: scaleFont(22)}]}
                        styleTextValue={[layouts.fontPrintStyle, {fontSize: scaleFont(24)}]}
                      />
                    </>
                  )}
                  {getChange() > 0 && (
                    <TotalView
                      title={"Change"}
                      value={getChange()}
                      styleTextTitle={layouts.fontPrintSubTitleStyle}
                      styleTextValue={layouts.fontPrintStyle}
                    />
                  )}
                  {/* ------------- Enter Tip   ----------- */}
                  {printTempt && !fromAppointmentTab && (
                    <View
                      style={{
                        height: scaleSize(25),
                        flexDirection: "row",
                        marginBottom: scaleSize(12),
                      }}
                    >
                      <View
                        style={{
                          width: scaleSize(70),
                          justifyContent: "flex-end",
                        }}
                      >
                        <Text
                          style={[
                            layouts.fontPrintStyle,
                            { fontSize: scaleFont(20), fontWeight: "600" },
                          ]}
                        >
                          {"Tip :"}
                        </Text>
                      </View>
                      <View style={{ width: scaleSize(50) }} />
                      <View
                        style={{
                          flex: 1,
                          borderBottomColor: "#000",
                          borderBottomWidth: 1,
                        }}
                      />
                    </View>
                  )}

                  {/* ------------- Enter Total   ----------- */}
                  {printTempt && !fromAppointmentTab && (
                    <View
                      style={{
                        height: scaleSize(25),
                        flexDirection: "row",
                        marginBottom: scaleSize(12),
                      }}
                    >
                      <View
                        style={{
                          width: scaleSize(70),
                          justifyContent: "flex-end",
                        }}
                      >
                        <Text
                          style={[
                            layouts.fontPrintStyle,
                            { fontSize: scaleFont(20), fontWeight: "600" },
                          ]}
                        >
                          {"Total :"}
                        </Text>
                      </View>
                      <View style={{ width: scaleSize(50) }} />
                      <View
                        style={{
                          flex: 1,
                          borderBottomColor: "#000",
                          borderBottomWidth: 1,
                        }}
                      />
                    </View>
                  )}

                  {/* ------------- Entry Method   ----------- */}
                  {!printTempt && (
                    <View>
                      {getCheckoutPaymentMethods()?.map((data, index) => (
                        <View
                          key={index}
                          style={{ marginBottom: scaleSize(4) }}
                        >
                          <View style={{ flexDirection: "row" }}>
                            <Text style={[layouts.fontPrintStyle]}>
                              {`- Entry method: ${getPaymentString(
                                data?.paymentMethod || ""
                              )}`}
                            </Text>
                            <View
                              style={{
                                flex: 1,
                                alignItems: "flex-end",
                                justifyContent: "center",
                              }}
                            >
                              <Text
                                style={[
                                  layouts.fontPrintStyle,
                                  { fontSize: scaleSize(18) },
                                ]}
                              >
                                {`$${Number(
                                  formatNumberFromCurrency(data?.amount || "0")
                                ).toFixed(2)}`}
                              </Text>
                            </View>
                          </View>
                          {(data.paymentMethod &&
                            data.paymentMethod === "credit_card") ||
                          data.paymentMethod === "debit_card" ? (
                            <View style={{ marginTop: scaleSize(5) }}>
                              {/* {
                                data?.fee > 0 &&
                                <TotalView
                                  title={"    Non-Cash Adjustment"}
                                  value={data?.fee}
                                  styleTextTitle={layouts.fontPrintSubTitleStyle}
                                  styleTextValue={layouts.fontPrintStyle}
                                />
                              } */}
                              <Text style={[layouts.fontPrintStyle]}>
                                {`    ${
                                  data?.paymentInformation?.type || ""
                                }: ***********${
                                  data?.paymentInformation?.number || ""
                                }`}
                              </Text>

                              <Text style={[layouts.fontPrintStyle]}>
                                {`    ${
                                  data?.paymentInformation?.sn
                                    ? `Terminal ID: ${data?.paymentInformation?.sn}`
                                    : ""
                                }`}
                              </Text>
                              <Text style={[layouts.fontPrintStyle]}>
                                {`    ${
                                  data?.paymentInformation?.refNum
                                    ? `Transaction #: ${data?.paymentInformation?.refNum}`
                                    : ""
                                }`}
                              </Text>

                              {!stringIsEmptyOrWhiteSpaces(
                                _.get(data, "paymentInformation.signData")
                              ) && (
                                <View style={styles.rowSignature}>
                                  <Text style={[layouts.fontPrintStyle]}>
                                    {"    Signature: "}
                                  </Text>
                                  <Image
                                    style={styles.signImage}
                                    source={{
                                      uri: `data:image/png;base64,${data?.paymentInformation?.signData}`,
                                    }}
                                  />
                                </View>
                              )}
                              <Text style={[layouts.fontPrintStyle]}>
                                {`    ${
                                  data?.paymentInformation?.name
                                    ?.replace(/%20/g, " ")
                                    .replace(/%2f/g, " ") || ""
                                }`}
                              </Text>
                              
                            </View>
                          ) : null
                            // <>
                            //   {
                            //       data?.fee > 0 &&
                            //       <TotalView
                            //         title={"    Non-Cash Adjustment"}
                            //         value={data?.fee}
                            //         styleTextTitle={layouts.fontPrintSubTitleStyle}
                            //         styleTextValue={layouts.fontPrintStyle}
                            //       />
                            //     }
                            //     {
                            //       data?.cashDiscount < 0 &&
                            //       <TotalView
                            //         title={"    Cash Discount"}
                            //         value={data?.cashDiscount}
                            //         styleTextTitle={layouts.fontPrintSubTitleStyle}
                            //         styleTextValue={layouts.fontPrintStyle}
                            //       />
                            //     }
                            // </>
                          }
                        </View>
                      ))}
                    </View>
                  )}

                  {isSignature && !printTempt && (
                    <View
                      style={{
                        height: scaleSize(15),
                        flexDirection: "row",
                        marginTop: scaleSize(15),
                      }}
                    >
                      <View
                        style={{
                          width: scaleSize(70),
                          justifyContent: "flex-end",
                        }}
                      >
                        <Text
                          style={[
                            layouts.fontPrintStyle,
                            { fontSize: scaleFont(18), fontWeight: "600" },
                          ]}
                        >
                          {"Signature:"}
                        </Text>
                      </View>
                      <View style={{ width: scaleSize(50) }} />
                      <View
                        style={{
                          flex: 1,
                          borderBottomColor: "#000",
                          borderBottomWidth: 1,
                        }}
                      />
                    </View>
                  )}

                  {printTempt && !fromAppointmentTab && (
                    <View
                      style={{
                        height: scaleSize(15),
                        flexDirection: "row",
                        marginTop: scaleSize(15),
                      }}
                    >
                      <View
                        style={{
                          width: scaleSize(70),
                          justifyContent: "flex-end",
                        }}
                      >
                        <Text
                          style={[
                            layouts.fontPrintStyle,
                            { fontSize: scaleFont(18), fontWeight: "600" },
                          ]}
                        >
                          {"Signature:"}
                        </Text>
                      </View>
                      <View style={{ width: scaleSize(50) }} />
                      <View
                        style={{
                          flex: 1,
                          borderBottomColor: "#000",
                          borderBottomWidth: 1,
                        }}
                      />
                    </View>
                  )}

                  <View style={styles.marginVertical} />
                  {fromAppointmentTab && (
                    <View style={{ height: scaleHeight(200) }} />
                  )}

                  <View style={styles.marginVertical} />
                  {profile?.receiptFooter ? (
                    <Text
                      style={[
                        layouts.fontPrintSubTitleStyle,
                        { alignSelf: "center", textAlign: "center" },
                      ]}
                    >
                      {` ${profile?.receiptFooter}`}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        layouts.fontPrintSubTitleStyle,
                        { alignSelf: "center", textAlign: "center" },
                      ]}
                    >
                      {`Thank you!\nPlease come again`}
                    </Text>
                  )}

                  {/* ------------- Promotions Note   ----------- */}
                  {!!getPromotionNotes(groupAppointment?.appointments) && (
                    <Text style={layouts.fontPrintStyle}>
                      {`Discount note: `}
                      <Text style={{ fontWeight: "600" }}>
                        {` ${getPromotionNotes(
                          groupAppointment?.appointments
                        )}`}
                      </Text>
                    </Text>
                  )}

                  {/* ------------- This is not a bill   ----------- */}
                  <Text
                    style={[
                      layouts.fontPrintStyle,
                      {
                        alignSelf: "center",
                      },
                    ]}
                  >
                    {`********* ${getFooterReceipt()} *********`}
                  </Text>
                  <View style={styles.marginVertical} />
                  {renderBarcodeReceipt()}
                </View>
              </ScrollView>
            </View>

            {/* ------ Button ----- */}
            <View style={styles.buttonContent}>
              <Button
                backgroundColor="#F1F1F1"
                title={"CANCEL"}
                textColor="#404040"
                onPress={onCancel}
              />
              <View style={{ width: scaleSize(35) }} />
              <Button
                backgroundColor="#0764B0"
                title={isShare ? "SHARE" : "PRINT"}
                textColor="#fff"
                onPress={isShare ? onShareProcess : onPrintProcess}
              />
            </View>

            {/* ------ Loading ----- */}
            {renderLoadingProcessingPrint()}
          </View>
        </View>
      </Modal>
    );
  }
);

const Button = ({ onPress, title, backgroundColor, textColor }) => {
  return (
    <ButtonCustom
      width={"30%"}
      height={30}
      backgroundColor={backgroundColor}
      title={title}
      textColor={textColor}
      onPress={onPress}
      styleText={{
        fontSize: scaleSize(10),
        fontWeight: "500",
      }}
      style={{
        borderRadius: 4,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  content: {
    backgroundColor: "#fff",
    width: scaleSize(290),
  },

  textStyle: {
    color: "#000",
    fontSize: scaleFont(18),
    textAlign: "left",
    fontWeight: "300",
  },

  titleStyle: {
    color: "#000",
    fontSize: scaleFont(24),
    fontWeight: "500",
    marginTop: scaleHeight(8),
    textAlign: "center",
  },

  footerTextStyle: {
    color: "#000",
    fontSize: scaleFont(18),
    fontWeight: "600",
    alignSelf: "center",
  },

  receiptContent: {
    paddingHorizontal: scaleWidth(10),
  },

  rowContent: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
  },

  buttonContent: {
    height: scaleHeight(50),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  marginVertical: { height: scaleHeight(10) },

  rowSignature: {
    flexDirection: "row",
    alignItems: "center",
  },
  signImage: {
    width: scaleWidth(100),
    height: scaleHeight(40),
    resizeMode: "contain",
  },
});
