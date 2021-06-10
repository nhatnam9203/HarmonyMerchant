import useAxios from 'axios-hooks';
import { RETAILER_CUSTOMER } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useGetCustomer = () => {
  const dispatch = useDispatch();

  const [{ data: customer, loading, error, response }, execute] = useAxios(
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
  }, [customer?.data, dispatch, loading, response]);

  const getCustomer = (customerId) => {
    execute({
      url: `${RETAILER_CUSTOMER.url}/${customerId}`,
    });
  };

  return [customer, getCustomer];
};
