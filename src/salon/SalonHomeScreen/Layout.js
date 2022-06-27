import { ParentContainer, StatusBarHeader } from "@components";
import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "@shared/themes";
import React from "react";
import { StyleSheet, View } from "react-native";
import { PageLayout } from "./pages";
import { SalonHomePageContextProvider } from "./controllers";

const { Screen, Navigator } = createStackNavigator();

export const Layout = ({
  navigation,
  handleLockScreen,
  activeScreen,
  clearIntervalById,
  ...props
}) => {
  return (
    <ParentContainer
      handleLockScreen={handleLockScreen}
      activeScreen={activeScreen}
      navigation={navigation}
      clearIntervalById={clearIntervalById}
    >
      <SalonHomePageContextProvider value={props}>
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
      </SalonHomePageContextProvider>
    </ParentContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
