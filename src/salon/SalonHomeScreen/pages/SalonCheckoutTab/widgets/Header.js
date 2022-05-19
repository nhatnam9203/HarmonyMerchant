import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { colors } from "@shared/themes";
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
import ICON from "@resources";
import { scaleSize, checkIsTablet } from "@utils";
import _ from "ramda";
import { useTranslation } from "react-i18next";
import { ButtonGradient } from "@shared/components";

export const Header = ({
  customerInfoBuyAppointment,
  groupAppointment,
  displayCustomerInfoPopup,
  displayEnterUserPhonePopup,
  checkStatusCashier,
  shareTemptInvoice,
  printTemptInvoice,
}) => {
  const { t } = useTranslation();

  const { customerId, firstName, lastName, phone } =
    customerInfoBuyAppointment || {};

  const displayName = `${firstName} ${lastName}`;
  const firstLetter = firstName ? firstName[0] : "";

  return (
    <View style={styles.container}>
      {customerId ? (
        <Button
          onPress={displayCustomerInfoPopup}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <View style={styles.avatar_box}>
            <Text style={styles.txt_avatar}>{`${firstLetter}`}</Text>
          </View>
          <View style={{ marginLeft: scaleSize(12) }}>
            <Text style={styles.txt_customer_name}>{`${displayName}`}</Text>
            <Text style={styles.txt_customer_phone}>{`${phone}`}</Text>
          </View>

          {/* -------- Enter other number --------- */}
          <Button onPress={displayEnterUserPhonePopup}>
            <Text style={styles.txt_enter_other_phone_number}>
              {`Enter another phone`}
            </Text>
          </Button>
        </Button>
      ) : (
        <Button
          onPress={displayEnterUserPhonePopup}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Image
            source={ICON.checkout_customer_icon}
            style={{ width: scaleSize(30), height: scaleSize(30) }}
          />
          <Text
            style={{
              color: "#404040",
              fontSize: scaleSize(12),
              fontWeight: "600",
              marginHorizontal: scaleSize(8),
            }}
          >
            {`Walking Customer`}
          </Text>
          <Image
            source={ICON.add_customer_info_checkout_tab}
            style={{ width: scaleSize(20), height: scaleSize(20) }}
          />
        </Button>
      )}

      {/* -------- Button open cash -------- */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-end",
          flexDirection: "row",
        }}
      >
        {!_.isEmpty(groupAppointment) ? (
          <View style={{ flexDirection: "row" }}>
            <ButtonGradient
              // disable={loading}
              // loading={loading}
              label={t("Share receipt")}
              width={scaleWidth(120)}
              height={scaleHeight(34)}
              borderRadius={scaleWidth(3)}
              fontSize={scaleFont(14)}
              textColor={colors.WHITE}
              onPress={shareTemptInvoice}
              leftChildren={() => (
                <>
                  <Image
                    source={ICON.share_icon}
                    style={{ width: scaleSize(14), height: scaleSize(16) }}
                  />
                  <View style={{ width: scaleWidth(10) }} />
                </>
              )}
            />
            <View style={{ width: scaleWidth(10) }} />

            <ButtonGradient
              // disable={loading}
              // loading={loading}
              label={t("Print receipt")}
              width={scaleWidth(120)}
              height={scaleHeight(34)}
              borderRadius={scaleWidth(3)}
              fontSize={scaleFont(14)}
              textColor={colors.WHITE}
              onPress={printTemptInvoice}
              leftChildren={() => (
                <>
                  <Image
                    source={ICON.print_btn}
                    style={{ width: scaleSize(14), height: scaleSize(16) }}
                  />
                  <View style={{ width: scaleWidth(10) }} />
                </>
              )}
            />
          </View>
        ) : (
          <View />
        )}

        <View style={{ width: scaleWidth(10) }} />

        <ButtonGradient
          // disable={loading}
          // loading={loading}
          label={t("Open cashier")}
          width={scaleWidth(120)}
          height={scaleHeight(34)}
          borderRadius={scaleWidth(3)}
          fontSize={scaleFont(14)}
          textColor={colors.WHITE}
          onPress={checkStatusCashier}
          leftChildren={() => (
            <>
              <Image
                source={ICON.cashier_btn}
                style={{ width: scaleSize(14), height: scaleSize(16) }}
              />
              <View style={{ width: scaleWidth(10) }} />
            </>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: scaleHeight(72),
    backgroundColor: colors.WHITE,

    flexDirection: "row",
    borderColor: "rgb(197,197,197)",
    borderTopColor: colors.VERY_LIGHT_PINK_1,
    borderWidth: 1,
    paddingHorizontal: scaleWidth(10),
  },

  avatar_box: {
    width: scaleSize(40),
    height: scaleSize(40),
    borderRadius: scaleSize(20),
    overflow: "hidden",
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
  },

  txt_avatar: {
    color: "#404040",
    fontSize: scaleSize(18),
    fontWeight: "bold",
  },

  txt_customer_name: {
    color: "#0764B0",
    fontSize: scaleSize(16),
    fontWeight: "600",
  },

  txt_customer_phone: {
    color: "#404040",
    fontSize: scaleSize(14),
    fontWeight: "400",
    marginTop: 5,
  },

  txt_enter_other_phone_number: {
    textDecorationLine: "underline",
    color: "#0764B0",
    fontSize: scaleSize(12),
    marginLeft: scaleSize(10),
  },

  btnCashier: {
    height: scaleSize(26),
    width: scaleSize(100),
    backgroundColor: "#0764B0",
    borderRadius: scaleSize(3),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  textBtnCashier: {
    fontWeight: "bold",
    fontSize: scaleSize(10),
    color: "#fff",
    marginLeft: scaleSize(4),
  },
});
