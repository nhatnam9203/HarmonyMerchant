import {
  PopupActiveGiftCard,
  PopupChangeMoney,
  PopupChangeTip,
  PopupConfirm,
  PopupPayCompleted,
  PopupProcessingCredit,
  PopupScanCode,
  PopupSendLinkInstall,
} from "@components";
import IMAGE from "@resources";
import {
  ButtonGradient,
  ButtonGradientWhite,
  CustomCheckBox,
  PopupReceipt,
} from "@shared/components";
import {
  ErrorMessagePaxModal,
  PopupBill,
  PopupBlockDiscount,
  PopupDiscount,
  PopupDiscountItem,
  PopupDiscountLocal,
  PopupEnterAmountGiftCard,
  PopupGiftCardDetail,
  PopupPaymentDetails,
} from "@shared/components/payment";
import { WithDialogConfirm } from "@shared/HOC/withDialogConfirm";
import { WithDialogPhone } from "@shared/HOC/withDialogPhone";
import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  BasketPaymentContent,
  ButtonPaymentMethod,
  CheckOutCustomerInfo,
  DialogProductDetail,
} from "../../widget";

const ExitCheckoutConfirmButton = WithDialogConfirm(ButtonGradientWhite);
const ButtonPhone = WithDialogPhone(ButtonGradientWhite);

export const Layout = ({
  productDetailRef,
  basketRef,
  customerRef,
  selectedPayment,
  paymentSelected,
  orderItem,
  modalBillRef,
  language,
  visibleBillOfPayment,
  onRequestCloseBillModal,
  extractBill,
  doneBill,
  popupSendLinkInstallRef,
  cancelHarmonyPayment,
  payBasket,
  visibleProcessingCredit,
  cancelTransaction,
  changeButtonDone,
  isDonePayment,
  isCancelHarmonyPay,
  groupAppointment,
  visibleSendLinkPopup,
  setVisibleSendLinkPopup,
  sendLinkInstallApp,
  donotPrintBill,
  printBill,
  popupEnterAmountGiftCardRef,
  navigation,
  popupDiscountRef,
  popupDiscountItemRef,
  popupDiscountLocalRef,
  visiblePopupDiscountLocal,
  onRequestClosePopupDiscountLocal,
  callbackDiscountToParent,
  onDiscountAdd,
  popupConfirmOnRequestClose,
  titleExitCheckoutTab,
  visibleConfirm,
  setVisibleConfirm,
  activeGiftCardPayRef,
  submitPayGiftCard,
  closePopupActiveGiftCard,
  visiblePopupPaymentDetails,
  closePopupProductPaymentDetails,
  nextPayment,
  visibleErrorMessageFromPax,
  errorMessageFromPax,
  setVisibleErrorMessageFromPax,
  cashBackRef,
  setVisibleChangeMoney,
  doneBillByCash,
  visibleScanCode,
  onRequestCloseScanCode,
  resultScanCode,
  cancelInvoicePrint,
  printTemptInvoice,
  checkStatusCashier,
  finishedHandle,
  changeTipRef,
  onTipAdd,
  visibleChangeTip,
  setVisibleChangeTip,
  switchTax,
  isTax,
  onDiscountItemAdd,
  onGoBackCheckOut,
  cancelGiftCardPayment,
  visibleConfirmPayment,
  setVisibleConfirmPayment,
  confirmPaymentClover,
  rejectPaymentClover,
  doPrintClover,
  shareTemptInvoice,
  invoiceRef,
  visiblePopupGiftCard,
  onDidNotPayCheck,
  isDidNotPay,
  getPurchasePoint,
  didNotPayComplete,
}) => {
  const [t] = useTranslation();

  const renderButton = () => {
    return (
      <>
        <View style={layouts.marginHorizontal} />
        <ButtonGradient
          // disable={true}
          width={scaleWidth(100)}
          height={scaleHeight(32)}
          fontSize={scaleFont(12)}
          textWeight="normal"
          label={t("Share receipt")}
          onPress={shareTemptInvoice}
          leftChildren={() => (
            <Image style={styles.icon} source={IMAGE.share_icon} />
          )}
        />
        <View style={layouts.marginHorizontal} />
        <ButtonGradient
          // disable={true}
          width={scaleWidth(100)}
          height={scaleHeight(32)}
          fontSize={scaleFont(12)}
          textWeight="normal"
          label={t("Print receipt")}
          onPress={printTemptInvoice}
          leftChildren={() => (
            <Image style={styles.icon} source={IMAGE.print_btn} />
          )}
        />
        <View style={layouts.marginHorizontal} />
        <ButtonGradient
          // disable={true}
          width={scaleWidth(120)}
          height={scaleHeight(32)}
          fontSize={scaleFont(12)}
          textWeight="normal"
          label={t("Open Cashier")}
          onPress={checkStatusCashier}
          leftChildren={() => (
            <Image style={styles.icon} source={IMAGE.cashier_btn} />
          )}
        />
        <View style={layouts.marginHorizontal} />
      </>
    );
  };

  return (
    <>
      <View style={layouts.fill}>
        <View style={styles.headContent}>
          <CheckOutCustomerInfo
            ref={customerRef}
            customerInfo={orderItem?.customer}
          />
          <View style={styles.headerRightContent}>
            {renderButton()}
            <ButtonGradientWhite
              // label={t("")}
              description={t("Do you want to exist this checkout ?")}
              width={scaleWidth(40)}
              height={scaleHeight(40)}
              fontSize={scaleFont(17)}
              textWeight="normal"
              onPress={onGoBackCheckOut}
              // onPress={onGoBackOrderList}
            >
              <Image source={IMAGE.back} />
            </ButtonGradientWhite>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.listContent}>
            <View style={styles.basketHeader}>
              <Text style={styles.basketTitle}>
                {t("Select payment method")}
              </Text>

              {getPurchasePoint() === "CallOrder" && (
                <CustomCheckBox
                  label={t("Did not pay")}
                  onValueChange={onDidNotPayCheck}
                  selectedColor={colors.OCEAN_BLUE}
                  onCheckColor="#fff"
                  textStyle={styles.textStyle}
                  style={styles.customCheckbox}
                />
              )}
            </View>
            <View style={layouts.marginVertical} />
            <View
              style={[layouts.fill, isDidNotPay && styles.disableStyle]}
              pointerEvents={isDidNotPay ? "none" : "auto"}
            >
              {/* <View style={styles.rowContent}>
                <ButtonPaymentMethod
                  key={"HarmonyPay"}
                  title={"HarmonyPay"}
                  selectedPayment={selectedPayment}
                  paymentSelected={paymentSelected}
                />

                <ButtonPaymentMethod
                  key={"Cash"}
                  title={"Cash"}
                  selectedPayment={selectedPayment}
                  paymentSelected={paymentSelected}
                />
              </View> */}
              <View style={styles.rowContent}>
                <ButtonPaymentMethod
                  key={"Cash"}
                  title={"Cash"}
                  selectedPayment={selectedPayment}
                  paymentSelected={paymentSelected}
                />

                <ButtonPaymentMethod
                  key={"Credit Card"}
                  title={"Credit Card"}
                  selectedPayment={selectedPayment}
                  paymentSelected={paymentSelected}
                />
              </View>
              <View style={styles.rowContent}>
                <ButtonPaymentMethod
                  key={"Gift Card"}
                  title={"Gift Card"}
                  selectedPayment={selectedPayment}
                  paymentSelected={paymentSelected}
                />

                <ButtonPaymentMethod
                  key={"Other"}
                  title={"Other"}
                  selectedPayment={selectedPayment}
                  paymentSelected={paymentSelected}
                />
              </View>
            </View>

            <View style={layouts.center}>
              <ButtonGradientWhite
                label={t("BACK")}
                width={scaleWidth(400)}
                height={scaleHeight(60)}
                fontSize={scaleFont(25)}
                onPress={onGoBackCheckOut}
              />
            </View>
          </View>
          <View style={styles.basketContent}>
            <View style={styles.basketHeader}>
              <Text style={styles.basketTitle}>{t("Basket")}</Text>
            </View>

            <View style={styles.basketDetail}>
              <BasketPaymentContent
                ref={basketRef}
                payBasket={payBasket}
                cancelHarmonyPayment={cancelHarmonyPayment}
                orderItem={orderItem}
                paymentSelected={paymentSelected}
                changeButtonDone={changeButtonDone}
                isDonePayment={isDonePayment}
                isCancelHarmonyPay={isCancelHarmonyPay}
                groupAppointment={groupAppointment}
                finishedHandle={finishedHandle}
                onDiscountAdd={onDiscountAdd}
                onTipAdd={onTipAdd}
                switchTax={switchTax}
                isTax={isTax}
                onDiscountItemAdd={onDiscountItemAdd}
                isDidNotPay={isDidNotPay}
                didNotPayComplete={didNotPayComplete}
              />
            </View>
          </View>
        </View>

        <DialogProductDetail ref={productDetailRef} />
      </View>

      <PopupDiscount ref={popupDiscountRef} title={t("Discount")} />
      <PopupDiscountItem ref={popupDiscountItemRef} title={t("Discount")} />
      <PopupBlockDiscount title={t("Discount")} />
      <PopupDiscountLocal
        ref={popupDiscountLocalRef}
        visible={visiblePopupDiscountLocal}
        title={t("Discount")}
        onRequestClose={onRequestClosePopupDiscountLocal}
        callbackDiscountToParent={(
          customDiscountPercentLocal,
          customDiscountFixedLocal,
          discountTotalLocal
        ) =>
          callbackDiscountToParent(
            customDiscountPercentLocal,
            customDiscountFixedLocal,
            discountTotalLocal
          )
        }
      />

      <PopupConfirm
        visible={visibleConfirm}
        title={t("Confirmation")}
        message={titleExitCheckoutTab}
        onRequestClose={setVisibleConfirm}
        confimYes={popupConfirmOnRequestClose}
      />

      <PopupConfirm
        visible={visibleConfirmPayment ? true : false}
        title={t("Verify payment")}
        message={t(
          "This may be a duplicate, do you want to accept this payment?"
        )}
        onRequestClose={() => {
          setVisibleConfirmPayment;
        }}
        confimYes={confirmPaymentClover}
        confirmNo={rejectPaymentClover}
        textLeftButton={t("Reject")}
        textRightButton={t("Accept")}
        hideCloseButton={true}
      />

      <ErrorMessagePaxModal
        visible={visibleErrorMessageFromPax}
        title={t("Trasaction Fail")}
        message={errorMessageFromPax}
        onRequestClose={() => {
          setVisibleErrorMessageFromPax(false);
        }}
        confimYes={() => {
          setVisibleErrorMessageFromPax(false);
        }}
      />

      <PopupChangeMoney
        ref={cashBackRef}
        title={t("Confirmation")}
        onRequestClose={() => {
          setVisibleChangeMoney(false);
        }}
        confimOK={doneBillByCash}
      />

      <PopupProcessingCredit
        visible={visibleProcessingCredit}
        onRequestClose={cancelTransaction}
        language={language}
      />

      <PopupBill
        ref={modalBillRef}
        title={t("Enter Amount")}
        visible={visibleBillOfPayment}
        onRequestClose={onRequestCloseBillModal}
        language={language}
        extractBill={extractBill}
        doneBill={doneBill}
      />

      <PopupSendLinkInstall
        ref={popupSendLinkInstallRef}
        visible={visibleSendLinkPopup}
        title={t("Confirmation")}
        onRequestClose={() => setVisibleSendLinkPopup(false)}
        confimYes={sendLinkInstallApp}
      />

      <PopupActiveGiftCard
        key={"payment"}
        ref={(ref) => (activeGiftCardPayRef.current = ref)}
        title={t("Active Gift Card")}
        onRequestClose={closePopupActiveGiftCard}
        submitSerialCode={submitPayGiftCard}
        visiblePopupGiftCard={visiblePopupGiftCard}
      />

      <PopupPaymentDetails
        title={t("Payment Details")}
        visible={visiblePopupPaymentDetails}
        onRequestClose={closePopupProductPaymentDetails}
        language={language}
        nextPayment={nextPayment}
      />

      <PopupScanCode
        visible={visibleScanCode}
        onRequestClose={onRequestCloseScanCode}
        resultScanCode={resultScanCode}
      />

      <PopupReceipt
        ref={invoiceRef}
        doPrintClover={doPrintClover}
        cancelInvoicePrint={cancelInvoicePrint}
        groupAppointment={groupAppointment}
      />

      <PopupChangeTip
        ref={changeTipRef}
        visible={visibleChangeTip}
        title={t("Add Tip")}
        onRequestClose={() => {
          setVisibleChangeTip(false);
        }}
      />

      <PopupPayCompleted
        onRequestClose={() => {}}
        printBill={printBill}
        donotPrintBill={donotPrintBill}
      />

      <PopupProcessingCredit
        visible={visibleProcessingCredit}
        onRequestClose={cancelTransaction}
        language={language}
      />

      <PopupEnterAmountGiftCard
        ref={popupEnterAmountGiftCardRef}
        onRequestClose={onRequestCloseBillModal}
        language={language}
        extractBill={extractBill}
        doneBill={doneBill}
      />

      <PopupGiftCardDetail
        title={t("Gift Card Details")}
        onRequestClose={closePopupProductPaymentDetails}
        language={language}
        nextPayment={nextPayment}
        cancelGiftCardPayment={cancelGiftCardPayment}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },

  headContent: {
    height: scaleHeight(72),
    backgroundColor: colors.WHITE,
    shadowColor: "#0000001a",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.32,
    alignItems: "center",
    paddingLeft: scaleWidth(16),
    flexDirection: "row",
  },

  rowContent: {
    marginVertical: scaleHeight(20),
    paddingHorizontal: scaleWidth(16),
    flexDirection: "row",
    justifyContent: "space-between",
  },

  headerRightContent: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: scaleWidth(16),
  },

  basketContent: {
    flex: 4,
    paddingBottom: scaleHeight(16),
    backgroundColor: "#fff",
    justifyContent: "center",
  },

  listContent: {
    flex: 5,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    paddingBottom: scaleHeight(16),
    borderRightWidth: scaleWidth(1),
    borderStyle: "solid",
    borderRightColor: "#dddddd",
  },

  basketHeader: {
    height: scaleHeight(48),
    backgroundColor: colors.VERY_LIGHT_PINK_1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scaleWidth(16),

    borderTopWidth: scaleWidth(1),
    borderBottomWidth: scaleWidth(1),
    borderStyle: "solid",
    borderColor: "#dddddd",
  },

  basketTitle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(20),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.GREYISH_BROWN,
  },

  basketButton: {
    height: scaleHeight(60),
    borderRadius: scaleWidth(3),
    backgroundColor: colors.VERY_LIGHT_PINK_E_5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dddddd",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: scaleWidth(16),
  },

  basketButtonText: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(25),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: -0.6,
    textAlign: "center",
    color: colors.BROWNISH_GREY,
  },

  basketDetail: {
    flex: 1,
  },
  icon: {
    width: scaleWidth(20),
    height: scaleHeight(20),
    marginRight: scaleWidth(5),
  },

  textStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(20),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
    // textDecorationLine: "underline",
  },
  customCheckbox: { height: scaleHeight(40) },

  disableStyle: {
    opacity: 0.7,
  },
});
