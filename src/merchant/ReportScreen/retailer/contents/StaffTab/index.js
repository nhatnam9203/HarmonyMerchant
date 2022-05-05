import { colors } from "@shared/themes";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { CustomTopTab } from "../../../widget";
import StaffTab from "./Salary";
import { StaffLogTime } from "./LogTime";

const { Screen, Navigator } = createMaterialTopTabNavigator();

export const ReportStaffTab = React.forwardRef(
  (
    {
      route: {
        params: { showBackButton },
      },
    },
    ref
  ) => {
    const { t } = useTranslation();

    return (
      <View style={styles.container}>
        <Navigator
          headerMode="none"
          screenOptions={{
            cardStyle: {
              backgroundColor: colors.WHITE_FA,
            },
          }}
          lazy={true}
          optimizationsEnabled={true}
          swipeEnabled={false}
          tabBar={(props) => <CustomTopTab {...props} />}
        >
          <Screen
            name={"ReportStaffSalaryTab"}
            component={StaffTab}
            options={{
              title: t("Salary"),
            }}
            initialParams={{ showBackButton: showBackButton }}
          />
          {/* <Screen
            name={"ReportStaffLogTimeTab"}
            component={StaffLogTime}
            options={{
              title: t("Log Time"),
            }}
            initialParams={{ showBackButton: showBackButton }}
          /> */}
        </Navigator>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    paddingTop: scaleHeight(15),
  },
});
