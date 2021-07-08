import React from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeOrderListPage } from "../HomeOrderListPage";
import { HomeOrderDetailPage } from "../HomeOrderDetailPage";
import { CheckOutTabPage } from "../CheckOutTabPage";
import { HomeOrderPayPage } from "../HomeOrderPayPage";
import { HomeOrderReturnPage } from "../HomeOrderReturnPage";
import { EditAddressPage } from "../../../pages";

import { colors } from "@shared/themes";

const { Screen, Navigator } = createStackNavigator();

export const Layout = ({}) => {
  return (
    <View style={styles.container}>
      <Navigator
        initialRouteName="retailer.home.order.list"
        headerMode="none"
        screenOptions={{
          cardStyle: {
            backgroundColor: colors.WHITE_FA,
          },
        }}
      >
        <Screen {...HomeOrderListPage} />
        <Screen {...HomeOrderDetailPage} />
        {/* <Screen {...CheckOutTabPage} /> */}
        <Screen {...HomeOrderPayPage} />
        <Screen {...HomeOrderReturnPage} />
        <Screen {...EditAddressPage} />
      </Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE_FA,
  },
});
