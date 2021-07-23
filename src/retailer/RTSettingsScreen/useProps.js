import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import actions from "@actions";

export const useProps = ({ navigation }) => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();

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
