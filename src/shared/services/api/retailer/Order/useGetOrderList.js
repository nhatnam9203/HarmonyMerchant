import useAxios from 'axios-hooks';
import { RETAILER_ORDER } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useGetOrderList = () => {
  const dispatch = useDispatch();

  const [{ data: orderList, loading, error, response }, execute] = useAxios(
    { method: 'GET', url: `${RETAILER_ORDER.url}` },
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

  const getOrderList = (params) => {
    execute({
      params: params,
    });
  };

  return [orderList, getOrderList];
};
