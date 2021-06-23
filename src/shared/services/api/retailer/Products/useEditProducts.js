import useAxios from 'axios-hooks';
import { RETAILER_PRODUCTS } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useEditProducts = () => {
  const dispatch = useDispatch();

  const [{ data: productsEdit, loading, error, response }, execute] = useAxios(
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
  }, [productsEdit?.data, dispatch, loading, response]);

  const editProducts = (params, id) => {
    execute({
      data: params,
      url: `${RETAILER_PRODUCTS.url}/${id}`,
    });
  };

  return [productsEdit, editProducts];
};
