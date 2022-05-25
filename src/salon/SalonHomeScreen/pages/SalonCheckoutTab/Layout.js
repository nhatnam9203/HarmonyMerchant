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
import { SalonHomeContextProvider } from "./SalonHomeContext";

const SALON_FLEX = 4;
const BASKET_FLEX = 3;

export const Layout = ({ onChangeModePayment, categoriesRef, ...props }) => {
  return (
    <View style={styles.container}>
      <SalonHomeContextProvider value={props}>
        <Header />
        <View style={[layouts.horizontal, layouts.fill]}>
          <SalonContent
            onChangeTab={onChangeModePayment}
            categoriesRef={categoriesRef}
          />
          <BasketContent />
        </View>
      </SalonHomeContextProvider>
    </View>
  );
};

const SalonContent = ({ onChangeTab, categoriesRef }) => {
  return (
    <View style={{ flex: SALON_FLEX }}>
      <ScrollableTabView
        style={layouts.fill}
        initialPage={0}
        locked={true}
        renderTabBar={() => <View />}
        onChangeTab={onChangeTab}
      >
        <Categories ref={categoriesRef} />
        <Payment />
      </ScrollableTabView>
    </View>
  );
};

const BasketContent = () => {
  return (
    <View style={{ flex: BASKET_FLEX }}>
      <Basket />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
