import useAxios from 'axios-hooks';
import { RETAILER_CUSTOMER } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useEditCustomer = () => {
  const dispatch = useDispatch();

  const [{ data: customerEdit, loading, error, response }, execute] = useAxios(
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
  }, [customerEdit?.data, dispatch, loading, response]);

  const editCustomer = (params, id) => {
    execute({
      data: params,
      url: `${RETAILER_CUSTOMER.url}/${id}`,
    });
  };

  return [customerEdit, editCustomer];
};
