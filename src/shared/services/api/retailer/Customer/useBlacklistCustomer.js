import useAxios from 'axios-hooks';
import { RETAILER_CUSTOMER } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useBlacklistCustomer = () => {
  const dispatch = useDispatch();

  const [{ data: customerBlacklist, loading, error, response }, execute] =
    useAxios(
      { method: 'PUT' },
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
  }, [customerBlacklist?.data, dispatch, loading, response]);

  const blacklistCustomer = (id, act) => {
    execute({
      url: `${RETAILER_CUSTOMER.url}/${id}/${act}`,
    });
  };

  return [customerBlacklist, blacklistCustomer];
};
