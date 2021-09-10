/**
 * RootNavigator
 *  + App1Navigator
 *  + App2Navigator
 *  + ...
 */
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { NativeModules } from "react-native";
import { MerchantNavigator } from "./MerchantNavigator";
import { isReadyRef, navigationRef } from "./NavigatorServices";

const { Screen, Navigator } = createStackNavigator();

export const RootNavigator = () => {
  React.useEffect(() => {
    try {
      NativeModules.logPax.loadLogPax();
    } catch (e) {
      console.log(e);
    }

    return () => {
      isReadyRef.current = false;
    };
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
    >
      {/* <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} /> */}
      <Navigator headerMode="none">
        <Screen name="MerchantNavigator" component={MerchantNavigator} />
      </Navigator>
    </NavigationContainer>
  );
};
