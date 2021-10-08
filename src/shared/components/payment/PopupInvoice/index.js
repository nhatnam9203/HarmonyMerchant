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
} from "react-native";
import Dash from "react-native-dash";
import { StarPRNT } from "react-native-star-prnt";
import { captureRef, releaseCapture } from "react-native-view-shot";
import { useSelector } from "react-redux";
import RNFetchBlob from "rn-fetch-blob";
import { ItemHeaderReceipt, ItemReceipt } from "./ItemReceipt";
import { TotalView } from "./TotalView";

export const PopupInvoice = React.forwardRef(({ cancelInvoicePrint, doPrintClover }, ref) => {
  const viewShotRef = React.useRef(null);
  const tempHeight = checkIsTablet() ? scaleHeight(400) : scaleHeight(450);

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
  const [titleInvoice, setTitleInvoice] = React.useState("TICKET");

  const [groupAppointment, setGroupAppointment] = React.useState(null);
  const [invoiceDetail, setInvoiceDetail] = React.useState(null);
  const [printTempt, setPrintTempt] = React.useState(false);
  const [isSignature, setIsSignature] = React.useState(false);
  const [isProcessingPrint, setIsProcessingPrint] = React.useState(false);
  const [isShare, setIsShare] = React.useState(false);
  const [paymentMachineType, setPaymentMachineType] = React.useState(null);
  const [isSalonApp, setIsSalonApp] = React.useState(false);

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [groupAppointmentData, getGroupAppointment] = useGetGroupAppointment();
  const [invoiceDetailData, getInvoiceDetail] = useGetInvoiceDetail();

  /**
  |--------------------------------------------------
  | FUNCTION
  |--------------------------------------------------
  */

  const reset = () => {
    setGroupAppointment(null);
    setInvoiceDetail(null);
    setTitleInvoice("TICKET");
    setIsShare(false);
  };

  const getBasketOnline = (appointments) => {
    const arrayProductBuy = [];
    const arryaServicesBuy = [];
    const arrayExtrasBuy = [];
    const arrayGiftCards = [];
    const promotionNotes = [];

    appointments.forEach((appointment) => {
      // ------ Push Service -------
      appointment.services?.forEach((service) => {
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
      appointment.products?.forEach((product) => {
        arrayProductBuy.push({
          type: "Product",
          data: {
            name: product?.productName || "",
            price: product?.price || "",
          },
          quanlitySet: product?.quantity || "",
        });
      });

      // ------ Push Product -------
      appointment.extras?.forEach((extra) => {
        arrayExtrasBuy.push({
          type: "Extra",
          data: {
            name: extra?.extraName || "",
            price: extra?.price || "",
          },
        });
      });

      // ------ Push Gift Card -------
      appointment.giftCards?.forEach((gift) => {
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
    if (groupAppointment) return groupAppointment?.tax;
    return 0;
  };
  const getTotal = () => {
    if (groupAppointment) return groupAppointment?.total;
    return 0;
  };

  const getCheckoutPaymentMethods = () => {
    return [];
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
    if (!printTempt) {
      return isSignature ? isSignature : "Merchant's Receipt";
    }
    return "Customer's Receipt";
  };

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

  const onCancel = () => {
    if (cancelInvoicePrint && typeof cancelInvoicePrint === "function") {
      cancelInvoicePrint(printTempt);
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
    await setIsSignature(false, () => {
      onPrintProcess();
    });
  };

  const onPrintProcess = async () => {
    const { portName } = getInfoFromModelNameOfPrinter(
      printerList,
      printerSelect
    );

    try {
      await setIsProcessingPrint(true);
      const imageUri = await captureRef(viewShotRef, {
        ...(paymentMachineType === "Clover" &&
          !printerSelect && { result: "base64" }),
      });
      await setIsProcessingPrint(false);

      if (imageUri) {
       
          if (printerSelect) {
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
    
            await PrintManager.getInstance().print(emulation, commands, portName);
    
            releaseCapture(imageUri);
            if (!printTempt && isSignature) {
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
            } else {
              onCancel();
            }
          }
        }else{
          if (paymentMachineType == "Clover") {
            if (doPrintClover && typeof doPrintClover === "function") {
              doPrintClover();
            }
          }else{
            alert("Please connect to your printer!");
          }
        }
       
      
    } catch (error) {
      console.log(`Printer erro with ${error}`);
      onCancel();
    }
  };

  const onShareProcess = async () => {
    try {
      await setIsProcessingPrint(true);
      const imageUri = await captureRef(viewShotRef, {});
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
    showAppointmentReceipt: ({
      appointmentId,
      checkoutId,
      isPrintTempt = false,
      isShareMode = false,
      machineType,
      title = "TICKET",
      isSalon = false,
    }) => {
      if (!appointmentId) {
        return;
      }

      reset();

      if (!isShareMode) {
        const { portName } = getInfoFromModelNameOfPrinter(
          printerList,
          printerSelect
        );

        if (!portName) {
          alert("Please connect to your printer! ");
          return;
        }
      }

      setIsShare(isShareMode);
      setPrintTempt(isPrintTempt);
      setPaymentMachineType(machineType);
      setTitleInvoice(title);
      setIsSalonApp(isSalon);
      getGroupAppointment(appointmentId);
      if (checkoutId) {
        getInvoiceDetail(checkoutId);
      }

      // show modal
      setVisible(true);
    },
  }));

  React.useEffect(() => {
    const { codeStatus, data } = groupAppointmentData || {};
    if (statusSuccess(codeStatus)) {
      setGroupAppointment(data);
    }
  }, [groupAppointmentData]);

  React.useEffect(() => {
    const { codeStatus, data } = invoiceDetailData || {};
    if (statusSuccess(codeStatus)) {
      setInvoiceDetail(data);
    }
  }, [invoiceDetailData]);

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
                  { backgroundColor: isShare ? "#fff" : "#0000" },
                  styles.receiptContent,
                ]}
              >
                {/* ------------- Store Name -----------*/}
                <Text style={styles.titleStyle}>
                  {profile?.businessName || " "}
                </Text>

                {/* ------------- Store Address ----------- */}
                <Text
                  numberOfLines={2}
                  style={[styles.textStyle, { textAlign: "center" }]}
                >
                  {profile?.addressFull || " "}
                </Text>

                {/* ------------- Phone Address ----------- */}
                <Text style={[styles.textStyle, { textAlign: "center" }]}>
                  {`Tel : ${profile?.phone || " "}`}
                </Text>

                {/* ------------- Company Website ----------- */}
                {!!profile?.webLink && (
                  <Text style={[styles.textStyle, { textAlign: "center" }]}>
                    {profile?.webLink}
                  </Text>
                )}

                {/* ------------- SALE/VOID/REFUND  ----------- */}
                <Text style={styles.titleStyle}>{titleInvoice}</Text>
                <Text
                  style={[
                    styles.textStyle,
                    { textAlign: "center", fontSize: scaleFont(15) },
                  ]}
                >
                  {`( ${formatWithMoment(new Date(), "MM/DD/YYYY hh:mm A")} )`}
                </Text>
                {/* ------------- Dot Border  ----------- */}
                <Dash
                  style={{ width: "100%", height: 1 }}
                  dashGap={5}
                  dashLength={8}
                  dashThickness={1}
                  style={{
                    marginVertical: scaleHeight(10),
                    marginHorizontal: scaleWidth(4),
                  }}
                />

                {/* ------------- Receipt Date ----------- */}
                {/* <View style={styles.rowContent}>
                  <View style={{ width: scaleSize(90) }}>
                    <Text style={[styles.textStyle]}>{`Created Date`}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.textStyle]}>
                      {`: ${formatWithMoment(
                        new Date(),
                        "MM/DD/YYYY hh:mm A"
                      )}`}
                    </Text>
                  </View>
                </View> */}

                {/* ------------- Staff ----------- */}
                {isSalonApp ? (
                  <View style={styles.rowContent}>
                    <View style={{ width: scaleSize(90) }}>
                      <Text style={[styles.textStyle]}>{`Customer`}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.textStyle]}
                      >{`: ${getCustomerName()}`}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.rowContent}>
                    <View style={{ width: scaleSize(90) }}>
                      <Text style={[styles.textStyle]}>{`Staff Name`}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.textStyle]}
                      >{`: ${getInvoiceName()}`}</Text>
                    </View>
                  </View>
                )}

                {/* ------------- Invoice Date ----------- */}
                {invoiceDetail && (
                  <View style={styles.rowContent}>
                    <View style={{ width: scaleSize(90) }}>
                      <Text style={[styles.textStyle]}>{`Invoice Date`}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.textStyle]}>
                        {`: ${formatWithMoment(
                          invoiceDetail?.createdDate,
                          "MM/DD/YYYY hh:mm A"
                        )}`}
                      </Text>
                    </View>
                  </View>
                )}

                {/* ------------- Invoice No ----------- */}
                {invoiceDetail && (
                  <View style={styles.rowContent}>
                    <View style={{ width: scaleSize(90) }}>
                      <Text style={[styles.textStyle]}>{`Invoice No`}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.textStyle]}>
                        {`: ${invoiceDetail?.invoiceNo ?? " "}`}
                      </Text>
                    </View>
                  </View>
                )}
                {/* ------------- Dot Border  ----------- */}
                <Dash
                  style={{ height: 1 }}
                  dashGap={5}
                  dashLength={8}
                  dashThickness={1}
                  style={{
                    marginVertical: scaleHeight(10),
                    marginHorizontal: scaleWidth(4),
                  }}
                />

                {/* ------------- Header  ----------- */}
                <ItemHeaderReceipt isSalonApp={isSalonApp} />

                {/* ------------- Dot Border  ----------- */}
                <Dash
                  style={{ width: "100%", height: 1 }}
                  dashGap={5}
                  dashLength={8}
                  dashThickness={1}
                  style={{
                    marginVertical: scaleHeight(10),
                    marginHorizontal: scaleWidth(4),
                  }}
                />

                {/* ------------- Item Invoice   ----------- */}
                {groupAppointment &&
                  getBasketOnline(groupAppointment?.appointments)?.map(
                    (receiptItem, index) => (
                      <ItemReceipt
                        key={index}
                        item={receiptItem}
                        index={index}
                        isSalonApp={isSalonApp}
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
                  styleTextTitle={styles.textStyle}
                  styleTextValue={styles.textStyle}
                />
                <TotalView
                  title={"Discount"}
                  value={getDiscount()}
                  styleTextTitle={styles.textStyle}
                  styleTextValue={styles.textStyle}
                />
                <TotalView
                  title={"Tip"}
                  value={getTipAmount()}
                  styleTextTitle={styles.textStyle}
                  styleTextValue={styles.textStyle}
                />
                <TotalView
                  title={"Tax"}
                  value={getTax()}
                  styleTextTitle={styles.textStyle}
                  styleTextValue={styles.textStyle}
                />
                {!printTempt && (
                  <TotalView
                    title={"Total"}
                    value={getTotal()}
                    styleTextTitle={styles.textStyle}
                    styleTextValue={styles.textStyle}
                  />
                )}
                {/* ------------- Enter Tip   ----------- */}
                {printTempt && (
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
                          styles.textStyle,
                          { fontSize: 20, fontWeight: "600" },
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
                {printTempt && (
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
                          styles.textStyle,
                          { fontSize: 20, fontWeight: "600" },
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
                    {getCheckoutPaymentMethods().map((data, index) => (
                      <View key={index} style={{ marginBottom: scaleSize(4) }}>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={[styles.textStyle]}>
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
                                styles.textStyle,
                                { fontSize: scaleSize(13) },
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
                            <Text
                              style={[
                                styles.textStyle,
                                { fontSize: scaleSize(13) },
                              ]}
                            >
                              {`    ${
                                data?.paymentInformation?.type || ""
                              }: ***********${
                                data?.paymentInformation?.number || ""
                              }`}
                            </Text>
                            <Text
                              style={[
                                styles.textStyle,
                                { fontSize: scaleSize(13) },
                              ]}
                            >
                              {`    ${data?.paymentInformation?.name || ""}`}
                            </Text>
                            <Text
                              style={[
                                styles.textStyle,
                                { fontSize: scaleSize(13) },
                              ]}
                            >
                              {`    ${
                                data?.paymentInformation?.sn
                                  ? `Terminal ID: ${data?.paymentInformation?.sn}`
                                  : ""
                              }`}
                            </Text>
                            <Text
                              style={[
                                styles.textStyle,
                                { fontSize: scaleSize(13) },
                              ]}
                            >
                              {`    ${
                                data?.paymentInformation?.refNum
                                  ? `Transaction #: ${data?.paymentInformation?.refNum}`
                                  : ""
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
                          styles.textStyle,
                          { fontSize: 18, fontWeight: "600" },
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

                {printTempt && (
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
                          styles.textStyle,
                          { fontSize: 18, fontWeight: "600" },
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
                <View style={styles.marginVertical} />
                {profile?.receiptFooter ? (
                  <Text
                    style={[
                      styles.textStyle,
                      { alignSelf: "center", textAlign: "center" },
                    ]}
                  >
                    {` ${profile?.receiptFooter}`}
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.textStyle,
                      { alignSelf: "center", textAlign: "center" },
                    ]}
                  >
                    {`Thank you!\nPlease come again`}
                  </Text>
                )}

                {/* ------------- Promotions Note   ----------- */}
                {!!getPromotionNotes(groupAppointment?.appointments) && (
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      marginTop: scaleSize(10),
                    }}
                  >
                    {`Discount note: `}
                    <Text style={{ fontWeight: "600" }}>
                      {` ${getPromotionNotes(groupAppointment?.appointments)}`}
                    </Text>
                  </Text>
                )}

                {/* ------------- This is not a bill   ----------- */}
                <Text style={styles.footerTextStyle}>
                  {`********** ${getFooterReceipt()} **********`}
                </Text>
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
});

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
});
