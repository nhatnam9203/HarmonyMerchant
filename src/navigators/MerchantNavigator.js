/**
 * MerchantNavigator
 *  + SplashScreen
 *  + AuthNavigator
 *  + RetailerNavigator (working)
 *  + SalonNavigator (POS finished)
 *  + RestaurantNavigator (coming)
 */
import { createStackNavigator } from "@react-navigation/stack";
import { SplashScreen } from "@src/merchant/SplashScreen";
import React from "react";
import { NativeModules } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CongratulationScreen, StoreInfoScreen } from "../screens";
import { AuthNavigator } from "./AuthNavigator";
import { RetailerNavigator } from "./RetailerNavigator";
import { SalonNavigator } from "./SalonNavigator";

const { Screen, Navigator } = createStackNavigator();

const SetupStoreStack = () => (
  <Navigator initialRouteName="StoreInfo" headerMode="none">
    <Screen name="StoreInfo" component={StoreInfoScreen} />
    <Screen name="Congratulation" component={CongratulationScreen} />
  </Navigator>
);

export const MerchantNavigator = () => {
  // redux
  const dispatch = useDispatch();
  const merchant = useSelector((state) => state.dataLocal.profile);
  const isPlash = useSelector((state) => state.appMerchant.isPlash);

  // React.useEffect(() => {
  //   if (isPlash) {
  //     return;
  //   }
  //   const { type } = merchant || {};
  //   if (merchant?.needSetting) {
  //     dispatch(loginStaff(merchant.merchantCode, "0000"));
  //     NavigationServices.replace("SetupStore");
  //   } else {
  //     switch (type) {
  //       case Constants.APP_TYPE.POS:
  //         NavigationServices.replace("SalonNavigator");
  //         break;
  //       case Constants.APP_TYPE.RETAILER:
  //         NavigationServices.replace("RetailerNavigator");
  //         break;
  //       default:
  //         NavigationServices.replace("AuthNavigator");

  //         break;
  //     }
  //   }
  // }, [merchant?.type, isPlash]);

  React.useEffect(() => {
    if (merchant) {
      NativeModules.logPax.loadLogPax();
    }
  }, [merchant]);

  return (
    <Navigator
      initialRouteName="merchant.splash"
      headerMode="none"
      screenOptions={{
        cardOverlayEnabled: true,
        cardStyleInterpolator: ({ current: { progress } }) => ({
          cardStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 0.5, 0.9, 1],
              outputRange: [0, 0.25, 0.7, 1],
            }),
          },
          overlayStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
              extrapolate: "clamp",
            }),
          },
        }),
        gestureEnabled: false,
      }}
      mode="modal"
    >
      <Screen {...SplashScreen} />
      <Screen
        name="AuthNavigator"
        component={AuthNavigator}
        options={{
          gestureEnabled: false,
        }}
      />
      <Screen name="RetailerNavigator" component={RetailerNavigator} />
      <Screen name="SalonNavigator" component={SalonNavigator} />
      <Screen name="SetupStore" component={SetupStoreStack} />
    </Navigator>
  );
};
