import ICON from "@resources";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, TouchableOpacity } from "react-native";
import { Header } from "../../widgets";

export const BasketHeader = ({ isShowAddButton, addAppointmentCheckout }) => {
  const { t } = useTranslation();

  return (
    <Header label={t("Basket")} alignment="center" style={{ width: "100%" }}>
      {isShowAddButton && (
        <TouchableOpacity
          style={{
            width: scaleWidth(50),
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={addAppointmentCheckout}
        >
          <Image
            source={ICON.add_appointment_checkout}
            style={{ width: scaleWidth(30), height: scaleHeight(30) }}
          />
        </TouchableOpacity>
      )}
    </Header>
  );
};
