import { colors, layouts } from "@shared/themes";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Categories } from "./Categories";
import { Basket } from "./Basket";
import { SalonHomeContextProvider } from "./SalonHomeContext";
import { CustomerPanel } from "./widgets";
import {
  PopupDiscount,
  PopupBlockDiscount,
  PopupDiscountLocal,
} from "./Dialogs";
import { i18n } from "@shared/services";

const SALON_FLEX = 6.1;
const BASKET_FLEX = 3.9;

export const Layout = ({
  onChangeModePayment,
  categoriesRef,
  popupDiscountRef,
  popupDiscountLocalRef,
  visiblePopupDiscountLocal,
  onRequestClosePopupDiscountLocal,
  callbackDiscountToParent,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <SalonHomeContextProvider value={props}>
        <CustomerPanel />
        <View
          style={[
            layouts.horizontal,
            layouts.fill,
            // { flexDirection: "row-reverse" },
          ]}
        >
          <SalonContent
            onChangeTab={onChangeModePayment}
            categoriesRef={categoriesRef}
          />
          <BasketContent />
        </View>

        <PopupDiscount ref={popupDiscountRef} title={i18n.t("Discount")} />
        <PopupBlockDiscount title={i18n.t("Discount")} />
        <PopupDiscountLocal
          ref={popupDiscountLocalRef}
          visible={visiblePopupDiscountLocal}
          title={i18n.t("Discount")}
          onRequestClose={onRequestClosePopupDiscountLocal}
          callbackDiscountToParent={(
            customDiscountPercentLocal,
            customDiscountFixedLocal,
            discountTotalLocal
          ) =>
            callbackDiscountToParent(
              customDiscountPercentLocal,
              customDiscountFixedLocal,
              discountTotalLocal
            )
          }
        />
      </SalonHomeContextProvider>
    </View>
  );
};

const SalonContent = ({ onChangeTab, categoriesRef }) => {
  return (
    <View style={{ flex: SALON_FLEX, zIndex: 100 }}>
      <Categories ref={categoriesRef} />

      {/* <ScrollableTabView
        style={[layouts.fill, { zIndex: 100 }]}
        initialPage={0}
        locked={true}
        renderTabBar={() => <View />}
        onChangeTab={onChangeTab}
      >
        <Categories ref={categoriesRef} />
        <Payment />
      </ScrollableTabView> */}
    </View>
  );
};

const BasketContent = () => {
  return (
    <View style={[{ flex: BASKET_FLEX }, styles.border]}>
      <Basket />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  border: {
    borderStyle: "solid",
    borderLeftWidth: 1,
    borderLeftColor: colors.VERY_LIGHT_PINK,
    borderRightWidth: 1,
    borderRightColor: colors.VERY_LIGHT_PINK,
  },
});
