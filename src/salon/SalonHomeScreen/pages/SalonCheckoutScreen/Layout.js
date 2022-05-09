import React from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Header, Categories, Basket, Payment } from "./widgets";
import { layouts } from "@shared/themes";
import {
  Button,
  ButtonCustom,
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
  ScrollableTabView,
  Text,
} from "@components";

export const Layout = ({
  customerInfoBuyAppointment,
  groupAppointment,
  paymentDetailInfo,
  blockAppointments,
  isBookingFromCalendar,
  isShowColAmount,
  isBlockBookingFromCalendar,
  displayCustomerInfoPopup,
  displayEnterUserPhonePopup,
  onChangeModePayment,
  addAppointmentCheckout,
  isDonePayment,
  tabCurrent,
  basket,
  paymentSelected,
  changeButtonDone,
  isCancelHarmonyPay,
  cancelHarmonyPayment,
  payBasket,
  confimPayOfflinemode,
  bookAppointmentFromCalendar,
  selectPayment,
  bookBlockAppointment,
  checkBlockAppointment,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Header
        customerInfoBuyAppointment={customerInfoBuyAppointment}
        groupAppointment={groupAppointment}
        displayCustomerInfoPopup={displayCustomerInfoPopup}
        displayEnterUserPhonePopup={displayEnterUserPhonePopup}
      />
      <View style={[layouts.horizontal, layouts.fill]}>
        <View style={{ flex: 4 }}>
          <ScrollableTabView
            style={{
              flex: 1,
            }}
            initialPage={0}
            locked={true}
            renderTabBar={() => <View />}
            onChangeTab={onChangeModePayment}
          >
            <Categories />
            <Payment />
          </ScrollableTabView>
        </View>
        <View style={{ flex: 3 }}>
          <Basket
            groupAppointment={groupAppointment}
            paymentDetailInfo={paymentDetailInfo}
            blockAppointments={blockAppointments}
            isBookingFromCalendar={isBookingFromCalendar}
            isShowColAmount={isShowColAmount}
            isBlockBookingFromCalendar={isBlockBookingFromCalendar}
            addAppointmentCheckout={addAppointmentCheckout}
            isDonePayment={isDonePayment}
            tabCurrent={tabCurrent}
            basket={basket}
            paymentSelected={paymentSelected}
            changeButtonDone={changeButtonDone}
            isCancelHarmonyPay={isCancelHarmonyPay}
            cancelHarmonyPayment={cancelHarmonyPayment}
            payBasket={payBasket}
            confimPayOfflinemode={confimPayOfflinemode}
            bookAppointmentFromCalendar={bookAppointmentFromCalendar}
            selectPayment={selectPayment}
            bookBlockAppointment={bookBlockAppointment}
            checkBlockAppointment={checkBlockAppointment}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
