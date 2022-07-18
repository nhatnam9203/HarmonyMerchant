import { ButtonCustom } from "@components";
import { QRCodePay } from "@components/PaymentButtons";
import { i18n } from "@shared/services";
import { checkIsTablet, scaleSize, localize } from "@utils";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SalonHomeContext } from "../SalonHomeContext";
import { Header } from "../widgets";
import { ItemPaymentMethod } from "./components";

export const Payments = () => {
  const ctx = React.useContext(SalonHomeContext);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header label={localize("Select payment method")} />

      <View style={styles.box_payment_container}>
        <QRCodePay
          key="QRCodePay"
          appointment={ctx.groupAppointment}
          onPaidAppointment={ctx.onCodePayPaidAppointment}
        />
        {["Cash"].map((title, index) => (
          <ItemPaymentMethod
            key={index}
            title={title}
            selectedPayment={ctx.selectedPayment}
            paymentSelected={ctx.paymentSelected}
          />
        ))}
      </View>
      <View style={styles.box_payment_container}>
        {["Credit Card", "Other"].map((title, index) => (
          <ItemPaymentMethod
            key={index}
            title={title}
            selectedPayment={ctx.selectedPayment}
            paymentSelected={ctx.paymentSelected}
          />
        ))}
      </View>
      {/* ------ Footer ----- */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: scaleSize(8),
        }}
      >
        <ButtonCustom
          width={scaleSize(300)}
          title={localize("BACK")}
          backgroundColor="#0764B0"
          textColor="#fff"
          onPress={ctx.backAddBasket}
          style={styles.btn_back}
          styleText={styles.txt_btn_basket}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box_payment_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scaleSize(20),
    marginTop: checkIsTablet() ? scaleSize(15) : scaleSize(30),
  },
  txt_btn_basket: {
    fontSize: scaleSize(19),
    fontWeight: "600",
  },
  btn_back: {
    borderWidth: 1,
    borderColor: "#C5C5C5",
    borderRadius: 4,
    height: scaleSize(44),
  },
});
