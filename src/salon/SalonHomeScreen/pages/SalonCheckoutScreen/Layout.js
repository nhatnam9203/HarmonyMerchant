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
  displayCustomerInfoPopup,
  displayEnterUserPhonePopup,
  onChangeModePayment,
  addAppointmentCheckout,
  staffListCurrentDate,
  categoriesByMerchant,

  isShowCategoriesColumn,
  isShowColProduct,
  selectedStaff,
  isShowColAmount,
  isBlockBookingFromCalendar,
  displayCategoriesColumn,
  categoryStaff,
  isLoadingCategory,
  onPressSelectCategory,
  categorySelected,
  onSelectGiftCard,

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
            <Categories
              staffListCurrentDate={staffListCurrentDate}
              categoriesByMerchant={categoriesByMerchant}
              groupAppointment={groupAppointment}
              isShowCategoriesColumn={isShowCategoriesColumn}
              isShowColProduct={isShowColProduct}
              selectedStaff={selectedStaff}
              isShowColAmount={isShowColAmount}
              isBlockBookingFromCalendar={isBlockBookingFromCalendar}
              displayCategoriesColumn={displayCategoriesColumn}
              categoryStaff={categoryStaff}
              isLoadingCategory={isLoadingCategory}
              onPressSelectCategory={onPressSelectCategory}
              categorySelected={categorySelected}
              onSelectGiftCard={onSelectGiftCard}
            />
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
