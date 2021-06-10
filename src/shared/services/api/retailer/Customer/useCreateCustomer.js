import useAxios from 'axios-hooks';
import { RETAILER_CUSTOMER } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useCreateCustomer = () => {
  const dispatch = useDispatch();

  const [{ data: customerCreate, loading, error, response }, execute] =
    useAxios(
      { method: 'POST', url: RETAILER_CUSTOMER.url },
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
  }, [customerCreate?.data, dispatch, loading, response]);

  const createCustomer = (params) => {
    execute({
      data: params,
    });
  };

  return [customerCreate, createCustomer];
};
