import useAxios from 'axios-hooks';
import { RETAILER_ORDER } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useGetOrder = () => {
  const dispatch = useDispatch();

  const [{ data: order, loading, error, response }, execute] = useAxios(
    { method: 'GET' },
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
  }, [order?.data, dispatch, loading, response]);

  const getOrder = (orderId) => {
    execute({
      url: `${RETAILER_ORDER.url}/${orderId}`,
    });
  };

  return [order, getOrder];
};
