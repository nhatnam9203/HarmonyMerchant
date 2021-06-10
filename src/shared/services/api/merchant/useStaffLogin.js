import useAxios from 'axios-hooks';
import { STAFF_LOGIN } from '../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useStaffLogin = () => {
  const dispatch = useDispatch();
  const [{ data: staffLogin, loading, error, response }, execute] = useAxios(
    { method: 'POST', url: STAFF_LOGIN.url },
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
    }
  }, [dispatch, loading, response]);

  const loginStaff = (params) => {
    execute({
      data: params,
    });
  };

  return [staffLogin, loginStaff];
};
