import { useTranslation } from 'react-i18next';
import React from 'react';
import actions from '@redux/actions';
import { useDispatch } from 'react-redux';
export const useProps = ({ navigation, params: { reload } }) => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  return {
    changeLanguage: (locale = 'vi') => i18n.changeLanguage(locale),
    openDrawer: () => {
      navigation.openDrawer();
    },
    reload,
    logOut: () => {
      dispatch(actions.auth?.requestLogout());
    },
  };
};
