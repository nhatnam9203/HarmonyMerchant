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
import {
  ItemHeaderReceipt,
  ItemReceipt,
} from "../payment/PopupInvoice/ItemReceipt";
import { TotalView } from "../payment/PopupInvoice/TotalView";

export const PopupReturnReceipt = React.forwardRef(({}, ref) => {
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
  const [titleInvoice, setTitleInvoice] = React.useState("Return");
  const [isProcessingPrint, setIsProcessingPrint] = React.useState(false);
  const [isShare, setIsShare] = React.useState(false);
  const [itemReceipt, setItemReceipt] = React.useState(null);
  const [printTempt, setPrintTempt] = React.useState(false);

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */

  /**
  |--------------------------------------------------
  | FUNCTION
  |--------------------------------------------------
  */

  const reset = async () => {
    setIsShare(false);
  };

  const getSubTotal = () => {
    return 0;
  };
  const getDiscount = () => {
    return 0;
  };
  const getTipAmount = () => {
    return itemReceipt?.tipAmount || 0;
  };
  const getShippingAmount = () => {
    return itemReceipt?.shippingAmount || 0;
  };
  const getTax = () => {
    return 0;
  };
  const getTotal = () => {
    return 0;
  };

  const getFooterReceipt = () => {
    return "Merchant's Receipt";
  };

  const getStaffName = () => {
    return itemReceipt?.createdBy ?? " ";
  };

  const getItems = () => {
    const { products = [], giftCards = [] } = itemReceipt?.returnData || {};
    return [...products, ...giftCards];
  };

  const onCancel = (temp) => {
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

  const onPrintProcess = async () => {
    const { portName, emulation, widthPaper } = getInfoFromModelNameOfPrinter(
      printerList,
      printerSelect
    );

    try {
      await setIsProcessingPrint(true);
      const imageUri = await captureRef(viewShotRef, {});
      // const imageUri = await captureRef(viewShotRef, {
      //   ...(paymentMachineType === "Clover" &&
      //     !printerSelect && { result: "base64" }),
      // });
      await setIsProcessingPrint(false);

      if (imageUri) {
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
      }
    } catch (error) {
      console.log(`Printer error with ${error}`);
      alert(`Printer error with ${error}`);
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
    showReceipt: async ({ isShareMode = false, item }) => {
      reset();

      if (!item) {
        return;
      }

      if (!isShareMode) {
        const { portName } = getInfoFromModelNameOfPrinter(
          printerList,
          printerSelect
        );

        if (!portName) {
          onCancel(isPrintTempt);

          alert("Please connect to your printer! ");
          return;
        }
      }

      setIsShare(isShareMode);
      setItemReceipt(item);

      //   await setIsProcessingPrint(true);

      // show modal
      await setVisible(true);
    },
  }));

  //   React.useEffect(() => {
  //     const { codeStatus, data } = groupAppointmentData || {};
  //     if (statusSuccess(codeStatus)) {
  //       setGroupAppointment(data);
  //       setIsProcessingPrint(false);
  //     }
  //   }, [groupAppointmentData]);

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

                {/* ------------- Staff ----------- */}
                <View style={styles.rowContent}>
                  <View style={{ width: scaleSize(90) }}>
                    <Text style={[styles.textStyle]}>{`Staff Name`}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[styles.textStyle]}
                    >{`: ${getStaffName()}`}</Text>
                  </View>
                </View>

                {/* ------------- Return Create Date ----------- */}
                <View style={styles.rowContent}>
                  <View style={{ width: scaleSize(90) }}>
                    <Text style={[styles.textStyle]}>{`Return Date`}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.textStyle]}>
                      {`: ${formatWithMoment(
                        itemReceipt?.createdDate,
                        "MM/DD/YYYY hh:mm A"
                      )}`}
                    </Text>
                  </View>
                </View>

                {/* ------------- Invoice No ----------- */}
                <View style={styles.rowContent}>
                  <View style={{ width: scaleSize(90) }}>
                    <Text style={[styles.textStyle]}>{`Return No`}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.textStyle]}>
                      {`: #${itemReceipt?.code ?? " "}`}
                    </Text>
                  </View>
                </View>
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
                <ItemHeaderReceipt type="ReturnReceipt" />

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
                {getItems()?.map((receiptItem, index) => (
                  <ItemReceipt
                    key={index}
                    item={receiptItem}
                    index={index}
                    type="ReturnReceipt"
                  />
                ))}
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
                  title={"Tip"}
                  value={getTipAmount()}
                  styleTextTitle={styles.textStyle}
                  styleTextValue={styles.textStyle}
                />
                <TotalView
                  title={"Shipping"}
                  value={getShippingAmount()}
                  styleTextTitle={styles.textStyle}
                  styleTextValue={styles.textStyle}
                />
                {/* <TotalView
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
                )} */}
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