import { colors } from "@shared/themes";
import { formatNumberFromCurrency, roundFloatNumber, scaleSize } from "@utils";
import _ from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { SalonHomeContext } from "../SalonHomeContext";
import {
  BasketButtonConfirm,
  BasketGrandTotal,
  BasketHeader,
} from "./components";
import ItemAppointmentBasket from "./components/ItemAppointmentBasket";
import ItemCustomerBasket from "./components/ItemCustomerBasket";

export const Basket = () => {
  const { t } = useTranslation();

  const ctx = React.useContext(SalonHomeContext);
  const {
    groupAppointment,
    paymentDetailInfo,
    blockAppointments,
    isBookingFromCalendar,
    isShowColAmount,
    isBlockBookingFromCalendar,
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
    addBlockAppointmentRef,
    language,
    subTotalLocal,
    tipLocal,
    discountTotalLocal,
    taxLocal,
    infoUser,
    removeItemBasket,
    changeStylist,
    toggleCollapses,
    changeProduct,
    removeBlockAppointment,
    createABlockAppointment,
    isOfflineMode,
  } = ctx || {};

  const getGrandTotal = React.useMemo(() => {
    let result = 0;

    if (blockAppointments?.length > 0) {
      result = blockAppointments.reduce(
        (sum, current) => sum + formatNumberFromCurrency(current.total),
        0
      );
    } else if (groupAppointment?.appointments?.length > 0) {
      if (isOfflineMode) {
        result = roundFloatNumber(
          formatNumberFromCurrency(subTotalLocal) +
            formatNumberFromCurrency(tipLocal) +
            formatNumberFromCurrency(taxLocal) -
            formatNumberFromCurrency(discountTotalLocal)
        );
      } else {
        result = groupAppointment?.total ?? 0;
      }
    }
    return result;
  }, [blockAppointments, groupAppointment?.appointments, isOfflineMode]);

  const checkoutPayments =
    !_.isEmpty(paymentDetailInfo) && paymentDetailInfo.checkoutPayments
      ? paymentDetailInfo.checkoutPayments
      : [];

  const length_blockAppointments = blockAppointments
    ? blockAppointments.length
    : 0;

  const isShowAddBlock =
    length_blockAppointments > 0 &&
    blockAppointments[length_blockAppointments - 1].total != "0.00"
      ? true
      : false;

  const tempStyle = !isShowColAmount
    ? { borderLeftWidth: 3, borderLeftColor: "#EEEEEE" }
    : {};

  const isShowAddButton =
    (!isBlockBookingFromCalendar || !isBookingFromCalendar) &&
    ((!_.isEmpty(groupAppointment) && checkoutPayments.length === 0) ||
      (blockAppointments.length && isShowAddBlock) > 0);

  const paidAmounts = paymentDetailInfo.paidAmounts
    ? paymentDetailInfo.paidAmounts.slice(0).reverse()
    : [];

  const _renderBlockAppointment = () => {
    let temptGrandTotal = 0;
    for (let i = 0; i < blockAppointments.length; i++) {
      temptGrandTotal =
        temptGrandTotal + formatNumberFromCurrency(blockAppointments[i].total);
    }

    return (
      <>
        {blockAppointments.map((appointment, index) => (
          <ItemAppointmentBasket
            ref={addBlockAppointmentRef}
            key={`${appointment.appointmentId}_${index}`}
            blockIndex={index}
            language={language}
            appointmentDetail={appointment}
            subTotalLocal={subTotalLocal}
            tipLocal={tipLocal}
            discountTotalLocal={discountTotalLocal}
            taxLocal={taxLocal}
            basketLocal={basket}
            infoUser={infoUser}
            removeItemBasket={removeItemBasket}
            toggleCollaps={toggleCollapses}
            removeBlockAppointment={removeBlockAppointment}
            createABlockAppointment={createABlockAppointment}

            //   showModalDiscount={showModalDiscount}
            //   showModalTipAppointment={showModalTipAppointment}
            //   showModalCheckPermission={showModalCheckPermission}
          />
        ))}
      </>
    );
  };

  const _renderGroupAppointment = () => {
    const appointments = groupAppointment?.appointments
      ? groupAppointment.appointments
      : [];

    const temptGrandTotal = groupAppointment.total ? groupAppointment.total : 0;
    const totalLocal = roundFloatNumber(
      formatNumberFromCurrency(subTotalLocal) +
        formatNumberFromCurrency(tipLocal) +
        formatNumberFromCurrency(taxLocal) -
        formatNumberFromCurrency(discountTotalLocal)
    );
    const paidAmounts = paymentDetailInfo.paidAmounts
      ? paymentDetailInfo.paidAmounts.slice(0).reverse()
      : [];
    const tempTotal = isOfflineMode ? totalLocal : temptGrandTotal;

    return (
      <>
        {_.isEmpty(groupAppointment) ? (
          basket?.length > 0 ? (
            <ItemCustomerBasket
              language={language}
              subTotalLocal={subTotalLocal}
              tipLocal={tipLocal}
              discountTotalLocal={discountTotalLocal}
              taxLocal={taxLocal}
              removeItemBasket={removeItemBasket}
              changeStylist={changeStylist}
              changeProduct={changeProduct}
              // showModalDiscount={showModalDiscount}
              basketLocal={basket}
              isOfflineMode={true}
              // showModalTipAppointment={showModalTipAppointment}
              // showModalCheckPermission={showModalCheckPermission}
            />
          ) : (
            <View />
          )
        ) : (
          appointments.map((appointment, index) => (
            <ItemCustomerBasket
              key={`${appointment.appointmentId}_${index}`}
              language={language}
              appointmentDetail={appointment}
              subTotalLocal={subTotalLocal}
              tipLocal={tipLocal}
              discountTotalLocal={discountTotalLocal}
              taxLocal={taxLocal}
              removeItemBasket={removeItemBasket}
              changeStylist={changeStylist}
              changeProduct={changeProduct}
              // showModalDiscount={showModalDiscount}
              basketLocal={basket}
              // showModalTipAppointment={showModalTipAppointment}
              // showModalCheckPermission={showModalCheckPermission}
            />
          ))
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <BasketHeader
        isShowAddButton={isShowAddButton}
        addAppointmentCheckout={addAppointmentCheckout}
      />
      {/* -------- Content Basket -------- */}
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {blockAppointments?.length > 0
            ? _renderBlockAppointment()
            : _renderGroupAppointment()}

          <BasketGrandTotal
            grandTotal={getGrandTotal}
            paidAmounts={paidAmounts}
            dueAmount={paymentDetailInfo.dueAmount}
            isShowPaidAmount={
              !isBookingFromCalendar && !_.isEmpty(paymentDetailInfo)
            }
          />
        </ScrollView>
      </View>

      {/* -------- Footer Basket -------- */}
      <BasketButtonConfirm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },

  headerBasket: {
    height: scaleSize(38),
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#DDDDDD",
    borderBottomWidth: 1,
  },
});
