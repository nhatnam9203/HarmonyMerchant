/**
 * AuthNavigator (screens of merchant use for POS and Retailer)
 *  + SignInScreen
 *  + SignUpScreen
 *  + IntroScreen
 *  + ForgotScreen
 *  + UserGuildScreen
 *  + TermScreen
 */

import { createStackNavigator } from "@react-navigation/stack";
import { ForgotPassword } from "@src/merchant/ForgotPassword";
// import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';
import { SignInScreen } from "@src/merchant/SignInScreen";
import React from "react";
import { Animated } from "react-native";
import { SignUpScreen, TermsScreen } from "../screens";
const { Screen, Navigator } = createStackNavigator();

const forSlide = ({ current, next, inverted, layouts: { screen } }) => {
  const progress = Animated.add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: "clamp",
        })
      : 0
  );

  return {
    cardStyle: {
      transform: [
        {
          translateX: Animated.multiply(
            progress.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [
                screen.width, // Focused, but offscreen in the beginning
                0, // Fully focused
                screen.width * -0.3, // Fully unfocused
              ],
              extrapolate: "clamp",
            }),
            inverted
          ),
        },
      ],
    },
  };
};

export const AuthNavigator = () => {
  return (
    <Navigator
      initialRouteName="merchant.signin"
      headerMode="none"
      screenOptions={{
        cardStyleInterpolator: forSlide,
      }}
    >
      <Screen {...SignInScreen} />
      <Screen {...ForgotPassword} />
      <Screen name="merchant.signup" component={SignUpScreen} />
      <Screen name="merchant.terms" component={TermsScreen} />
    </Navigator>
  );
};
