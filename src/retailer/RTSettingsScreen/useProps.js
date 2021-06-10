import { useTranslation } from 'react-i18next';

export const useProps = ({ navigation }) => {
  const { i18n } = useTranslation();

  return {
    changeLanguage: (locale = 'vi') => i18n.changeLanguage(locale),
    openDrawer: () => {
      navigation.openDrawer();
    },
  };
};
