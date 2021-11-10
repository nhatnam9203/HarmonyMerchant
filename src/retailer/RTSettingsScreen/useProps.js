import actions from "@actions";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { settingRetailer } from "@redux/slices";
import { SettingGeneralPage } from "./pages/SettingGeneralPage";

export const useProps = ({ navigation }) => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      dispatch(settingRetailer.setActiveTab(SettingGeneralPage.name));
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      dispatch(settingRetailer.setActiveTab("none"));
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  return {
    changeLanguage: (locale = "vi") => i18n.changeLanguage(locale),
    openDrawer: () => {
      navigation.openDrawer();
    },
    navigation,
    tabPermission: useSelector((state) => state.app?.settingTabPermission),
    togglePopupPermission: (bl) => {
      dispatch(actions.app.toggleSettingTabPermission(bl ?? true));
    },
  };
};
