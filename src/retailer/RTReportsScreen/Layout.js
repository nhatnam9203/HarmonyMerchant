import { StatusBarHeader } from "@components";
import { createStackNavigator } from "@react-navigation/stack";
import { ButtonDrawer } from "@shared/components/ButtonDrawer";
import { HeaderToolBar } from "@shared/components/HeaderToolBar";
import { HeaderToolBarTitle } from "@shared/components/HeaderToolBarTitle";
import { ButtonGradient } from "@shared/components";
import { colors } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Image } from "react-native";
import ReportScreen from "./ReportScreen";
import IMAGE from "@resources";
import { PermissionChecker } from "@shared/components";
import { menuTabs } from "@utils";

export const Layout = ({
  openDrawer,
  screenReportRef,
  onShowBackButton,
  onHandleBack,
  isShowBackButton,
  navigation,
  tabPermission,
  togglePopupPermission,
}) => {
  const { t } = useTranslation();

  const onRenderBackButton = () => {
    return isShowBackButton ? (
      <ButtonGradient
        width={scaleWidth(48)}
        height={scaleHeight(48)}
        borderRadius={0}
        onPress={onHandleBack}
      >
        <Image
          source={IMAGE.BackButtonIcon}
          style={{
            width: scaleWidth(26),
            height: scaleHeight(26),
          }}
          resizeMode="contain"
        />
      </ButtonGradient>
    ) : null;
  };

  return (
    <View style={styles.container}>
      <StatusBarHeader />
      <HeaderToolBar
        leftComponent={() => <ButtonDrawer onPress={openDrawer} />}
        rightComponent={onRenderBackButton}
      >
        <HeaderToolBarTitle label={t("Reports")} />
      </HeaderToolBar>
      <ReportScreen ref={screenReportRef} showBackButton={onShowBackButton} />
      <PermissionChecker
        navigation={navigation}
        tabName={menuTabs.MENU_REPORT}
        tabPermission={tabPermission}
        togglePopupPermission={togglePopupPermission}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE_FA,
  },
});
