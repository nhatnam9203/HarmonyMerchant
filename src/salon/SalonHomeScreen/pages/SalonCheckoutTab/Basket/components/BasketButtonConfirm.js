import React from "react";
import { View, Text } from "react-native";
import { colors, fonts, layouts } from "@shared/themes";
import { SalonHomeContext } from "../../SalonHomeContext";
import { ButtonBasket } from "../../widgets";
import { scaleSize } from "@utils";

export const BasketButtonConfirm = () => {
  const ctx = React.useContext(SalonHomeContext);

  return (
    <View
      style={{
        height: scaleSize(52),
        paddingHorizontal: scaleSize(8),
        paddingBottom: scaleSize(8),
      }}
    >
      <ButtonBasket
        isDonePayment={ctx.isDonePayment}
        groupAppointment={ctx.groupAppointment}
        blockAppointments={ctx.blockAppointments}
        isBookingFromCalendar={ctx.isBookingFromCalendar}
        tabCurrent={ctx.isPayment}
        basket={ctx.basket}
        paymentSelected={ctx.paymentSelected}
        changeButtonDone={ctx.changeButtonDone}
        isCancelHarmonyPay={ctx.isCancelHarmonyPay}
        cancelHarmonyPayment={ctx.cancelHarmonyPayment}
        payBasket={ctx.payBasket}
        confimPayOfflinemode={ctx.confimPayOfflinemode}
        bookAppointmentFromCalendar={ctx.bookAppointmentFromCalendar}
        selectPayment={ctx.selectPayment}
        bookBlockAppointment={ctx.bookBlockAppointment}
        checkBlockAppointment={ctx.checkBlockAppointment}
      />
    </View>
  );
};
