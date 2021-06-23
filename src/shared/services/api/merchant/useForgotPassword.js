import useAxios from 'axios-hooks';
import { MERCHANT_FORGOT_PASSWORD } from '../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useForgotPassword = () => {
  const dispatch = useDispatch();
  const [{ data: forgotData, loading, response, error }, execute] = useAxios(
    MERCHANT_FORGOT_PASSWORD,
    {
      manual: true,
    }
  );

  React.useEffect(() => {
    if (loading) {
      dispatch(appMerchant.showLoading());
    }
    if (!loading && response) {
      dispatch(appMerchant.hideLoading());
    }
  }, [dispatch, loading, response]);

  const merchantForgotPassWord = (params) => {
    execute({ params });
  };
  return [forgotData, merchantForgotPassWord];
};
