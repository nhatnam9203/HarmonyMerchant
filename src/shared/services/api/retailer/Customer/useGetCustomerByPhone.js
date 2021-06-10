import useAxios from 'axios-hooks';
import { RETAILER_CUSTOMER } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useGetCustomerByPhone = () => {
  const dispatch = useDispatch();

  const [{ data: customerByPhone, loading, error, response }, execute] =
    useAxios(
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
  }, [dispatch, loading, response]);

  const getCustomerByPhone = (phoneNumber) => {
    execute({
      url: `${RETAILER_CUSTOMER.url}/getbyphone/${phoneNumber}`,
    });
  };

  return [customerByPhone, getCustomerByPhone];
};
