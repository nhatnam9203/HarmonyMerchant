import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "@shared/themes";
import { ScreenName } from "@src/ScreenName";
import React from "react";
import { StyleSheet, View } from "react-native";
import { AppointmentPage } from "../AppointmentPage";
import { BookAppointment } from "../CheckoutPage/BookAppointment";

const { Screen, Navigator } = createStackNavigator();

export const Layout = ({}) => {
  return (
    <View style={styles.container}>
      <Navigator
        headerMode="none"
        initialRouteName={ScreenName.SALON.APPOINTMENT}
        screenOptions={{
          cardStyle: {
            backgroundColor: colors.WHITE_FA,
          },
        }}
      >
        <Screen {...AppointmentPage} />
        <Screen {...BookAppointment} />
      </Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
