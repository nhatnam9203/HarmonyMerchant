import useAxios from 'axios-hooks';
import { RETAILER_PRODUCTS } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useCreateProducts = () => {
  const dispatch = useDispatch();

  const [{ data: productsCreate, loading, error, response }, execute] =
    useAxios(
      { method: 'POST', url: RETAILER_PRODUCTS.url },
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
  }, [productsCreate?.data, dispatch, loading, response]);

  const createProducts = (params) => {
    execute({
      data: params,
    });
  };

  return [productsCreate, createProducts];
};
