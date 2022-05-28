import React from "react";
import { View, Text } from "react-native";
import { colors, fonts, layouts } from "@shared/themes";
import { SalonHomeContext } from "../../SalonHomeContext";
import { ButtonBasket } from "../../widgets";
import { scaleSize } from "@utils";

export const BasketButtonConfirm = () => {
  const ctx = React.useContext(SalonHomeContext);
  const {
    isDonePayment,
    groupAppointment,
    blockAppointments,
    isBookingFromCalendar,
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
  } = ctx || {};

  return (
    <View
      style={{
        height: scaleSize(52),
        paddingHorizontal: scaleSize(8),
        paddingBottom: scaleSize(8),
      }}
    >
      <ButtonBasket
        isDonePayment={isDonePayment}
        groupAppointment={groupAppointment}
        blockAppointments={blockAppointments}
        isBookingFromCalendar={isBookingFromCalendar}
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
  );
};
