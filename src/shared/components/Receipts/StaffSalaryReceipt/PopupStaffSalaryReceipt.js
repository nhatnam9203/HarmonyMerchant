import PrintManager from "@lib/PrintManager";
import { ButtonGradient, ButtonGradientWhite } from "@shared/components";
import { layouts } from "@shared/themes";
import {
  formatWithMoment,
  getInfoFromModelNameOfPrinter,
  localize,
  PaymentTerminalType,
  scaleSize,
} from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import { StarPRNT } from "react-native-star-prnt";
import { captureRef } from "react-native-view-shot";
import { useSelector } from "react-redux";

const DEFAULT_WIDTH = scaleWidth(400);

export const PopupStaffSalaryReceipt = React.forwardRef(
  ({ staffs = [] }, ref) => {
    const { t } = useTranslation();
    const receiptRefs = React.useRef([]);

    const { paymentMachineType } = useSelector((state) => state.hardware) ?? {};
    const { profile, printerList, printerSelect } =
      useSelector((state) => state.dataLocal) ?? {};
    const { portName, emulation, widthPaper } = getInfoFromModelNameOfPrinter(
      printerList,
      printerSelect
    );

    const [open, setOpen] = React.useState(false);
    const [printProcessing, setPrintProcessing] = React.useState(false);

    React.useEffect(() => {
      receiptRefs.current = receiptRefs.current.slice(0, staffs.length);
    }, [staffs]);

    React.useImperativeHandle(ref, () => ({
      show: () => {
        if (!open) setOpen(true);
      },
    }));

    const onModalHide = () => {
      // setOpen(false);
      console.log("Hide call");
      receiptRefs.current = [];
      setPrintProcessing(false);
    };

    const onModalWillHide = () => {};

    const addReceiptRef = (viewRef, index) => {
      receiptRefs.current[index] = viewRef;
    };

    const staffSalaryReceiptItem = ({ item, index }) => {
      const onAddReceiptItemRef = (viewRef) => {
        addReceiptRef(viewRef, index);
      };

      return (
        <ReceiptContentView
          ref={onAddReceiptItemRef}
          index={index + 1}
          key={`${item.name}`}
          staff={item}
          widthPaper={widthPaper}
        />
      );
    };

    const onCancel = () => {
      if (open) setOpen(false);
    };

    const onHandlePrint = async () => {
      if (staffs?.length <= 0) {
        setOpen(false);
        return;
      }

      if (!portName && paymentMachineType === PaymentTerminalType.Pax) {
        alert("Please connect to your printer! ");
        return;
      }

      try {
        setPrintProcessing(true);
        let commands = [];
        commands.push({ appendLineFeed: 0 });
        alert(receiptRefs.current?.length);
        for (var i = 0; i < receiptRefs.current?.length; i++) {
          const viewRef = receiptRefs.current[i];
          const imageUrl = await captureRef(viewRef, {});

          commands.push({
            appendBitmap: imageUrl,
            width: parseFloat(widthPaper),
            bothScale: true,
            diffusion: true,
            alignment: "Center",
          });

          commands.push({
            appendCutPaper: StarPRNT.CutPaperAction.FullCutWithFeed,
          });
        }

        await PrintManager.getInstance().print(emulation, commands, portName);
        setPrintProcessing(false);
        setOpen(false);
      } catch (error) {
        alert(`Printer error with ${error}`);
      }
    };

    return (
      <Modal
        transparent={true}
        style={styles.modal}
        testID={"popupReceipt"}
        isVisible={open}
        hasBackdrop={true}
        backdropOpacity={0.6}
        onModalHide={onModalHide}
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInTiming={1}
        animationOutTiming={1}
        onModalWillHide={onModalWillHide}
      >
        <View style={[layouts.fill, { paddingHorizontal: scaleWidth(16) }]}>
          <FlatList
            horizontal
            data={staffs}
            renderItem={staffSalaryReceiptItem}
            keyExtractor={(item, index) => `${item.name}`}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View style={layouts.marginHorizontal} />
            )}
            showsHorizontalScrollIndicator
          />
        </View>

        <View style={styles.bottomStyle}>
          <ButtonGradientWhite
            disable={printProcessing}
            label={t("NO")}
            width={scaleWidth(150)}
            height={scaleHeight(42)}
            borderRadius={scaleWidth(3)}
            onPress={onCancel}
          />
          <View style={{ width: scaleWidth(50) }} />
          <ButtonGradient
            disable={printProcessing}
            loading={printProcessing}
            label={t("Print")}
            width={scaleWidth(150)}
            height={scaleHeight(42)}
            borderRadius={scaleWidth(3)}
            onPress={onHandlePrint}
          />
        </View>
      </Modal>
    );
  }
);

const ReceiptContentView = React.forwardRef(
  ({ style, staff, widthPaper }, ref) => {
    const language = useSelector((state) => state.dataLocal.language);

    const { receipts = {} } = staff;
    const receiptType = receipts.receiptType ? receipts.receiptType : "";
    const staffName = staff.name ? staff.name : "";
    const fromTime = receipts.from
      ? formatWithMoment(receipts.from, "MM/DD/YYYY")
      : "";
    const toTime = receipts.to
      ? formatWithMoment(receipts.to, "MM/DD/YYYY")
      : "";
    const sales = receipts?.serviceSales || "0.00";
    const workingHour = receipts?.workingHour || "0";
    const product = receipts?.productSales || "0.00";
    const cash = receipts?.cash || "0.00";
    const nonCash = receipts?.nonCash || "0.00";
    const detail = receipts?.detail || [];
    const netServiceSales = receipts?.netServiceSales || "0.00";

    let totalDesc = "";

    return (
      <View style={layouts.center}>
        <View
          style={[
            style,
            {
              width: scaleSize(290),
              height: scaleSize(480),
              backgroundColor: "white",
            },
          ]}
        >
          <ScrollView
            style={{ flex: 1 }}
            automaticallyAdjustContentInsets={true}
            keyboardShouldPersistTaps="always"
          >
            <View style={{ height: scaleSize(10) }} />
            <View ref={ref} style={{ paddingHorizontal: 20 }}>
              {/* -------------- Type Invoice + Staff Name -------------- */}
              <Text
                style={[
                  styles.txt_normal,
                  { fontSize: scaleSize(14), fontWeight: "600" },
                ]}
              >
                {`${receiptType} receipts 111 - ${staffName}`}
              </Text>
              {/* -------------- Date -------------- */}
              <Text
                style={[styles.txt_normal, { fontWeight: "600", marginTop: 5 }]}
              >
                {`${fromTime} - ${toTime}`}
              </Text>
              {/* ------------- Dot Border  ----------- */}
              <ItemBorderBottom />
              {/* ------------- Part 1  ----------- */}
              <ItemStaffInvoice title="Service Sales" value={`$ ${sales}`} />
              <ItemStaffInvoice
                title="Net Service Sale"
                value={`$ ${netServiceSales}`}
              />
              <ItemStaffInvoice
                title="Total Time Work"
                value={`${workingHour} hrs`}
              />
              <ItemStaffInvoice title="Product Sales" value={`$ ${product}`} />
              <ItemStaffInvoice title="Cash" value={`$ ${cash}`} />
              <ItemStaffInvoice title="Non-Cash" value={`$ ${nonCash}`} />
              {/* ------------- Dot Border  ----------- */}
              <ItemBorderBottom />

              {detail
                .filter((x) => x.isUsed || x.receiptType === "Total")
                .map((x, index) => {
                  switch (x.receiptType) {
                    case "Tippayout":
                      totalDesc =
                        totalDesc +
                        (totalDesc.length > 0 ? "+" + (index + 1) : index + 1);
                      return (
                        <React.Fragment key={x.receiptType}>
                          <ItemStaffInvoice
                            title={`${index + 1}. ${localize(
                              x.receiptType,
                              language
                            )}`}
                            value={`$ ${x.total}`}
                            style={{ marginTop: scaleSize(15) }}
                          />

                          <ItemStaffInvoice
                            title="Tip Total"
                            value={`$ ${x.subTotal}`}
                            styleTilte={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                            styleValue={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                          />
                          <ItemStaffInvoice
                            title={`Tip Fee (${
                              x.fee && x.fee.value ? x.fee.value : "0.00%"
                            })`}
                            value={`$ ${
                              x.fee && x.fee.amount ? x.fee.amount : "0.00"
                            }`}
                            styleTilte={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                            styleValue={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                          />
                          <ItemStaffInvoice
                            title="Check"
                            value={`$ ${x.check}`}
                            styleTilte={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                            styleValue={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                          />
                        </React.Fragment>
                      );
                    case "Total":
                      return (
                        <React.Fragment key={x.receiptType}>
                          {/* ------------- Line   ----------- */}
                          <View
                            style={{
                              height: 2,
                              backgroundColor: "#000",
                              marginVertical: scaleSize(10),
                            }}
                          />

                          {/* ------------- Total payout  ----------- */}
                          <ItemStaffInvoice
                            title="Total Payout"
                            value={`$ ${x.total}`}
                            subTitle={" (" + totalDesc + ")"}
                            styleTilte={{
                              fontSize: scaleSize(14),
                              fontWeight: "600",
                            }}
                            styleValue={{
                              fontSize: scaleSize(14),
                              fontWeight: "600",
                            }}
                          />
                          <ItemStaffInvoice
                            title="Cash"
                            value={`$ ${x.cash}`}
                            styleTilte={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                            styleValue={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                          />
                          <ItemStaffInvoice
                            title="Check"
                            value={`$ ${x.check}`}
                            styleTilte={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                            styleValue={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                          />
                        </React.Fragment>
                      );
                    case "WorkingHour":
                      totalDesc =
                        totalDesc +
                        (totalDesc.length > 0 ? "+" + (index + 1) : index + 1);
                      return (
                        <React.Fragment key={x.receiptType}>
                          <ItemStaffInvoice
                            title={`${index + 1}. ${localize(
                              x.receiptType,
                              language
                            )} ($ ${x.commission})`}
                            value={`$ ${x.total}`}
                          />
                          <ItemStaffInvoice
                            title="Cash"
                            value={`$ ${x.cash}`}
                            styleTilte={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                            styleValue={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                          />
                          <ItemStaffInvoice
                            title="Check"
                            value={`$ ${x.check}`}
                            styleTilte={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                            styleValue={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                          />
                        </React.Fragment>
                      );
                    case "DiscountByStaff":
                      totalDesc =
                        totalDesc +
                        (totalDesc.length > 0 ? "+" + (index + 1) : index + 1);
                      return (
                        <React.Fragment key={x.receiptType}>
                          <ItemStaffInvoice
                            title={`${index + 1}. ${localize(
                              x.receiptType,
                              language
                            )}`}
                            value={`$ ${x.total}`}
                          />
                          <ItemStaffInvoice
                            title="Cash"
                            value={`$ ${x.cash}`}
                            styleTilte={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                            styleValue={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                          />
                          <ItemStaffInvoice
                            title="Check"
                            value={`$ ${x.check}`}
                            styleTilte={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                            styleValue={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                          />
                        </React.Fragment>
                      );
                    default:
                      totalDesc =
                        totalDesc +
                        (totalDesc.length > 0 ? "+" + (index + 1) : index + 1);
                      return (
                        <React.Fragment key={x.receiptType}>
                          <ItemStaffInvoice
                            title={`${index + 1}. ${localize(
                              x.receiptType,
                              language
                            )} (${x.commission}%)`}
                            value={`$ ${x.total}`}
                          />
                          <ItemStaffInvoice
                            title="Cash"
                            value={`$ ${x.cash}`}
                            styleTilte={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                            styleValue={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                          />
                          <ItemStaffInvoice
                            title="Check"
                            value={`$ ${x.check}`}
                            styleTilte={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                            styleValue={{
                              fontSize: scaleSize(13),
                              fontWeight: "200",
                            }}
                          />
                        </React.Fragment>
                      );
                  }
                })}
            </View>
            <View style={{ height: scaleSize(100) }} />
          </ScrollView>
        </View>
      </View>
    );
  }
);

const ItemStaffInvoice = ({
  title,
  value,
  style,
  styleTilte,
  styleValue,
  subTitle,
}) => {
  return (
    <View style={[{ flexDirection: "row", marginTop: 7 }, style]}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={[styles.txt_info, styleTilte]}>
          {title}
          <Text style={{ fontWeight: "200" }}>{subTitle}</Text>
        </Text>
      </View>

      <View
        style={{ flex: 0.6, justifyContent: "center", alignItems: "flex-end" }}
      >
        <Text style={[styles.txt_info, styleValue]}>{value}</Text>
      </View>
    </View>
  );
};

const ItemBorderBottom = () => {
  return (
    <View style={{ height: 30 }}>
      <Text style={{ fontWeight: "200", fontSize: 22 }}>
        {`- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "transparent",
    margin: 0,
  },

  txt_normal: {
    color: "#000",
    fontSize: scaleSize(13),
    alignSelf: "center",
    fontWeight: "200",
  },
  txt_info: {
    color: "#000",
    fontSize: scaleSize(12),
    fontWeight: "400",
  },
  txt_total: {
    color: "#000",
    fontSize: scaleSize(16),
    fontWeight: "200",
  },

  bottomStyle: {
    width: "100%",
    height: scaleHeight(60),
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "row",
  },
});
