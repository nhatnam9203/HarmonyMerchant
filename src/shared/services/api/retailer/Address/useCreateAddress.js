import useAxios from 'axios-hooks';
import { RETAILER_CUSTOMER } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useCreateAddress = () => {
  const dispatch = useDispatch();

  const [{ data: addressCreate, loading, error, response }, execute] = useAxios(
    { method: 'POST' },
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
  }, [addressCreate?.data, dispatch, loading, response]);

  const createAddress = (params, customerId) => {
    execute({
      data: params,
      url: `${RETAILER_CUSTOMER.url}/${customerId}/address`,
    });
  };

  return [addressCreate, createAddress];
};
