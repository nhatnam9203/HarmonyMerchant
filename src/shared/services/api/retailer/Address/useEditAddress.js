import useAxios from 'axios-hooks';
import { RETAILER_CUSTOMER } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useEditAddress = () => {
  const dispatch = useDispatch();

  const [{ data: addressEdit, loading, error, response }, execute] = useAxios(
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
  }, [addressEdit?.data, dispatch, loading, response]);

  const editAddress = (params, customerId) => {
    execute({
      data: params,
      url: `${RETAILER_CUSTOMER.url}/${customerId}/address/${params.id}`,
    });
  };

  return [addressEdit, editAddress];
};
