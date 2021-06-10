import { useTranslation } from 'react-i18next';
import React from 'react';
import { useSignOut } from '@shared/services/api/merchant';

export const useProps = ({ navigation, params: { reload } }) => {
  const { i18n } = useTranslation();
  const [, merchantLogout] = useSignOut();

  return {
    changeLanguage: (locale = 'vi') => i18n.changeLanguage(locale),
    openDrawer: () => {
      navigation.openDrawer();
    },
    reload,
    logOut: () => {
      merchantLogout({});
    },
  };
};
