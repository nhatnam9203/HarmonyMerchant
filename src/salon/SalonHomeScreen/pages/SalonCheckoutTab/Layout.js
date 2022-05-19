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
  // refs
  categoriesRef,
  amountRef,

  // store
  staffListCurrentDate,
  customerInfoBuyAppointment,
  groupAppointment,
  paymentDetailInfo,
  blockAppointments,
  isBookingFromCalendar,
  isDonePayment,
  categoriesByMerchant,
  isOfflineMode,

  // local
  stateLocal,
  isGetCategoriesByStaff,
  isGetServiceByStaff,
  isGetProductByStaff,
  isCustomService = false,
  isShowCategoriesColumn,
  isShowColProduct,
  selectedStaff,
  isShowColAmount,
  isBlockBookingFromCalendar,
  displayCategoriesColumn,
  categoryStaff,
  onPressSelectCategory,
  categorySelected,
  onSelectGiftCard,
  tabCurrent,
  basket,
  paymentSelected,
  changeButtonDone,
  isCancelHarmonyPay,
  isLoadingService,
  categoryTypeSelected,
  customService,

  // funcs
  displayCustomerInfoPopup,
  displayEnterUserPhonePopup,
  onChangeModePayment,
  addAppointmentCheckout,
  cancelHarmonyPayment,
  payBasket,
  confimPayOfflinemode,
  bookAppointmentFromCalendar,
  selectPayment,
  bookBlockAppointment,
  checkBlockAppointment,
  getDataColProduct,
  showCustomServiceAmount,
  showColAmount,

  getExtrasFromRedux,
  onPressSelectExtra,
  arrSelectedExtra,
  addAmount,
  removeItemBasket,
  changeStylist,
  toggleCollapses,
  changeProduct,
  removeBlockAppointment,
  createABlockAppointment,
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
              ref={categoriesRef}
              staffListCurrentDate={staffListCurrentDate} // array staffs of merchant work by date
              groupAppointment={groupAppointment} // groupAppointments
              categoryStaff={categoryStaff} // array categories get by staff
              isLoadingCategory={isGetCategoriesByStaff} // loading get categories
              isOfflineMode={isOfflineMode} // network lost
              selectedStaff={selectedStaff}
              categoriesByMerchant={categoriesByMerchant}
              isShowCategoriesColumn={isShowCategoriesColumn}
              isShowColProduct={isShowColProduct}
              isShowColAmount={isShowColAmount}
              isBlockBookingFromCalendar={isBlockBookingFromCalendar}
              displayCategoriesColumn={displayCategoriesColumn}
              onPressSelectCategory={onPressSelectCategory}
              categorySelected={categorySelected}
              onSelectGiftCard={onSelectGiftCard}
              getDataColProduct={getDataColProduct}
              isCustomService={isCustomService}
              isLoadingService={isLoadingService}
              isBookingFromCalendar={isBookingFromCalendar}
              categoryTypeSelected={categoryTypeSelected}
              blockAppointments={blockAppointments}
              customService={customService}
              showCustomServiceAmount={showCustomServiceAmount}
              showColAmount={showColAmount}
              getExtrasFromRedux={getExtrasFromRedux}
              onPressSelectExtra={onPressSelectExtra}
              arrSelectedExtra={arrSelectedExtra}
              addAmount={addAmount}
              {...stateLocal}
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
            {...stateLocal}
            removeItemBasket={removeItemBasket}
            changeStylist={changeStylist}
            toggleCollapses={toggleCollapses}
            changeProduct={changeProduct}
            removeBlockAppointment={removeBlockAppointment}
            createABlockAppointment={createABlockAppointment}
            addAppointmentCheckout={addAppointmentCheckout}
            isOfflineMode={isOfflineMode}
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
