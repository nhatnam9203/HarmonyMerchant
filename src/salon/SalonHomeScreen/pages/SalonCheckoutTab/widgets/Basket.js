import { Button, Text } from "@components";
import ICON from "@resources";
import {
  EnterCustomerPhonePopup,
  ErrorMessagePaxModal,
  ItemAmount,
  ItemBlockBasket,
  ItemCategory,
  ItemCustomerBasket,
  ItemExtra,
  ItemPaymentMethod,
  ItemProductService,
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
} from "@src/screens/HomeScreen/widget/TabCheckout/widget";
import { scaleSize } from "@utils";
import _ from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, View, ScrollView } from "react-native";
import { ButtonBasket } from "./ButtonBasket";
import { layouts } from "@shared/themes";
import { UI } from "@shared/components";
import {
  checkCategoryIsNotExist,
  formatMoney,
  formatNumberFromCurrency,
  localize,
  menuTabs,
  roundFloatNumber,
} from "@utils";
import { SalonHomeContext } from "../SalonHomeContext";
import { Header } from "./components";
import { colors } from "@shared/themes";

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

  const _renderBlockAppointment = () => {
    let temptGrandTotal = 0;
    for (let i = 0; i < blockAppointments.length; i++) {
      temptGrandTotal =
        temptGrandTotal + formatNumberFromCurrency(blockAppointments[i].total);
    }

    return (
      <>
        {blockAppointments.map((appointment, index) => (
          <ItemBlockBasket
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

        {/* ----------- Grand Total ----------- */}
        <View
          style={{
            paddingHorizontal: scaleSize(10),
            marginTop: scaleSize(15),
          }}
        >
          <View
            style={{
              height: 2,
              backgroundColor: "#0764B0",
              marginTop: scaleSize(10),
              marginBottom: scaleSize(15),
            }}
          />
          {/* ---------- Tip ------ */}
          <View style={styles.payNumberTextContainer}>
            <Text
              style={[
                styles.textPay,
                {
                  fontSize: scaleSize(18),
                  fontWeight: "600",
                  color: "#0764B0",
                },
              ]}
            >
              {`${localize("Grand Total", language)}:`}
            </Text>
            <Text
              style={[
                styles.textPay,
                {
                  fontSize: scaleSize(18),
                  fontWeight: "600",
                  color: "rgb(65,184,85)",
                },
              ]}
            >
              {`$ ${formatMoney(temptGrandTotal)}`}
            </Text>
          </View>
        </View>

        <View style={{ height: scaleSize(70) }} />
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
        {/* ----------- Grand Total ----------- */}
        {parseFloat(tempTotal) > 0 ? (
          <View style={{ paddingHorizontal: scaleSize(10) }}>
            <View
              style={{
                height: 2,
                backgroundColor: "#0764B0",
                marginTop: scaleSize(10),
                marginBottom: scaleSize(15),
              }}
            />
            <View style={styles.payNumberTextContainer}>
              <Text
                style={[
                  styles.textPay,
                  {
                    fontSize: scaleSize(18),
                    fontWeight: "600",
                    color: "#0764B0",
                  },
                ]}
              >
                {`${localize("Grand Total", language)}:`}
              </Text>
              <Text
                style={[
                  styles.textPay,
                  {
                    fontSize: scaleSize(18),
                    fontWeight: "600",
                    color: "rgb(65,184,85)",
                  },
                ]}
              >
                {`$ ${formatMoney(tempTotal)}`}
              </Text>
            </View>
          </View>
        ) : null}

        {/* ----------- Paid Amount ----------- */}
        {!isBookingFromCalendar && !_.isEmpty(paymentDetailInfo) ? (
          <View
            style={{
              paddingHorizontal: scaleSize(10),
              marginBottom: scaleSize(8),
            }}
          >
            <View
              style={{
                height: 2,
                backgroundColor: "#DDDDDD",
                marginTop: scaleSize(10),
                marginBottom: scaleSize(15),
              }}
            />
            {/* ---------- Paid amount ------ */}
            {paidAmounts.map((paidAmountInfo, index) => (
              <View
                key={index}
                style={[
                  styles.payNumberTextContainer,
                  {
                    justifyContent: "space-between",
                    marginBottom: scaleSize(8),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.textPay,
                    {
                      fontSize: scaleSize(18),
                      fontWeight: "600",
                      color: "#404040",
                    },
                  ]}
                >
                  {`${localize("Paid ", language)}`}
                  <Text
                    style={[
                      styles.textPay,
                      {
                        fontSize: scaleSize(18),
                        fontWeight: "300",
                        color: "#404040",
                      },
                    ]}
                  >
                    {` (${paidAmountInfo.paymentMethod})`}
                  </Text>
                </Text>
                <Text
                  style={[
                    styles.textPay,
                    {
                      fontSize: scaleSize(18),
                      fontWeight: "600",
                      color: "#404040",
                    },
                  ]}
                >
                  {`  $ ${formatMoney(paidAmountInfo.amount)}`}
                </Text>
              </View>
            ))}

            {/* ---------- Due amount ------ */}
            {!isBookingFromCalendar && paymentDetailInfo.dueAmount ? (
              <View
                style={[
                  styles.payNumberTextContainer,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text
                  style={[
                    styles.textPay,
                    {
                      fontSize: scaleSize(18),
                      fontWeight: "600",
                      color: "#FF3B30",
                    },
                  ]}
                >
                  {`${localize("Amount Due", language)}:`}
                </Text>
                <Text
                  style={[
                    styles.textPay,
                    {
                      fontSize: scaleSize(18),
                      fontWeight: "600",
                      color: "#FF3B30",
                    },
                  ]}
                >
                  {`   $ ${formatMoney(paymentDetailInfo.dueAmount)}`}
                </Text>
              </View>
            ) : (
              <View />
            )}
          </View>
        ) : (
          <View />
        )}
        <View style={{ height: scaleSize(50) }} />
      </>
    );
  };

  return (
    <View style={styles.container}>
      {/* -------- Header Basket -------- */}
      {/* <View
        style={[
          styles.headerBasket,
          {
            flexDirection: "row",
            paddingHorizontal: scaleSize(8),
            backgroundColor: "#F1F1F1",
          },
        ]}
      >
        <View style={{ flex: 1 }} />
        <Text
          style={[
            styles.textHeader,
            { fontWeight: "600", fontSize: scaleSize(16) },
          ]}
        >
          {t("Basket")}
        </Text>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          {isShowAddButton ? (
            <Button onPress={addAppointmentCheckout}>
              <Image
                source={ICON.add_appointment_checkout}
                style={{ width: scaleSize(25), height: scaleSize(25) }}
              />
            </Button>
          ) : (
            <View />
          )}
        </View>
      </View> */}
      <Header label={t("Basket")} alignment="center" />

      {/* -------- Content Basket -------- */}
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {blockAppointments?.length > 0
            ? _renderBlockAppointment()
            : _renderGroupAppointment()}
        </ScrollView>
      </View>

      {/* -------- Footer Basket -------- */}
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
