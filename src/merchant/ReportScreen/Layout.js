import { StatusBarHeader } from "@components";
import IMAGE from "@resources";
import { ButtonGradient, PermissionChecker } from "@shared/components";
import { ButtonDrawer } from "@shared/components/ButtonDrawer";
import { HeaderToolBar } from "@shared/components/HeaderToolBar";
import { HeaderToolBarTitle } from "@shared/components/HeaderToolBarTitle";
import { menuTabs } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, View } from "react-native";
import { ReportScreen } from "./salon";

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
  },
});
