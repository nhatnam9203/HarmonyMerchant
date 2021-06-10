import useAxios from 'axios-hooks';
import { MERCHANT_LOGOUT } from '../route';
import { appMerchant, authMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useSignOut = () => {
  const dispatch = useDispatch();
  const [{ data: logoutData, loading, error, response }, execute] = useAxios(
    MERCHANT_LOGOUT,
    {
      manual: true,
    },
  );

  React.useEffect(() => {
    if (loading) {
      dispatch(appMerchant.showLoading());
    }
    if (!loading && response) {
      dispatch(appMerchant.hideLoading());
      dispatch(authMerchant.signOutApp());
    }
  }, [dispatch, loading, response]);

  const merchantLogout = (params) => {
    execute({
      data: params,
    });
  };

  return [logoutData, merchantLogout];
};
