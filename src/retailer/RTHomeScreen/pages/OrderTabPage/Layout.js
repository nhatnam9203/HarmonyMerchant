import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "@shared/themes";
import React from "react";
import { StyleSheet, View } from "react-native";
import { EditAddressPage } from "../../../pages";
import { HomeOrderDetailPage } from "../HomeOrderDetailPage";
import { HomeOrderListPage } from "../HomeOrderListPage";
import { HomeOrderPayPage } from "../HomeOrderPayPage";
import { HomeOrderReturnPage } from "../HomeOrderReturnPage";
import { HomeOrderCheckOutPage } from "../HomeOrderCheckOutPage";

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
        <Screen {...HomeOrderCheckOutPage} />
        <Screen {...HomeOrderDetailPage} />
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
