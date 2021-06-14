/**
 * MerchantNavigator
 *  + SplashScreen
 *  + AuthNavigator
 *  + RetailerNavigator (working)
 *  + SalonNavigator (POS finished)
 *  + RestaurantNavigator (coming)
 */
import NavigationServices from "@navigators/NavigatorServices";
import { createStackNavigator } from "@react-navigation/stack";
import { SplashScreen } from "@src/merchant/SplashScreen";
import React from "react";
import { useSelector } from "react-redux";
import { AuthNavigator } from "./AuthNavigator";
import { RetailerNavigator } from "./RetailerNavigator";
import { SalonNavigator } from "./SalonNavigator";

const { Screen, Navigator } = createStackNavigator();

export const MerchantNavigator = () => {
  // redux
  const merchant = useSelector((state) => state.dataLocal.profile);
  const isPlash = useSelector((state) => state.appMerchant.isPlash);

  React.useEffect(() => {
    if (isPlash) {
      return;
    }
    const { type } = merchant || {};

    switch (type) {
      case Constants.APP_TYPE.POS:
        NavigationServices.replace("SalonNavigator");
        break;
      case Constants.APP_TYPE.RETAILER:
        NavigationServices.replace("RetailerNavigator");
        break;
      default:
        NavigationServices.replace("AuthNavigator");

        break;
    }
  }, [merchant?.type, isPlash]);

  return (
    <Navigator
      initialRouteName="SplashScreen"
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
    </Navigator>
  );
};
