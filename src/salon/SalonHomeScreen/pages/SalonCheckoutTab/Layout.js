import { colors, layouts } from "@shared/themes";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Categories } from "./Categories";
import { SalonHomeContextProvider } from "./SalonHomeContext";
import { Basket, CustomerPanel } from "./widgets";

const SALON_FLEX = 6.1;
const BASKET_FLEX = 3.9;

export const Layout = ({ onChangeModePayment, categoriesRef, ...props }) => {
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
