import { ParentContainer, StatusBarHeader } from "@components";
import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "@shared/themes";
import React from "react";
import { StyleSheet, View } from "react-native";
import { PageLayout } from "./pages";

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
          <Screen {...PageLayout} />
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
