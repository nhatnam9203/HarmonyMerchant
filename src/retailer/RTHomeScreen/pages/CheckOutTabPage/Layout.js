import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { HomeOrderCheckOutPage } from "../HomeOrderCheckOutPage";
import { HomeOrderDetailPage } from "../HomeOrderDetailPage";
import { HomeOrderPayPage } from "../HomeOrderPayPage";

const { Screen, Navigator } = createStackNavigator();

export const Layout = ({}) => {
  const [t] = useTranslation();

  return (
    <View style={styles.container}>
      <Navigator
        initialRouteName="retailer.home.order.check_out"
        headerMode="none"
        screenOptions={{
          cardStyle: {
            backgroundColor: colors.WHITE_FA,
          },
        }}
      >
        <Screen {...HomeOrderCheckOutPage} />
        <Screen {...HomeOrderDetailPage} />
        <Screen {...HomeOrderPayPage} />
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
