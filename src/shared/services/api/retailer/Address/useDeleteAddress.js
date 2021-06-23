import useAxios from 'axios-hooks';
import { RETAILER_CUSTOMER } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useDeleteAddress = (onCallback) => {
  const dispatch = useDispatch();

  const [{ data: addressDelete, loading, error, response }, execute] = useAxios(
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
  }, [dispatch, loading, response]);

  const deleteAddress = (addressId, customerId) => {
    execute({
      url: `${RETAILER_CUSTOMER.url}/${customerId}/address/${addressId}`,
    });
  };

  return [addressDelete, deleteAddress];
};
