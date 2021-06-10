import useAxios from 'axios-hooks';
import { RETAILER_ORDER } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useDeleteOrder = (onCallback) => {
  const dispatch = useDispatch();

  const [{ data: orderDelete, loading, error, response }, execute] = useAxios(
    { method: 'DELETE' },
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
      if (onCallback && typeof onCallback === 'function') {
        onCallback();
      }
    }
  }, [ dispatch, loading, response]);

  const deleteOrder = (orderId) => {
    execute({
      url: `${RETAILER_ORDER.url}/${orderId}`,
    });
  };

  return [orderDelete, deleteOrder];
};
