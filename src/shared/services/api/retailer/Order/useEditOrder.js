import useAxios from 'axios-hooks';
import { RETAILER_ORDER } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useEditOrder = () => {
  const dispatch = useDispatch();

  const [{ data: orderEdit, loading, error, response }, execute] = useAxios(
    { method: 'PUT',  },
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
  }, [orderEdit?.data, dispatch, loading, response]);

  const editOrder = (params, id) => {
    execute({
      data: params,
      url: `${RETAILER_ORDER.url}/${id}`,
    });
  };

  return [orderEdit, editOrder];
};
