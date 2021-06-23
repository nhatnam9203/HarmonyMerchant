import useAxios from 'axios-hooks';
import { RETAILER_PRODUCTS } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useGetProductsList = () => {
  const dispatch = useDispatch();

  const [{ data: productsList, loading, error, response }, execute] = useAxios(
    { method: 'GET', url: `${RETAILER_PRODUCTS.url}` },
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
  }, [productsList?.data, dispatch, loading, response]);

  const getProductsList = (params) => {
    execute({
      params: params,
    });
  };

  return [productsList, getProductsList];
};
