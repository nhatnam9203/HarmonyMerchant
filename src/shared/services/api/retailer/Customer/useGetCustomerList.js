import useAxios from 'axios-hooks';
import { RETAILER_CUSTOMER } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useGetCustomerList = () => {
  const dispatch = useDispatch();

  const [{ data: customerList, loading, error, response }, execute] = useAxios(
    { method: 'GET', url: `${RETAILER_CUSTOMER.url}/search` },
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
  }, [customerList?.data, dispatch, loading, response]);

  const getCustomerList = (params) => {
    execute({
      params: params,
    });
  };

  return [customerList, getCustomerList];
};
