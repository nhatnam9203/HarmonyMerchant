import {
  PopupActiveGiftCard,
  PopupChangeMoney,
  PopupChangePriceAmountProduct,
  PopupChangeStylist,
  PopupChangeTip,
  PopupCheckStaffPermission,
  PopupConfirm,
  PopupInvoicePrint,
  PopupProcessingCredit,
  PopupScanCode,
  PopupSendLinkInstall,
} from "@components";
import { DialogPayCompleted } from "@components/DialogPayCompleted";
import { PopupReceipt } from "@shared/components";
import { i18n } from "@shared/services";
import { colors, layouts } from "@shared/themes";
import * as AppUtils from "@utils";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Basket } from "./Basket";
import { Categories } from "./Categories";
import {
  EnterCustomerPhonePopup,
  ErrorMessagePaxModal,
  PopupAddEditCustomer,
  PopupAddItemIntoAppointments,
  PopupBill,
  PopupBlockDiscount,
  PopupDiscount,
  PopupDiscountLocal,
  PopupEnterAmountCustomService,
  PopupEnterAmountGiftCard,
  PopupGiftCardDetail,
  PopupPaymentDetails,
} from "./Dialogs";
import { Payments } from "./Payments";
import { SalonHomeContextProvider } from "./SalonHomeContext";
import { CustomerPanel } from "./widgets";

const SALON_FLEX = 6.1;
const BASKET_FLEX = 3.9;

export const Layout = (props) => {
  return (
    <View style={styles.container}>
      <SalonHomeContextProvider value={props}>
        <CustomerPanel />
        <View style={[layouts.horizontal, layouts.fill]}>
          <SalonContent
            onChangeTab={props.onChangeModePayment}
            categoriesRef={props.categoriesRef}
            isPayment={props.isPayment}
          />
          <BasketContent />
        </View>
        <PopupDiscount
          ref={props.popupDiscountRef}
          title={AppUtils.localize("Discount")}
        />
        <PopupBlockDiscount title={i18n.t("Discount")} />
        <PopupDiscountLocal
          ref={props.popupDiscountLocalRef}
          visible={props.visiblePopupDiscountLocal}
          title={AppUtils.localize("Discount")}
          onRequestClose={props.onRequestClosePopupDiscountLocal}
          callbackDiscountToParent={(
            customDiscountPercentLocal,
            customDiscountFixedLocal,
            discountTotalLocal
          ) =>
            props?.callbackDiscountToParent(
              customDiscountPercentLocal,
              customDiscountFixedLocal,
              discountTotalLocal
            )
          }
        />
        <PopupConfirm
          visible={props.visibleConfirm}
          title={AppUtils.localize("Confirmation")}
          message={props.titleExitCheckoutTab}
          onRequestClose={props.closePopupConfirm}
          confimYes={props.clearDataConfirm}
        />

        <PopupConfirm
          visible={props.visibleConfirmPayment ? true : false}
          title={AppUtils.localize("VerifyPayment")}
          message={AppUtils.localize("VerifyPaymentMessage")}
          onRequestClose={props.closePopupPaymentConfirm}
          confimYes={props.confirmPaymentClover}
          confirmNo={props.rejectPaymentClover}
          textLeftButton={AppUtils.localize("Reject")}
          textRightButton={AppUtils.localize("Accept")}
          hideCloseButton={true}
        />
        {/* ----------------- Display Error Message From Pax Machine ------------------ */}
        <ErrorMessagePaxModal
          visible={props.visibleErrorMessageFromPax}
          title={AppUtils.localize("Trasaction Fail")}
          message={props.errorMessageFromPax}
          onRequestClose={props.closePopupErrorMessageFromPax}
          confimYes={props.handleYes}
          isShowRefreshButton={props.isShowRefreshButton}
          onConfirmRefresh={props.onConfirmRefresh}
        />
        <PopupChangeMoney
          ref={props.cashBackRef}
          title={AppUtils.localize("Confirmation")}
          onRequestClose={props.closePopupChangeMoney}
          confimOK={props.doneBillByCash}
        />
        <PopupChangeStylist
          ref={props.changeStylistRef}
          visible={props.visibleChangeStylist}
          title={AppUtils.localize("Modify Service")}
          onRequestClose={props.closePopupChangeStylist}
          changeStylistBasketLocal={props.changeStylistBasketLocal}
          staffOfService={props.staffOfService}
          isOfflineMode={props.isOfflineMode}
        />
        <PopupChangePriceAmountProduct
          ref={props.changePriceAmountProductRef}
          visible={props.visibleChangePriceAmountProduct}
          title={AppUtils.localize("Modification")}
          onRequestClose={props.closePopupChangePriceAmountProduct}
          changeProductBasketLocal={props.changeProductBasketLocal}
        />
        <PopupChangeTip
          ref={props.changeTipRef}
          visible={props.visibleChangeTip}
          title={AppUtils.localize("Add Tip")}
          onRequestClose={props.closePopupChangeTip}
        />
        <DialogPayCompleted
          onRequestClose={() => {}}
          printBill={props.printBill}
          donotPrintBill={props.donotPrintBill}
          cancelInvoicePrint={props.cancelInvoicePrint}
          doPrintClover={props.doPrintClover}
          paymentSelected={props.paymentSelected}
          groupAppointmentId={props.groupAppointment?.mainAppointmentId}
        />
        <PopupProcessingCredit
          visible={props.visibleProcessingCredit}
          onRequestClose={props.cancelTransaction}
          language={"en"}
          isShowCountdown={props.isShowCountdown}
        />
        <PopupBill
          ref={props.modalBillRef}
          title={AppUtils.localize("Enter Amount")}
          visible={props.visibleBillOfPayment}
          onRequestClose={props.onRequestCloseBillModal}
          language={"en"}
          extractBill={props.extractBill}
          doneBill={props.doneBill}
        />
        <PopupEnterAmountGiftCard
          ref={props.popupEnterAmountGiftCardRef}
          onRequestClose={props.onRequestCloseBillModal}
          language={"en"}
          extractBill={props.extractBill}
          doneBill={props.doneBill}
        />
        <PopupSendLinkInstall
          ref={props.popupSendLinkInstallRef}
          visible={props.visibleSendLinkPopup}
          title={AppUtils.localize("Confirmation")}
          onRequestClose={props.closePopupSendLinkInstall}
          confimYes={props.sendLinkInstallApp}
        />
        <PopupActiveGiftCard
          ref={props.activeGiftCardRef}
          title={i18n.t("Active Gift Card")}
          onRequestClose={props.closePopupActiveGiftCard}
          submitSerialCode={props.submitSerialCode}
        />
        <PopupPaymentDetails
          title={AppUtils.localize("Payment Details")}
          visible={props.visiblePopupPaymentDetails}
          onRequestClose={props.closePopupProductPaymentDetails}
          language={"en"}
          nextPayment={props.nextPayment}
        />
        <PopupScanCode
          visible={props.visibleScanCode}
          onRequestClose={props.onRequestCloseScanCode}
          resultScanCode={props.resultScanCode}
        />
        <PopupInvoicePrint
          ref={props.invoicePrintRef}
          visiblePrintInvoice={props.visiblePrintInvoice}
          onRequestClose={props.cancelInvoicePrint}
          doPrintClover={(imageUri) => props.doPrintClover(imageUri)}
        />
        <EnterCustomerPhonePopup
          ref={props.popupCustomerInfoRef}
          title={AppUtils.localize("Enter Phone Number")}
          onRequestClose={props.closePopupEnterCustomerPhone}
          changeStylistBasketLocal={props.changeStylistBasketLocal}
        />
        <PopupAddItemIntoAppointments
          ref={props.popupAddItemIntoAppointmentsRef}
          title={AppUtils.localize("Modification")}
          visible={props.visiblePopupAddItemIntoBasket}
          onRequestClose={props.closePopupAddItemIntoAppointments}
          selectedStaff={props.selectedStaff}
        />
        <PopupGiftCardDetail
          title={AppUtils.localize("Gift Card Details")}
          onRequestClose={props.closePopupProductPaymentDetails}
          language={"en"}
          nextPayment={props.nextPayment}
          cancelGiftCardPayment={props.cancelGiftCardPayment}
        />
        <PopupCheckStaffPermission
          ref={props.popupCheckDiscountPermissionRef}
          visiblePopupCheckStaffPermission={
            props.visiblePopupCheckDiscountPermission
          }
          title={AppUtils.localize("Input PIN Number")}
          tabName={AppUtils.menuTabs.CHECKOUT_DISCOUNT}
          onRequestClose={props.closePopupCheckDiscountPermission}
        />
        <PopupAddEditCustomer
          ref={props.addEditCustomerInfoRef}
          visible={props.visibleAddEditCustomerPopup}
          title={"Customer Information"}
          onRequestClose={props.closePopupAddEditCustomer}
          editCustomerInfo={props.editCustomerInfo}
          addCustomerInfo={props.addCustomerInfo}
        />
        <PopupReceipt
          ref={props.invoiceRef}
          groupAppointment={props.groupAppointment}
          doPrintClover={props.doPrintClover}
          cancelInvoicePrint={props.cancelInvoicePrint}
        />
        <PopupEnterAmountCustomService
          ref={props.popupEnterAmountCustomServiceRef}
          language={"en"}
          submitAddCustomService={props.submitAddCustomService}
        />
      </SalonHomeContextProvider>
    </View>
  );
};

const SalonContent = ({ categoriesRef, isPayment = false }) => {
  return (
    <View style={{ flex: SALON_FLEX, zIndex: 100 }}>
      {isPayment ? <Payments /> : <Categories ref={categoriesRef} />}
    </View>
  );
};

const BasketContent = () => {
  return (
    <View style={[{ flex: BASKET_FLEX }, styles.border]}>
      <Basket />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  border: {
    borderStyle: "solid",
    borderLeftWidth: 1,
    borderLeftColor: colors.VERY_LIGHT_PINK,
    borderRightWidth: 1,
    borderRightColor: colors.VERY_LIGHT_PINK,
  },
});
