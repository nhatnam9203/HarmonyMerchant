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
        setTimeout(() => {
          setIsSignature(false);
        }, 1000);
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
          // format: "jpg",
          // quality: 0.8,
        });
        await setIsProcessingPrint(false);

        if (imageUri) {
          if (portName) {


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
              appendCutPaper: StarPRNT.CutPaperAction.FullCutWithFeed,
            });

            await PrintManager.getInstance().print(
              emulation,
              commands,
              portName
            );

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
          quality: 0.8,
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
        setAutoPrint(false);
        setPrintTempt(isPrintTempt);
        setIsShare(isShareMode);
        setPaymentMachineType(machineType);
        // setTitleInvoice(isAppointmentTab ? "TICKET" : "");
        // setIsSalonApp(isSalon);
        setFromAppointmentTab(isAppointmentTab);
        if (isAppointmentTab) {
          setIsSignature(false);
        }

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
      isSalonApp: () => isSalonApp(),
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
                        />
                      )
                    )}

                  {isRetailApp() && (
                    <View>
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
                      <View style={{ flexDirection: "row" }}>
                        <Text style={[layouts.fontPrintStyle, { flex: 1 }]}>
                          {"Total QTY"}
                        </Text>
                        <View
                          style={{
                            width: scaleWidth(90),
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                          }}
                        />
                        <Text
                          style={[
                            layouts.fontPrintStyle,
                            {
                              width: scaleWidth(40),
                            },
                          ]}
                        >
                          {getTotalQty()}
                        </Text>
                        <View
                          style={{
                            width: scaleWidth(90),
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                          }}
                        />
                      </View>
                    </View>
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
                      {getNonCashFee() != 0 && (
                        <TotalView
                          title={"Non-Cash Adjustment"}
                          value={getNonCashFee()}
                          styleTextTitle={layouts.fontPrintSubTitleStyle}
                          styleTextValue={layouts.fontPrintStyle}
                        />
                      )}
                      {getCashDiscount() != 0 && (
                        <TotalView
                          title={"Cash Discount"}
                          value={getCashDiscount()}
                          styleTextTitle={layouts.fontPrintSubTitleStyle}
                          styleTextValue={layouts.fontPrintStyle}
                        />
                      )}
                      <TotalView
                        title={"Total"}
                        value={getTotal()}
                        styleTextTitle={[
                          layouts.fontPrintSubTitleStyle,
                          { fontSize: scaleFont(22) },
                        ]}
                        styleTextValue={[
                          layouts.fontPrintStyle,
                          { fontSize: scaleFont(24) },
                        ]}
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
                          ) : null}
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
