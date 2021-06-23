import useAxios from 'axios-hooks';
import { RETAILER_ORDER } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useCreateOrder = () => {
  const dispatch = useDispatch();

  const [{ data: orderCreate, loading, error, response }, execute] = useAxios(
    { method: 'POST', url: RETAILER_ORDER.url },
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
  }, [orderCreate?.data, dispatch, loading, response]);

  const createOrder = (params) => {
    execute({
      data: params,
    });
  };

  return [orderCreate, createOrder];
};
