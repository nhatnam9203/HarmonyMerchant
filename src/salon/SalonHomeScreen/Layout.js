import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Button,
  HomeTabBar,
  ParentContainer,
  PopupCheckStaffPermission,
  PopupEnterPin,
  ScrollableTabView,
  StatusBarHeader,
} from "@components";
import { createStackNavigator } from "@react-navigation/stack";
import { LayoutPages } from "./pages";
import { colors } from "@shared/themes";

const { Screen, Navigator } = createStackNavigator();

export const Layout = ({
  handleLockScreen,
  activeScreen,
  navigation,
  clearIntervalById,
}) => {
  return (
    <ParentContainer
      handleLockScreen={handleLockScreen}
      activeScreen={activeScreen}
      navigation={navigation}
      clearIntervalById={clearIntervalById}
    >
      <View style={styles.container}>
        <StatusBarHeader />
        <Navigator
          headerMode="none"
          screenOptions={{
            cardStyle: {
              backgroundColor: colors.WHITE_FA,
            },
          }}
        >
          <Screen {...LayoutPages} />
        </Navigator>
      </View>
    </ParentContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
